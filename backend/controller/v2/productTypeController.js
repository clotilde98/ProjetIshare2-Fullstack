import {pool} from "../../database/database.js";
import * as productTypeModel from "../../model/v2/productType.js";
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import {PaginationValidationError} from "../../errors/PaginationValidationError.js"; 

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
   
    const { categoryName, page, limit } = req.query;

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

    const categories = await productTypeModel.getCategories(pool, {
      categoryName, 
      page: pageResult, 
      limit: limitResult
    });

    res.status(200).json(categories);
  } catch (err) {
    if (err instanceof PaginationValidationError) {
        return res.status(400).json({ error: err.message }); 
    }
    console.error(`Internal server error " ${err}`); 
    res.status(500).send(err.message); 
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
        const { categoryName } = req.body;
        
        if (!categoryName) {
             return res.status(400).send("Category name required.");
        }

        const existingType = await productTypeModel.getCategories(pool, {categoryName});
        
        if (existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await productTypeModel.createProductType(pool, categoryName);
        
        if (productCreated) {
            return res.status(201).send({productCreated});
        } 
        
    } catch(err) {
        console.error(`Internal server error " ${err}`); 
        res.status(500).send(err.message); 
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
        const categoryID = parseInt(req.params.id, 10); 
        
        if (isNaN(categoryID)) {
            return res.status(400).json({ message: "Category ID invalid" });
        }
        
        const categoryName = req.body.categoryName;
        
        const updatedCategory = await productTypeModel.updateTypeProduct(pool, { 
            categoryID: categoryID, 
            categoryName: categoryName 
        });
        
        return res.status(200).send({updatedCategory}); 
        

    } catch (err) {
        console.error(`Internal server error " ${err}`); 
        return res.status(500).send(err.message); 
    }
};



export const deleteProductType = async (req, res) => {
    try{
        const categoryID = req.params.id; 

        if (!categoryID) {
            return res.status(400).send("Category ID is required");
        }
        
        const deleted = await productTypeModel.deleteTypeProduct(pool, categoryID );
        
        if (deleted) {
		    res.status(200).send("Category is deleted");
        } else {
            res.status(404).send("Category not found");
        }

    }catch(err){
        console.error(`Internal server error " ${err}`); 
        res.status(500).send(err.message);
    }
}