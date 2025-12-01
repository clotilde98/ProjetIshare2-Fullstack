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
 *           type: date
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
            res.status(400).send({ message: "Échec de la création du commentaire. Vérifiez l'ID de l'annonce." }); 
        } 
    } catch (e) {
        console.error("Erreur lors de la création du commentaire:", e.message);
        
        res.status(500).send({ message: "Erreur interne du serveur." });
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     UpdatedUser:
 *       description: The Comment updated in the database
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     InvalidOldPassword:
 *       description: Incorrect old password
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     InternalServerError:
 *       description: Server error
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */



export const updateComment = async (req, res) => {
    try {
        const updateData = {...req.body, id: req.params.id  };

        
        const updated = await commentModel.updateComment(pool, updateData);
        
        if (updated) {
            return res.status(200).json({ message: "Commentaire mis à jour avec succès." });
        } else {
            return res.status(404).json({ message: "Commentaire non trouvé ou aucune modification effectuée." });
        }

    } catch (err) {        
        console.error('Erreur lors de la mise à jour du commentaire :', err.message);
        
        if (err.message.includes("Missing field") || err.message.includes("No updateable field")) {
            return res.status(400).json({ message: err.message });
        }
        
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du commentaire.' });
    }
};

export const deleteComment = async(req, res) =>{
    try{
        const commentDeleted= await commentModel.deleteComment(pool, req.body);
        if(!commentDeleted){
            res.status(404).send(`Comment with ID ${commentDeleted.id} not found`);
        }else{
             res.status(200).send(`Comment ${commentDeleted.id} deleted successfully`);
        }
    }catch (err){
        console.log(err); 
        res.sendStatus(500);
    }
}

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
    console.error('Erreur récupération des commentaires :', err.message);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des commentaires.' });
  }
};

