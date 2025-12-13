import { pool } from "../database/database.js";
import {createPostCategory, deletePostCategoriesForPostID} from '../model/postCategory.js'
import * as postModel from '../model/postDB.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {saveImage} from '../middleware/photo/saveImage.js';
import * as uuid from 'uuid'


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
 *           example: 1
 *         postDate:
 *           type: string
 *           format: date
 *           description: Date when the post was created
 *           example: "2023-10-15"
 *         description:
 *           type: string
 *           description: Detailed content of the post
 *           example: "This is a detailed description of the post..."
 *         title:
 *           type: string
 *           description: Title of the post
 *           example: "My First Post"
 *         numberOfPlaces:
 *           type: integer
 *           description: Number of available places (if applicable)
 *           example: 10
 *         postStatus:
 *           type: string
 *           description: Current status of the post
 *           enum: [draft, published, archived]
 *           example: "published"
 *         photo:
 *           type: string
 *           description: URL or path to the post's photo
 *           example: "/images/post1.jpg"
 *         street:
 *           type: string
 *           description: Street name for location-based posts
 *           example: "Main Street"
 *         streetNumber:
 *           type: string
 *           description: Street number (string to handle cases like "123A")
 *           example: "123"
 *         addressId:
 *           type: integer
 *           description: Reference to the address
 *           example: 5
 *         clientId:
 *           type: integer
 *           description: Reference to the client/author
 *           example: 7
 * 
 *   responses:
 *     PostReaded:
 *       description: The searched post has been found and read
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 * 
 *     PostNotFound:
 *       description: The searched post does not exist
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Post not found"
 *               code:
 *                 type: string
 *                 example: "POST_NOT_FOUND"
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

        res.status(200).json(post);

    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
};


/**
 * @swagger
 * components:
 *   responses:
 *     AllPostsReaded:
 *       description: All posts have been successfully retrieved.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Post'
 */


export const getPosts = async (req, res) => {
    try {
        const { city, postStatus } = req.query;

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        if (Number.isNaN(page) || Number.isNaN(limit)) {
            return res.status(400).send("Page and limit must be numbers");
        }

        const posts = await postModel.getPosts(pool, {
            city,
            postStatus,
            page,
            limit
        });

        return res.status(200).json(posts);

    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
}



/**
 * @swagger
 * components:
 *   responses:
 *     PostCreated:
 *       description: Thanks to the transaction, the user was identified and linked to the post, and a row was created in the PostCategory table.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *
 *     UnauthorizedToAccess:
 *       description: User is not authorized to access this resource because this is neither a user nor an administrator
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */



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


            let categoriesProduct = [];
            if (req.body.categoriesProduct) {
                categoriesProduct = JSON.parse(req.body.categoriesProduct);
                if (!Array.isArray(categoriesProduct) || categoriesProduct.length === 0) {
                    return res.status(400).send("Post category required.");
                }
            } else {
                return res.status(400).send("Post category required.")
            }

            client = await pool.connect();
            await client.query('BEGIN');

            await deletePostCategoriesForPostID(client, postID);


            for (const categoryID of categoriesProduct) {
                await createPostCategory(client, { IDCategory: categoryID, IDPost: postID });
            }

            
            const updatedPost = await postModel.updatePost(client, postID, req.body)


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
        res.sendStatus(500).send(err.message);
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