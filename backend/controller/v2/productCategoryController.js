import {pool} from "../../database/database.js";
import * as productCategoryModel from "../../model/v2/productCategory.js";
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import {PaginationValidationError} from "../../errors/PaginationValidationError.js"; 

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategoryV2:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: integer
 *         categoryName:
 *           type: string
 *
 *   responses:
 *     CategoriesReadV2:
 *       description: Category successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductCategoryV2'
 *               total:
 *                 type: integer
 *                 description: Total number of categories (or matching the category name provided by the user, if specified)
 */

export const getCategories = async (req, res) => {
  try {
   
    const { categoryName, page, limit } = req.query;

    let cleanNameCategory = categoryName ? categoryName.trim() : categoryName; 

    if(cleanNameCategory && cleanNameCategory.length > 100){
        return res.status(400).send("Category name must be 100 characters or less.");
    }

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

    const categories = await productCategoryModel.getCategories(pool, {
      cleanNameCategory, 
      page: pageResult, 
      limit: limitResult
    });

    res.status(200).json(categories);
  } catch (err) {
    if (err instanceof PaginationValidationError) {
        return res.status(400).json({ error: err.message }); 
    }
    console.error("Internal server error", err); 
    res.status(500).send(err.message); 
  }
};


/**
 * @swagger
 * components:
 *   responses:
 *     ProductCategoryCreatedV2:
 *       description: The requested category of product has been created successfully.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategoryV2'   
 */

export const createProductCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        const existingType = await productCategoryModel.getCategories(pool, {categoryName});
        
        if (existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await productCategoryModel.createProductCategory(pool, categoryName);
        
        if (productCreated) {
            return res.status(201).send({productCreated});
        } 
        
    } catch(err) {
        console.error("Internal server error", err); 
        res.status(500).send(err.message); 
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     ProductCategoryUpdatedV2:
 *       description: The requested type of product is successfully updated
 *       content:
 *         application/json: 
 *              schema: 
 *                $ref: '#/components/schemas/ProductCategoryV2'
 *             
 */

export const updateProductCategory = async (req, res) => {
    try {
        const categoryID = Number(req.params.id);
        
        if (!Number.isInteger(categoryID) || categoryID <= 0) {
            return res.status(400).send("Invalid category ID");
        }
        
        const nameCategory = req.body.nameCategory;
        
        const category = await productCategoryModel.getCategories(pool, {categoryName : nameCategory});
                                                
        if (category.rows.length > 0){
            return res.status(404).send("Product category not found.");
        }
        
        const updatedCategory = await productCategoryModel.updateProductCategory(pool, { 
            categoryID: categoryID, 
            categoryName: categoryName 
        });
        
        return res.status(200).send({updatedCategory}); 
        

    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send(err.message); 
    }
};