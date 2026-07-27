import {pool} from "../../database/database.js";
import * as commentModel from "../../model/v1/comment.js";
import * as postModel from '../../model/v1/postDB.js'; 
import { PAGINATION } from '../../Config/pagination.js';
import {validatePagination} from '../../Utils/validationPagination.js'; 
import {PaginationValidationError} from "../../errors/PaginationValidationError.js"; 


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


export const getCommentsByPostID = async (req, res) => {
    try {
        const rows = await commentModel.getCommentsByPostID(pool, {postID: req.params.id})
        return res.status(200).send({rows});
    } catch (err) {
        console.error("Internal server error", err);  
        return res.status(500).send("Internal server error");
    }
}

/**
 * @swagger
 * components:
 *   responses:
 *     CommentAdded:
 *       description: The Comment added at the database
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Comment'
 *             
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

        const post = await postModel.readPost(pool, req.body.idPost);

        if (!post){
            return res.status(400).send("Post doesn't exist.");
        }


        const commentCreated = await commentModel.createComment(pool,  { content: req.body.content, postID: req.body.idPost, clientID: userID });
        
        if (commentCreated) {
            res.status(201).send({commentCreated});
        } else {
            res.status(400).send({ message: "Unable to create comment. Please check if the post ID is correct." }); 
        } 
    } catch (err) {
        console.error("Internal server error", err);  
        return res.status(500).send("Internal server error");
        
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     CommentUpdated:
 *       description: The Comment updated in the database
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment' 
 * 
 */

export const updateComment = async (req, res) => {

    try {
        let userID = req.user.id;
        const commentID = req.params.id;

        const comment = await commentModel.getCommentById(pool, commentID);

        if (!comment){
            return res.status(404).send("Comment not found")
        }


        if (comment.id_customer === userID || req.user.isAdmin){
            const updated = await commentModel.updateComment(pool, { id: commentID, content: req.body.content });

            return res.status(200).send({updated});
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) { 
        console.error("Internal server error", err);         
        return res.status(500).send("Internal server error");
    }
};

export const deleteComment = async(req, res) =>{
    try {

        let userID = req.user.id;
        const commentID = req.params.id;

        const comment = await commentModel.getCommentById(pool, commentID);

        if (!comment){
            return res.status(404).send("Comment not found")
        }

        if (comment.id_customer === userID || req.user.isAdmin){
            await commentModel.deleteComment(pool, commentID);
            return res.status(200).send("Comment deleted");
        } else {
            return res.status(403).send("Admin privilege required.");
        }

    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
    }
}
/**
 * @swagger
 * components:
 *   responses:
 *     CommentsRead:
 *       description: All the comments that correspond to the given date
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               allOf: 
 *               - $ref: '#/components/schemas/Comment'
 *               - type: object 
 *                 properties: 
 *                      post_title: 
 *                          type: string 
 *                      username: 
 *                          type: string
 */


export const getComments = async (req, res) => {
  try {
   
    const { commentDate, page, limit } = req.query;

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


    const comments = await commentModel.getComments(pool, {
      commentDate, 
      page: pageResult.value,
      limit: limitResult.value
    });

    res.status(200).json(comments);
    
  } catch (err) {
    if (err instanceof PaginationValidationError) {
         return res.status(400).json({ error: err.message }); 
    }
    console.error("Internal server error", err); 
    return res.status(500).send("Internal server error");
  }
};