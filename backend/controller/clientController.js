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

export const createUser = async (req, res) => {
  try {
    const {username, email, password, street, streetNumber, addressID} = req.body;

    const photo = req.file;
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

        user = await userModel.createUser(pool, {username, email, streetNumber, street, photo:imageName, isAdmin:false, addressID, password});
        const token = jwt.sign(
                  { 
                      id: user.id, 
                      email: user.email,
                      isAdmin: user.is_admin,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "24h" }
              );
              res.status(200).send({ token });
    } else {
      res.status(409).send("User account already exists");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const createUserWithAdmin = async (req, res) => {
    try {
        const {username, email, password, street, streetNumber, addressID} = req.body;
        
        let createAdminUser;

        if (!'isAdmin' in req.body) {
            createAdminUser = false
        }


        createAdminUser = req.body.isAdmin ; 
        
        if (!req.user.isAdmin && createAdminUser) {
            return res.status(400).send("Not allowed to create an admin user")
        }
        

        const photo = req.file;
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

            user = await userModel.createUser(pool, {username, email, streetNumber, street, photo:imageName, isAdmin:createAdminUser, addressID, password});
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    isAdmin: user.is_admin,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            
            res.status(200).send({ token });
        } else {
            res.status(409).send("User account already exists");
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
        let userId = req.user.id;
        if (req.params.id){
            if (req.user.isAdmin){
                userId = parseInt(req.params.id);
            } else {
                return res.status(403).send("Admin privilege required.");
            }
        }

        const updateData = { ...req.body };
        const currentUser = await userModel.getUserById(pool, userId); 

        if (!currentUser){
            return res.status(404).send("User not found");
        }

        const photo = req.file;
        if (photo) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const destFolderImages = path.join(__dirname, '../middleware/photo/');
            const imageName = uuid.v4();

            await saveImage(photo.buffer, imageName, destFolderImages);
            updateData.photo = imageName;
        }

        if (updateData.password) { 
            const pepper = process.env.PEPPER;
            
            if (!req.user.isAdmin) {
                if (!updateData.oldPassword) {
                    return res.status(400).send("Old password required.");
                }
                const validOldPassword = await argon2.verify(
                    currentUser.password, 
                    updateData.oldPassword + pepper
                );

                if (!validOldPassword) {
                    return res.status(400).send("Old password incorrect.");
                }
            }

            const passwordWithPepper = updateData.password + pepper;
            updateData.password = await argon2.hash(passwordWithPepper); 
        }
        const updatedUser = await userModel.updateUser(pool, userId, updateData);
        res.status(200).json(updatedUser); 
    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
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
    let userId = null;
    if (req.params.id){
        if (req.user.isAdmin){
            userId = parseInt(req.params.id);
        } else {
            return res.status(403).send("Admin privilege required.");
        }
    } else {
        userId = req.user.id;
    }

    const currentUser = await userModel.getUserById(pool, userId); 

    if (!currentUser){
        return res.status(404).send("User not found");
    }

    await userModel.deleteUser(pool, userId);
    res.status(200).send("User deleted successfully.");
    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
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
            return res.status(404).send("User not found.");
        }

        const photoUrl = user.photo
        ? `${req.protocol}://${req.get('host')}/images/${user.photo}.jpeg` 
        : null;

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            photo: photoUrl
        });


    } catch (err) {
        res.status(500).send("Internal server error " + err.message); 
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

    const users = await userModel.getUsers(pool, { 
      name,
      role,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.status(200).json(users); 
  } catch (err) {
    res.status(500).send('Erreur serveur'); 
  }
};