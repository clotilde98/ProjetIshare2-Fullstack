import {pool} from "../database/database.js";
import * as typeProductModel from "../model/productType.js";
import { readCategoryProductFromID } from "../model/productType.js";

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

    const categories = await typeProductModel.getCategories(pool, {
      nameCategory, 
      page: parseInt(page) || 1, 
      limit: parseInt(limit) || 10 
    });

    res.status(200).json(categories);
  } catch (err) {
    
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

export const createTypeProduct = async (req, res) => {
    try {
        const { nameCategory } = req.body;
        
        if (!nameCategory) {
             return res.status(400).send("Category name required.");
        }

        const existingType = await typeProductModel.getCategories(pool, {nameCategory});
        
        if (existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await typeProductModel.createTypeProduct(pool, {nameCategory});
        
        if (productCreated) {
            return res.status(201).send({productCreated});
        } 
        

    } catch(err) {
        
        res.status(500).send("Internal server error " + err.message);
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

export const updateTypeProduct = async (req, res) => {
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
        
        return res.status(500).send(err.message); 
    }
};



export const deleteTypeProduct = async (req, res) => {
    try{
        const idCategory = req.params.id; 

        if (!idCategory) {
            return res.status(400).send("Category ID is required");
        }
        
        const deleted = await typeProductModel.deleteTypeProduct(pool, { idCategory });
        
        if (deleted) {
		    res.status(200).send("Category is deleted");
        } else {
            res.status(404).send("Category not found");
        }

    }catch(err){
        
        res.status(500).send(err.message);
    }
}

