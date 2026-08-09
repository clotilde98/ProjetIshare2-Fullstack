import {pool} from "../../database/database.js";
import * as commentModel from "../../model/v2/comment.js";
import * as postModel from "../../model/v1/postDB.js"; 
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'; 
import {PaginationValidationError} from "../../errors/PaginationValidationError.js"; 

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentV2:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         date:
 *           type: string 
 *           format: date
 *         post_id:
 *           type: integer
 *         client_id:
 *           type: integer
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CommentAddedV2:
 *       description: The Comment added at the database
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CommentV2'
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

        const post = await postModel.readPost(pool, req.body.postID);

        if (!post){
            return res.status(404).send("Post doesn't exist.");
        }

        const commentCreated = await commentModel.createComment(pool,  { content: req.body.content, postID : req.body.postID, clientID: userID });
        
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
 *     CommentUpdatedV2:
 *       description: The Comment updated in the database
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentV2' 
 * 
 */

export const updateComment = async (req, res) => {

    try {
        let userID = req.user.id;
        const commentID = req.params.id;

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

/**
 * @swagger
 * components:
 *   responses:
 *     CommentsReadV2:
 *       description: Comments matching the specified filters successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/CommentV2'
 *                     - type: object
 *                       properties:
 *                         post_title:
 *                           type: string
 *                         username:
 *                           type: string
 *               total:
 *                 type: integer
 *                 description: Total number of comments matching with the comment date
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