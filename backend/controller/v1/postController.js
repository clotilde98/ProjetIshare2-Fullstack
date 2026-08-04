import { pool } from "../../database/database.js";
import {createPostCategory, deletePostCategoriesForPostID, getPostswithAllCategories } from '../../model/v1/postCategory.js'
import * as postModel from '../../model/v1/postDB.js';
import { getUserById } from "../../model/v1/client.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {saveImage} from '../../middleware/saveImage.js';
import * as uuid from 'uuid'
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { readProductCategoryFromID } from "../../model/v1/productType.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       description: Represents a blog post or article
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the post
 *         post_date:
 *           type: string
 *           format: date
 *           description: Date when the post was created
 *         description:
 *           type: string
 *           description: Detailed content of the post
 *         title:
 *           type: string
 *           description: Title of the post
 *         number_of_places:
 *           type: integer
 *         post_status:
 *           type: string
 *           description: Current status of the post
 *           enum: [available, unavailable]
 *         photo:
 *           type: string
 *           description: A local URL pointing to an image on the development server
 *         street:
 *           type: string
 *           description: Street name for location-based posts
 *         street_number:
 *           type: string
 *         address_id:
 *           type: integer
 *           description: Reference to the address
 *         client_id:
 *           type: integer
 *           description: Reference to the client
 * 
 *   responses:
 *     PostResponse:
 *       description: Post successfully returned
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 */

export const getPost = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).send("Invalid post ID");
        }

        const post = await postModel.readPost(pool, id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const photoUrl = post.photo
        ? `/images/${post.photo}.jpeg` 
        : null;

        post.photo = photoUrl;

        res.status(200).json(post);

    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
    }
};

