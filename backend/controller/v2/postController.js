import { pool } from "../../database/database.js";
import * as postModel from '../../model/v2/postDB.js';
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { readProductCategoryFromID } from "../../model/v1/productType.js";

/**
 * 
 *  
 *  
 * 
 */


export const searchPostsByCategory = async(req, res) => {
    try {

        const {limit, page, nameCategory} = req.query; 

        const limitResult = validatePagination(limit, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(page, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page'); 

         const posts = await postModel.searchPostsByCategory(pool, {
            categoryName: nameCategory,
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
