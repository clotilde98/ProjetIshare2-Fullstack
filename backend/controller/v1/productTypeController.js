import {pool} from "../../database/database.js";
import * as typeProductModel from "../../model/v1/productType.js";
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'; 
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         idCategory:
 *           type: integer
 *         nameCategory:
 *           type: string
 * 
 *   responses:
 *     CategoriesRead:
 *       description: Category successfully retrieved
 *       content:
 *         application/json:
 *            schema:
 *              type: array
 *              items: 
 *                 $ref: '#/components/schemas/Category'
 */



export const getCategories = async (req, res) => {
  try {
   
    const { nameCategory, page, limit } = req.query;

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

    const categories = await typeProductModel.getCategories(pool, {
      nameCategory, 
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
 *     CategoryProductCreated:
 *       description: The requested category of product has been created successfully.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'   
 */

export const createProductType = async (req, res) => {
    try {
        const { nameCategory } = req.body;
        
        if (!nameCategory) {
             return res.status(400).send("Category name required.");
        }

        const existingType = await typeProductModel.getCategories(pool, {nameCategory});
        
        if (existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await typeProductModel.createProductType(pool, nameCategory);
        
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
 *     TypeProductUpdated:
 *       description: The requested type of product is successfully updated
 *       content:
 *         application/json: 
 *              schema: 
 *                $ref: '#/components/schemas/Category'
 *             
 */

export const updateProductType = async (req, res) => {
    try {
        const idCategory = parseInt(req.params.id, 10); 
        
        if (isNaN(idCategory)) {
            return res.status(400).json({ message: "Category ID invalid" });
        }
        
        const nameCategory = req.body.nameCategory;
        
        const updatedCategory = await typeProductModel.updateTypeProduct(pool, { 
            idCategory: idCategory, 
            nameCategory: nameCategory 
        });
        
        return res.status(200).send({updatedCategory}); 
        

    } catch (err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
};



export const deleteProductType = async (req, res) => {
    try{
        const idCategory = req.params.id; 

        if (!idCategory) {
            return res.status(400).send("Category ID is required");
        }
        
        const deleted = await typeProductModel.deleteTypeProduct(pool, idCategory );
        
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