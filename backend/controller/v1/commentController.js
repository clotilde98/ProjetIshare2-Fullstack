import {pool} from "../../database/database.js";
import * as commentModel from "../../model/v1/comment.js";
import * as postModel from '../../model/v1/postDB.js'; 
import * as userModel from "../../model/v1/client.js";
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
 *         id_customer:
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
 *              type: object
 *              properties: 
 *                  commentCreated: 
 *                             $ref: '#/components/schemas/Comment'
 *             
 */

export const createComment = async (req, res) => {
    try {
        let userID = req.user.id;

        if (req.body.providedClientID){
            if (req.user.isAdmin){
                userID = req.body.providedClientID;

                const providedUser = await userModel.getUserById(pool, userID);
                
                if (!providedUser){
                    return res.status(404).send("Provided client does not exist.");
                }
            } else {
                return res.status(403).send("Admin privilege required");
            }
        }

        const post = await postModel.readPost(pool, req.body.idPost);

        if (!post){
            return res.status(404).send("Post doesn't exist.");
        }
        
        const commentCreated = await commentModel.createComment(pool,  { content: req.body.content, postID: req.body.idPost, clientID: userID });
        
        res.status(201).send({commentCreated});
        
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
 *              type: object
 *              properties:
 *                  updated:
 *                      $ref: '#/components/schemas/Comment' 
 * 
 */

export const updateComment = async (req, res) => {

    try {
        let userID = req.user.id; 

        const commentID = Number(req.params.id);
        if (!Number.isInteger(commentID) || commentID <= 0){
            return res.status(400).send("Invalid comment ID");
        }

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
        const commentID = Number(req.params.id);
        if (!Number.isInteger(commentID) || commentID <= 0){
            return res.status(400).send("Invalid comment ID");
        }

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
 *       description: All the comments that correspond to the given date (optional)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Comment'
 *                     - type: object
 *                       properties:
 *                         post_title:
 *                           type: string
 *                         username:
 *                           type: string
 *               total:
 *                 type: integer
 *                 description: Total number of comments matching the search criteria
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
      PAGINATION.MIN_LIMIT,
      PAGINATION.MAX_LIMIT,
      'page'
    );


    const comments = await commentModel.getComments(pool, {
      commentDate, 
      page: pageResult,
      limit: limitResult
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