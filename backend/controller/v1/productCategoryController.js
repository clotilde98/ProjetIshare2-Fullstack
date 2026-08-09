import {pool} from "../../database/database.js";
import * as productCategoryModel from "../../model/v1/productCategory.js";
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'; 
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { toNamespacedPath } from "path";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategory:
 *       type: object
 *       properties:
 *         idCategory:
 *           type: integer
 *         nameCategory:
 *           type: string
 *
 *   responses:
 *     CategoriesRead:
 *       description: Categories successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductCategory'
 *               total:
 *                 type: integer
 *                 description: Total number of categories (or matching the category name provided by the user, if specified)
 */

export const getCategories = async (req, res) => {
  try {
   
    const { nameCategory, page, limit } = req.query;

    let cleanNameCategory = nameCategory ? nameCategory.trim() : nameCategory; 

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
    res.status(500).send("Internal server error"); 
  }
};


/**
 * @swagger
 * components:
 *   responses:
 *     ProductCategoryCreated:
 *       description: The requested category of product has been created successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             properties: 
 *               productCreated:
 *                  $ref: '#/components/schemas/ProductCategory'   
 */

export const createProductCategory = async (req, res) => {
    try {
        const { nameCategory } = req.body;

        const existingType = await productCategoryModel.getCategories(pool, {categoryName : nameCategory});
        
        if (existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await productCategoryModel.createProductCategory(pool, nameCategory);
        
        if (productCreated) {
            return res.status(201).send({productCreated});
        } 
        

    } catch(err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     ProductCategoryUpdated:
 *       description: The requested type of product is successfully updated
 *       content:
 *         application/json: 
 *            schema:
 *              type: object 
 *              properties: 
 *                 productUpdated:
 *                   $ref: '#/components/schemas/ProductCategory' 
 *             
 */

export const updateProductCategory = async (req, res) => {
    try {
        const idCategory = Number(req.params.id);
        

        if(!Number.isInteger(idCategory) || idCategory <= 0){
            return res.status(400).send("Category ID invalid");
        }

        const nameCategory = req.body.nameCategory;

        const category = await productCategoryModel.getCategories(pool, {categoryName : nameCategory});
                                        
        if (category.rows.length > 0){
            return res.status(404).send("Product category not found.");
        }
        
        const updatedCategory = await productCategoryModel.updateProductCategory(pool, { 
            idCategory: idCategory, 
            nameCategory: nameCategory 
        });
        
        return res.status(200).send({updatedCategory}); 
        

    } catch (err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
};



export const deleteProductCategory = async (req, res) => {
    try{
        const idCategory = Number(req.params.id);

        if (!idCategory) {
            return res.status(400).send("Category ID is required");
        }

        if (!Number.isInteger(idCategory) || idCategory <= 0) {
            return res.status(400).send("Invalid category ID");
        }
        
        const deleted = await productCategoryModel.deleteProductCategory(pool, idCategory);
        
        if (deleted) {
		    res.status(200).send("Category is deleted");
        } else {
            res.status(404).send("Category not found");
        }

    }catch(err){
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
}