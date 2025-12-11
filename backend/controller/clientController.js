import { pool } from "../database/database.js";
import * as userModel from "../model/client.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import path from 'path';
import { fileURLToPath } from 'url';

import {saveImage} from '../middleware/photo/saveImage.js';
import * as uuid from 'uuid'


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
 *       description: The user has been added to the database
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 */


<<<<<<< HEAD
=======



>>>>>>> 8e043f54b6f6ff332889af831690d986726b206e
export const createUser = async (req, res) => {
  try {
    const {username, email, password, street, streetNumber, addressID} = req.body;
    const photo = req.file;
    //const photo = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  : null;   
    let user = await userModel.getUserByEmail(pool, email)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const destFolderImages = path.join(__dirname, '../middleware/photo/');
    
    if (!user){
        let imageName = null;
        if (photo){
            imageName = uuid.v4();
            await saveImage(photo.buffer, imageName, destFolderImages); 
        }
        
user = await userModel.createUser(pool, {googleId: googleId, username, email, streetNumber, street, photo:req.body.photo, isAdmin:req.body.isAdmin, addressID:req.body.addressID, password:req.body.password});        const token = jwt.sign(
                  { 
                      id: user.id, 
                      email: user.email,
                      isAdmin: user.is_admin,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "24h" }
              );
<<<<<<< HEAD
              res.status(200).send({ token });
=======
              res.send({ token }); 
>>>>>>> 8e043f54b6f6ff332889af831690d986726b206e
    } else {
      res.status(400).send("User already exists");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}


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
 */


export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const updateData = req.body; 

        if (updateData.password) { 
            
            if (!updateData.oldPassword ) {
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
 */

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return  res.status(400).send("ID invalide"); ;
   
    const success = await userModel.deleteUser(pool, id);
    if (!success) return res.status(404).send("Utilisateur non trouvé"); ;

    res.status(200).send("Utilisateur supprimé avec succès")
  } catch (err) {
    res.status(500).send("Erreur serveur");
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
<<<<<<< HEAD
        res.status(200).json(user);
    
=======

          const photoUrl = user.photo 
            ? `${req.protocol}://${req.get('host')}/images/${user.photo}.jpeg` 
            : null;

        
        
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            photo: photoUrl
        });


>>>>>>> 8e043f54b6f6ff332889af831690d986726b206e
    } catch (err) {
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
      return res.status(400).send('Le rôle doit être "admin" ou "user".');
    }

    const result = await userModel.getUsers(pool, { 
      name,
      role,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.status(200).json(result); 
  } catch (err) {
    res.status(500).send('Erreur serveur'); 
  }
};