import {pool} from "../database/database.js";
import * as commentModel from "../model/comment.js";


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
   
    const idCostumer = req.user.id; 

    try {
        const commentCreated = await commentModel.createComment(pool,  {...req.body , idCostumer });
        
        if (commentCreated) {
            res.status(201).send(commentCreated);
        } else {
            res.status(400).send("Échec de la création du commentaire. Vérifiez l'ID de l'annonce."); 
        } 
    } catch (err) {
            res.status(500).send(err.message);
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
    try {
        const updateData = {...req.body, id: req.params.id  };

        const updated = await commentModel.updateComment(pool, updateData);
        
        if (updated) {
            return res.status(200).send("Commentaire mis à jour avec succès.");
        } else {
            return res.status(404).send("Commentaire non trouvé ou aucune modification effectuée.");
        }

    } catch (err) {      
        return res.status(500).send(err.message);
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
    try{
        const commentDeleted = await commentModel.deleteComment(pool, {id:req.params.id});
        if (!commentDeleted) {
            res.status(404).send(`Comment with ID ${req.params.id} not found`);
        } else {
            res.status(204).send(`Comment ${req.params.id} deleted successfully`);
        }

    }catch (err){
        res.sendStatus(500);
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
    res.status(500).send('Erreur serveur lors de la récupération des commentaires.');
  }
};

