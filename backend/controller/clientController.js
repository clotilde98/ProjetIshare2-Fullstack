import { pool } from "../database/database.js";
import * as userModel from "../model/client.js";
import argon2 from "argon2";
import 'dotenv/config';


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         street:
 *           type: string
 *         streetNumber:
 *           type: integer
 *         photo:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UserAdded:
 *       description: The user added at the database
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 */

export const createUser = async (req, res) => {
  try {
    
const photo = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  : null;   
 const newClient = await userModel.createUser(pool, {...req.body,photo });
    res.status(201).json({
      message: 'Client created', id: newClient.id});
  } catch (err) {
    res.status(400).send(err.message);
  }
};


/**
 * @swagger
 * components:
 *   responses:
 *     UpdatedUser:
 *       description: The user updated in the database
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     InvalidOldPassword:
 *       description: Incorrect old password
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     InternalServerError:
 *       description: Server error
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */


export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const updateData = req.body; 

        if (updateData.password) { 
            
            if (!updateData.oldPassword && !req.user.is_admin) {
                return res.status(400).send("L'ancien mot de passe est requis pour changer le mot de passe.");
            }

            const currentUser = await userModel.getUserById(pool, userId); 
            
            if (!currentUser) {
                return res.status(404).send("Utilisateur non trouvé.");
            }

            const pepper = process.env.PEPPER;
            
            if (!req.user.is_admin) {
                const validOldPassword = await argon2.verify(
                    currentUser.password, 
                    updateData.oldPassword + pepper
                );

                if (!validOldPassword) {
                    return res.status(401).send("Ancien mot de passe incorrect.");
                }
            }

            const passwordWithPepper = updateData.password + pepper;
            updateData.password = await argon2.hash(passwordWithPepper); 
            
            delete updateData.oldPassword; 
        }
        
        const result = await userModel.updateUser(pool, userId, updateData);

        if (result && result.rowCount > 0) {
            res.sendStatus(204); 
        } else {
            res.status(400).send("Aucun champ fourni pour la mise à jour ou utilisateur non trouvé.");
        }
        
    } catch (err) {
        console.error("Error during user update:", err); 
        res.status(500).send("Erreur serveur interne");
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     DeletedUser:
 *       description: The user is deleted from the database
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const success = await userModel.deleteUser(pool, id);
    if (!success) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * @swagger
 * components:
 *   responses:
 *     UserAccount:
 *       description: The user want see his account
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 */

export const getOwnUser = async (req, res) => {
    try {
        const clientID = req.user.id; 
       const user = await userModel.getProfileById(pool, clientID); 

        if (!user) {
            return res.status(404).send("Profil utilisateur non trouvé.");
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur retrouvée au niveau du profil:", err); 
        res.status(500).send("Erreur serveur interne."); 
    }
};


/**
 * @swagger
 * components:
 *   responses:
 *     ReadedUser:
 *       description: The user wants to read the existing users 
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     InvalidRole:
 *       description: The role is invalid
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */

export const getUsers = async (req, res) => {
  try {
    const { name, role, page, limit } = req.query;

    if (role && role !== 'admin' && role !== 'user') {
      return res.status(400).json({ message: 'Le rôle doit être "admin" ou "user".' });
    }

    const users = await userModel.getUsers(pool, {
      name,
      role,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur récupération utilisateurs :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};