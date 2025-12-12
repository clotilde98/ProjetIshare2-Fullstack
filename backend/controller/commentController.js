import {pool} from "../database/database.js";
import * as commentModel from "../model/comment.js";

import * as postModel from "../model/postDB.js"


/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         date:
 *           type: string 
 *           format: date
 *         id_post:
 *           type: integer
 *         id_costumer:
 *           type: integer
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CommentAdded:
 *       description: The Comment added at the database
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 */

export const createComment = async (req, res) => {
    try {
        let userID = req.user.id;

        if (req.body.providedClientID){
            if (req.user.isAdmin){
                userID = req.body.providedClientID;
            } else {
                return res.status(403).send("Admin privilege required");
            }
        }

        const post = await postModel.readPost(pool, {id:req.body.idPost});

        if (!post){
            return res.status(400).send("Post doesn't exist.");
        }


        const commentCreated = await commentModel.createComment(pool,  { content: req.body.content, idPost: req.body.idPost, idCustomer: userID });
        
        if (commentCreated) {
            res.status(201).send({commentCreated});
        } else {
<<<<<<< HEAD
            res.status(400).send({ message: "Unable to create comment. Please check if the post ID is correct." }); 
        } 
    } catch (e) {
        res.status(500).send({message: "Internal server error : " + e.message});
        
=======
            res.status(400).send("Échec de la création du commentaire. Vérifiez l'ID de l'annonce."); 
        } 
    } catch (err) {
            res.status(500).send(err.message);
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     CommentUpdated:
 *       description: The Comment updated in the database
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     CommentNotFound:
 *       description: Comment not found
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 * 
 */

export const updateComment = async (req, res) => {

<<<<<<< HEAD
    try {
        let userID = req.user.id;
        const commentID = req.params.id;

        const comment = await commentModel.getCommentById(pool, commentID);

        if (!comment){
            return res.status(404).send("Comment not found")
        }


        if (comment.id_customer === userID || req.user.isAdmin){
            const updated = await commentModel.updateComment(pool, { id: commentID, content: req.body.content });

            return res.status(200).send(updated);
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) {        
        return res.status(500).send("Internal server error");
=======
        const updated = await commentModel.updateComment(pool, updateData);
        
        if (updated) {
            return res.status(200).send("Commentaire mis à jour avec succès.");
        } else {
            return res.status(404).send("Commentaire non trouvé ou aucune modification effectuée.");
        }

    } catch (err) {      
        return res.status(500).send(err.message);
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
    }
};


/**
 * @swagger
 * components:
 *   responses:
 *     CommentDeleted:
 *       description: The comment has been deleted from the database
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *
 */


export const deleteComment = async(req, res) =>{
<<<<<<< HEAD
    try {

        let userID = req.user.id;
        const commentID = req.params.id;

        const comment = await commentModel.getCommentById(pool, commentID);

        if (!comment){
            return res.status(404).send("Comment not found")
        }

        if (comment.id_customer === userID || req.user.isAdmin){
            await commentModel.deleteComment(pool, {id:commentID});
            return res.status(200).send("Comment deleted");
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) {
        return res.status(500).send("Internal server error");
=======
    try{
        const commentDeleted = await commentModel.deleteComment(pool, {id:req.params.id});
        if (!commentDeleted) {
            res.status(404).send(`Comment with ID ${req.params.id} not found`);
        } else {
            res.status(204).send(`Comment ${req.params.id} deleted successfully`);
        }

    }catch (err){
        res.sendStatus(500);
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
    }
}
/**
 * @swagger
 * components:
 *   responses:
 *     CommentsReaded:
 *       description: All the comments that correspond to the given date
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Comment'
 */


export const getComments = async (req, res) => {
  try {
   
    const { commentDate, page, limit } = req.query;

    const comments = await commentModel.getComments(pool, {
      commentDate, 
      page: parseInt(page) || 1, 
      limit: parseInt(limit) || 10 
    });

    res.status(200).json(comments);
    
  } catch (err) {
<<<<<<< HEAD
    res.status(500).send("Internal server error : " + err.message);
=======
    res.status(500).send('Erreur serveur lors de la récupération des commentaires.');
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
  }
};

