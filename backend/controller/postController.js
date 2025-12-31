import { pool } from "../database/database.js";
import {createPostCategory, deletePostCategoriesForPostID, getPostswithAllCategories} from '../model/postCategory.js'
import * as postModel from '../model/postDB.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {saveImage} from '../middleware/saveImage.js';
import * as uuid from 'uuid'
import { readCategoryProductFromID } from "../model/productType.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destFolderImages = path.join(__dirname, '../middleware/photo/');




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
 *       description: The searched post has been found and read
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

        const post = await postModel.readPost(pool, { id });

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const photoUrl = post.photo
        ? `${req.protocol}://${req.get('host')}/images/${post.photo}.jpeg` 
        : null;

        post.photo = photoUrl;

        res.status(200).json(post);

    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
};

export const getMyPosts = async (req, res) => {
    try {

        const userID = req.user.id;
        const posts = await postModel.readMyPosts(pool, { clientID:userID });


        if (posts.length > 0) {
            for (const post of posts) {
                post.photo = post.photo
                ? `${req.protocol}://${req.get('host')}/images/${post.photo}.jpeg`
                : null;
            }
            }

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
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
 *             type: array
 *             items:
 *              allOf: 
 *               - $ref: '#/components/schemas/Post'
 *               - type: object     
 *                 properties: 
 *                      places_restantes: 
 *                             type: integer
 *                      username: 
 *                             type: integer
 *                      categories: 
 *                             type: string
 *                      postal_code:        
 *                             type: string  
 *                      city: 
 *                             type: string                
 */


export const getPosts = async (req, res) => {
    try {
        const { city, postStatus} = req.query;

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        if (Number.isNaN(page) || Number.isNaN(limit)) {
            return res.status(400).send("Page and limit must be numbers");
        }

        const posts = await postModel.getPosts(pool, {
            city,
            postStatus,
             page: parseInt(page) || 1, 
            limit: parseInt(limit) || 10   
        });

        if (posts.rows.length > 0){
            for (const post of posts.rows) {
                post.photo = post.photo
                    ? `${req.protocol}://${req.get('host')}/images/${post.photo}.jpeg`
                    : null;
            }
        }
        


        return res.status(200).json(posts);

    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
}






export const createPost = async (req, res) => {
    let client;
    try {

        let userID = req.user.id;

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
            const category = await readCategoryProductFromID(pool, categoryID);
            if (!category) {
                return res.status(404).send(`Category product with ID ${categoryID} not found`);
            }
        }


        client = await pool.connect();
        await client.query('BEGIN');

        if (photo){
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

        res.status(500).send("Internal server error : " + err.message);

    } finally {
        if (client) {
            client.release();
        }
    }
}


export const updatePost = async (req, res) => {
    let client;
    try {
        let userID = req.user.id;
        const postID = Number(req.params.id);

        if (Number.isNaN(postID)) {
            return res.status(400).send("Invalid post ID");
        }
        
        const post = await postModel.readPost(pool, {id:postID});
        
        if (!post){
            return res.status(404).send("Post not found")
        }

        
        
        if (post.client_id === userID || req.user.isAdmin){
            let imageName = null;
            const photo = req.file;
            if (photo) {
                imageName = uuid.v4();
                req.body.photo = imageName;
                await saveImage(photo.buffer, imageName, destFolderImages);
            }

            client = await pool.connect();
            await client.query('BEGIN');


            let categoriesProduct = [];
            if (req.body.categoriesProduct) {
                categoriesProduct = JSON.parse(req.body.categoriesProduct);
                if (!Array.isArray(categoriesProduct) || categoriesProduct.length === 0) {
                    return res.status(400).send("Post category required.");
                }

                for (const categoryID of categoriesProduct) {
                    const category = await readCategoryProductFromID(pool, categoryID);
                    if (!category) {
                        return res.status(400).send(`Category product with ID ${categoryID} doesn't exist`);
                    }
                }

                await deletePostCategoriesForPostID(client, postID);
                for (const categoryID of categoriesProduct) {
                    await createPostCategory(client, { IDCategory: categoryID, IDPost: postID });
                }
            }

            
            const updatedPost = await postModel.updatePost(client, postID, req.body)
            updatedPost.photo = post.photo
                    ? `${req.protocol}://${req.get('host')}/images/${post.photo}.jpeg`
                    : null;
            

            await client.query('COMMIT');

            return res.status(200).send({updatedPost});
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err){
        if (client) await client.query('ROLLBACK');
        res.status(500).send("Internal server error : " + err.message);
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

        const post = await postModel.readPost(pool, {id:postID});

        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.client_id === userID || req.user.isAdmin){
            await postModel.deletePost(pool, {id:postID});
            res.status(200).send("Post deleted");
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
};

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
 *               $ref: '#/components/schemas/Post'
 */


export const searchPostByCategory = async(req, res) => {
    try {
         const posts = await postModel.searchPostByCategory(pool, req.query.nameCategory);
         res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err.message);
    }
}





export const getPostsWithoutFilters= async(req, res) => {
    try {
        const posts = await getPostswithAllCategories(pool); 
        
        if (posts.length > 0) {
            for (const post of posts) {
                post.photo = post.photo
                ? `${req.protocol}://${req.get('host')}/images/${post.photo}.jpeg`
                : null;
            }
        }
        res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err.message);
    }

}