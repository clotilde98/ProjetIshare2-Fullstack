import { pool } from "../database/database.js";
import {createPostCategory} from '../model/postCategory.js'
import * as postModel from '../model/postDB.js';

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

export const getPosts = async (req, res) => {
    try {
        const { city, postStatus, page, limit } = req.query;
        const posts = await postModel.getPosts(pool, {city, postStatus, page, limit})
        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).send(err.message);
    }
}



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
    
        console.error("Erreur lors de la création du post:", err);
        res.status(500).send(err.message || "Erreur interne du serveur.");
    } finally {
        if (client) client.release();
    }
}




export const updatePost = async (req, res) => {
    try {
        const {numberOfPlaces} = req.body
        if (numberOfPlaces < 0){
            return res.status(400).send("Number of places must be positive");
        }
        await postModel.updatePost(pool, req.body);
        res.sendStatus(204)
    } catch (err){
        res.status(500).send(err.message);
    }
}

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
        res.sendStatus(500);
    }
};


export const searchPostByCategory = async(req, res) => {
    try {
         const posts = await postModel.searchPostByCategory(pool, req.body);
         res.status(200).send(posts);
    }catch(err){
        res.status(500).send(err.message);
    }
}