export const getMyPosts = async (req, res) => {
    try {

        const userID = req.user.id;
        const posts = await postModel.readMyPosts(pool, userID);


        if (posts.length > 0) {
            for (const post of posts) {
                post.photo = post.photo
                ? `/images/${post.photo}.jpeg`
                : null;
            }
            }

        res.status(200).json(posts);

    } catch (err) {
       console.error("Internal server error", err);
       return res.status(500).send("Internal server error");
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     AllPostsRead:
 *       description: All posts have been successfully retrieved.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Post'
 *                     - type: object
 *                       properties:
 *                         number_of_places:
 *                           type: integer
 *                           description: Number of available places remaining
 *                         username:
 *                           type: string
 *                         categories:
 *                           type: string
 *                         postal_code:
 *                           type: string
 *                         city:
 *                           type: string
 *               total:
 *                 type: integer
 *                 description: Total number of posts matching the search criteria
 */

export const getPosts = async (req, res) => {
    try {
        const { city, postStatus, limit, page} = req.query;

        



        const limitResult = validatePagination(
          limit,
          PAGINATION.DEFAULT_LIMIT,
          PAGINATION.MIN_LIMIT,
          PAGINATION.MAX_LIMIT,
          'limit'
        );
    

        const pageResult = validatePagination(
            page,
            PAGINATION.DEFAULT_PAGE,
            PAGINATION.MIN_PAGE,
            PAGINATION.MAX_PAGE,
            'page'
        );


        const posts = await postModel.getPosts(pool, {
            city,
            postStatus,
            page: pageResult, 
            limit: limitResult  
        });

         if (posts.rows.length > 0) {
            for (const post of posts.rows) {
                post.photo = post.photo
                ? `/images/${post.photo}.jpeg`
                : null;
            }
        }

        return res.status(200).json(posts);

    } catch (err) {
        if (err instanceof PaginationValidationError) {
            return res.status(400).json({ error: err.message }); 
        }
       console.error("Internal server error", err);
       return res.status(500).send("Internal server error");
    }
}

/**
 * @swagger
 * components: 
 *   responses: 
 *     PostCreated:
 *       description: The post has been successfully created
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object
 *             properties: 
 *               post: 
 *                  $ref: '#/components/schemas/Post'
 */

export const createPost = async (req, res) => {
    let client;
    try {

        let userID = req.user.id;

        const user = await getUserById(pool, userID);

        if (!user) {
            return res.status(401).send("User doesn't exist.");
        }

        const photo = req.file;

        if (req.body.providedClientID) {
            if (req.user.isAdmin) {
                userID = req.body.providedClientID;
            } else {
                return res.status(403).send("Admin privilege required");
            }
        }

        let imageName = null;

        let categoriesProduct = [];
        if (req.body.categoriesProduct) {
            categoriesProduct = JSON.parse(req.body.categoriesProduct);
            if (!Array.isArray(categoriesProduct) || categoriesProduct.length === 0) {
                return res.status(400).send("Post category required.");
            }
        } else {
            return res.status(400).send("Post category required.")
        }

        for (const categoryID of categoriesProduct) {
            const category = await readProductCategoryFromID(pool, categoryID);
            if (!category) {
                return res.status(404).send(`Category product with ID ${categoryID} not found`);
            }
        }


        client = await pool.connect();
        await client.query('BEGIN');

        if (photo){
            const destFolderImages = './middleware/photo';
            imageName = uuid.v4();
            req.body.photo = imageName;
            await saveImage(photo.buffer, imageName, destFolderImages); 
        }

        const post = await postModel.createPost(client, userID, req.body);
        const postID = post.id;

        for (const categoryID of categoriesProduct) {
            await createPostCategory(client, { IDCategory: categoryID, IDPost: postID });
        }

        await client.query('COMMIT');

        res.status(201).send({ post });

    } catch (err) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Internal server error", err);
        return res.status(500).send("Internal server error");

    } finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * @swagger
 * components: 
 *   responses: 
 *     PostUptated:
 *       description: The post has been successfully updated 
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object
 *             properties: 
 *               updatedPost: 
 *                  $ref: '#/components/schemas/Post'
 */

export const updatePost = async (req, res) => {
    let client;
    try {
        let userID = req.user.id;
        const postID = Number(req.params.id);

        if (Number.isNaN(postID)) {
            return res.status(400).send("Invalid post ID");
        }
        
        const post = await postModel.readPost(pool, postID);
        
        if (!post){
            return res.status(404).send("Post not found")
        }

        if (post.client_id === userID || req.user.isAdmin){
            let imageName = null;
            const photo = req.file;
            if (photo) {
                const destFolderImages = './middleware/photo';
                imageName = uuid.v4();
                req.body.photo = imageName;
                await saveImage(photo.buffer, imageName, destFolderImages);
            }


            let categoriesProduct = [];
            if (req.body.categoriesProduct) {
                categoriesProduct = JSON.parse(req.body.categoriesProduct);
                if (!Array.isArray(categoriesProduct) || categoriesProduct.length === 0) {
                    return res.status(400).send("Post category required.");
                }
            } else {
                return res.status(400).send("Post category required.")
            }

            for (const categoryID of categoriesProduct) {
                const category = await readProductCategoryFromID(pool, categoryID);
                if (!category) {
                    return res.status(400).send(`Category product with ID ${categoryID} doesn't exist`);
                }
            }

            client = await pool.connect();
            await client.query('BEGIN');

            await deletePostCategoriesForPostID(client, postID);


            for (const categoryID of categoriesProduct) {
                await createPostCategory(client, { IDCategory: categoryID, IDPost: postID });
            }

            const updatedPost = await postModel.updatePost(client, postID, req.body); 


            await client.query('COMMIT');

            return res.status(200).send({updatedPost});
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err){
        if (client) await client.query('ROLLBACK');
        console.error("Internal server error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (client) client.release();
    }
}

export const deletePost = async (req, res) => {
    try {
        const userID = req.user.id;
        const postID = Number(req.params.id);
        if (Number.isNaN(postID)) {
            return res.status(400).send("Invalid post ID");
        }

        const post = await postModel.readPost(pool, postID);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.client_id === userID || req.user.isAdmin){
            await postModel.deletePost(pool, postID);
            res.status(200).send("Post deleted");
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error");
    }
};

export const deleteImageFromPost  = async (req, res) => {
    try {
        const userID = req.user.id; 
        const postID = Number(req.params.id); 
        if(Number.isNaN(postID)){
            return res.status(400).send("Invalid post ID");
        }
        const post = await postModel.readPost(pool, postID); 
        
        if(!post){
            return res.status(404).send("Post not found");
        }

        if (post.client_id === userID || req.user.isAdmin){
            
            const destFolderImages = './middleware/photo';
            const imagePath = path.join(destFolderImages, `${post.photo}.jpeg`); 

            await fs.unlink(imagePath); 

            await postModel.deleteImageFromPost(pool, req.params.id); 

            res.status(200).send("The image in the post has been removed.");

        } else {
            return res.status(403).send("Admin privilege required.");
        } 
    }catch (err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error");
    }
}

/**
 * @swagger
 * components:
 *   responses:
 *     AllPostByCategory:
 *       description: Requested posts from a certain category are returned.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               allOf:
 *                 - $ref: '#/components/schemas/Post'
 *                 - type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                     category_id:
 *                       type: integer
 *                     category_name:
 *                       type: string
 */


export const searchPostsByCategory = async(req, res) => {
    try {
         const posts = await postModel.searchPostByCategory(pool, req.query.nameCategory);
         res.status(200).send(posts);
    }catch(err){
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error");
    }
}

/**
 * @swagger
 * components:
 *   responses:
 *     AllPostsWithCategoriesRead:
 *       description: All posts with their associated categories have been successfully retrieved.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               allOf:
 *                 - $ref: '#/components/schemas/Post'
 *                 - type: object
 *                   properties:
 *                     categories:
 *                       type: string
 *                       description: List of categories associated with the post
 */

export const getPostsWithoutFilters= async(req, res) => {
    try {
        const posts = await getPostswithAllCategories(pool); 
        
        if (posts.length > 0) {
            for (const post of posts) {
                post.photo = post.photo
                ? `/images/${post.photo}.jpeg`
                : null;
            }
        }
        res.status(200).send(posts);
    }catch(err){
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error");
    }

}