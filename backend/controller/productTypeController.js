import {pool} from "../database/database.js";
import * as typeProductModel from "../model/productType.js";

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
    console.error('Erreur récupération des catégories :', err.message);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories.' });
  }
};

export const createTypeProduct = async (req, res) => {
    try {
        const { nameCategory } = req.body;
        
        if (!nameCategory) {
             return res.status(400).send("Le nom de la catégorie est requis.");
        }

        const categoryData = { nameCategory }; 

        const existingType = await typeProductModel.getCategories(pool, categoryData);
        
        if (existingType && existingType.rows && existingType.rows.length > 0) {
            return res.status(409).send("Type already exists");
        }

        const productCreated = await typeProductModel.createTypeProduct(pool, categoryData);
        
        if (productCreated) {
            return res.status(201).send(productCreated);
        } 
        

    } catch(err) {
        console.error("Erreur création catégorie :", err);
        res.status(500).send(err.message || "Erreur interne du serveur");
    }
};

export const updateTypeProduct = async (req, res) => {
    try {
        const idCategory = parseInt(req.params.id, 10); 
        
        if (isNaN(idCategory)) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        
        const nameCategory = req.body.nameCategory;
        
        const updated = await typeProductModel.updateTypeProduct(pool, { 
            idCategory: idCategory, 
            nameCategory: nameCategory 
        });

        if (updated) {
           
            return res.sendStatus(204); 
        } else {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }

    } catch (err) {
        console.error('Erreur lors de la mise à jour de la catégorie:', err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};


export const deleteTypeProduct = async (req, res) => {
    try{
        const idCategory = req.params.id; 

        if (!idCategory) {
            return res.status(400).send("ID de catégorie est requis pour la suppression.");
        }
        
        const deleted = await typeProductModel.deleteTypeProduct(pool, { idCategory });
        
        if (deleted) {
		    res.sendStatus(204);
        } else {
            res.status(404).send("Catégorie non trouvée ou non supprimée.");
        }

    }catch(err){
        console.error('Erreur suppression catégorie :', err);
        res.status(500).send(err.message || "Erreur interne du serveur");
    }
}

