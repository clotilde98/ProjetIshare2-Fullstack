import { pool } from "../database/database.js";
import {createPostCategory} from '../model/postCategory.js'
import * as postModel from '../model/postDB.js';

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
        const id = parseInt(req.params.id);
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Post ID invalid")
        }
        const post = await postModel.readPost(pool, {id});
        if (post){
            res.status(200).json(post);
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

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
        const { city, postStatus, page, limit } = req.query;
        const posts = await postModel.getPosts(pool, {city, postStatus, page, limit})
        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).send(err.message);
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
        
        const { categoriesProduct, clientID: providedClientID } = req.body; 
        
        if (!categoriesProduct || categoriesProduct.length === 0){
            return res.status(400).send("Missing product category to create a post");
        }
        
        client = await pool.connect();
        await client.query('BEGIN'); 
        
        let clientIDToUse;
                
        if (req.user && req.user.isAdmin && providedClientID) {
            clientIDToUse = providedClientID;
        } else if (req.user) {
            clientIDToUse = req.user.id;
        }else {
            return res.status(401).send("Authentication required to create a post.");
        }

        if (!clientIDToUse) {
             await client.query('ROLLBACK');
             return res.status(401).send("Client ID is missing or unauthorized.");
        }


        const post = await postModel.createPost(client, clientIDToUse, req.body);
        const postID = post.id;

        for (const categoryID of categoriesProduct) {
            await createPostCategory(client, { IDCategory :categoryID, IDPost: postID });
        }

        await client.query('COMMIT');

        res.status(201).send("Post created");
    } catch (err){
        
            await client.query('ROLLBACK'); 
    
        res.status(500).send(err.message);
    } finally {
        if (client) client.release();
    }
}


/**
 * @swagger
 * components:
 *   responses:
 *     PostUpdated:
 *       description: The requested post has been updated.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */



export const updatePost = async (req, res) => {
    try {
        const {numberOfPlaces} = req.body
        if (numberOfPlaces < 0){
            return res.status(400).send("Number of places must be positive");
        }
        await postModel.updatePost(pool, req.body);
        res.sendStatus(204).send("Post updated")
    } catch (err){
        res.status(500).send(err.message);
    }
}

/**
 * @swagger
 * components:
 *   responses:
 *     PostDeleted:
 *       description: The requested post has been deleted.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */


export const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Post ID invalid")
        }
        const rowCount = await postModel.deletePost(pool, { id });
        if (!rowCount) {
            return res.status(404).send("Post not found");
        }
        res.status(200).send("Post deleted");

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
         const posts = await postModel.searchPostByCategory(pool, req.body);
         res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err.message);
    }
}