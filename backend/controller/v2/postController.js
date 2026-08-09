import { pool } from "../../database/database.js";
import * as postModel from '../../model/v2/postDB.js';
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { readProductCategoryFromID } from "../../model/v1/productCategory.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PostV2:
 *       type: object
 *       description: Represents a blog post
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
 */ 

/**
 * @swagger
 * components:
 *   responses:
 *     AllPostByCategoryV2:
 *       description: Requested posts from a certain category are returned.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/PostV2'
 *                     - type: object
 *                       properties:
 *                         postId:
 *                           type: integer
 *                         categoryId:
 *                           type: integer
 *                         categoryName:
 *                           type: string
 *               total:
 *                 type: integer
 *                 description: Total number of posts matching the search criteria
 */

export const searchPostsByCategory = async(req, res) => {
    try {

        const {limit, page, categoryName} = req.query; 

        const cleanCategoryName = categoryName ? categoryName.trim() : "";

        if (!cleanCategoryName) {
            return res.status(400).send("Category name is required.");
        }

        if (cleanCategoryName.length > 100) {
            return res.status(400).send("Category name must be 100 characters or less.");
        }

        const limitResult = validatePagination(limit, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(page, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page'); 

         const posts = await postModel.searchPostsByCategory(pool, {
            categoryName: cleanCategoryName,
            page: pageResult,
            limit: limitResult
         });

        res.status(200).send(posts);
    }catch(err){
        if (err instanceof PaginationValidationError) {
            return res.status(400).json({error: err.message});
        }
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error");
    }
}
