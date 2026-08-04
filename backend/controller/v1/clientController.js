import { pool } from "../../database/database.js";
import * as userModel from "../../model/v1/client.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import path from 'path';
import { fileURLToPath } from 'url';
import {saveImage} from '../../middleware/saveImage.js';
import * as uuid from 'uuid'
import { PAGINATION } from '../../Config/pagination.js';
import { validatePagination } from '../../Utils/validationPagination.js'
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { faker } from '@faker-js/faker';


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         photo:
 *           type: string
 *           nullable: true
 *         googleid: 
 *           type: string
 *           nullable: true 
 *         street: 
 *           type: string
 *         street_number: 
 *           type: integer 
 *         registration_date: 
 *           type: string
 *           format: date 
 *         is_admin: 
 *           type: boolean
 *         address_id: 
 *           type: integer
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
 *                 token: 
 *                   type: string
 *                 user: 
 *                   $ref: '#/components/schemas/User'
 */

export const createUser = async (req, res) => {
  try {
    const {email, password, streetNumber, street, addressID} = req.body;
    let {username} = req.body;
    if (!username){
        username = faker.internet.username();
    }   

    const photo = req.file;
    let user = await userModel.getUserByEmail(pool, email)
    const destFolderImages = './middleware/photo';
    
    if (!user){
        let imageName = null;
        if (photo){
            imageName = uuid.v4();
            await saveImage(photo.buffer, imageName, destFolderImages); 
        }
        
        const passwordHash = await argon2.hash(password, {secret: Buffer.from(process.env.PEPPER)});


        user = await userModel.createUser(pool, {username, email, streetNumber, street, photo:imageName, isAdmin:false, addressID, passwordHash});
        const token = jwt.sign(
                  { 
                      id: user.id, 
                      isAdmin: user.is_admin,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "24h" }
              );
              res.status(200).send({ token, user });
    } else {
      res.status(409).send("User account already exists");
    }
  } catch (err) {
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
  }
}

/**
 * @swagger
 * components:
 *   responses:
 *     UserProfileWithoutSensitiveData:
 *       description: User profile successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   photo:
 *                     type: string
 */

export const getUserById = async (req, res) => {
    try {

        const clientID = req.params.id;

        const user = await userModel.getProfileById(pool, clientID); 

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const photoUrl = user.photo
        ? `/images/${user.photo}.jpeg`
        : `/images/unknown_person.jpeg`;

        user.photo = photoUrl;

        delete(user.registration_date);
        delete(user.isadmin);
        delete(user.street);
        delete(user.street_number);
        delete(user.googleid);
        delete(user.email);
        delete(user.address_id);

        res.status(200).json({
            user
        });

    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
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

        let user = await userModel.getUserByEmail(pool, email)
        
        if (!user){

            const passwordHash = await argon2.hash(password, {secret: Buffer.from(process.env.PEPPER)});

            user = await userModel.createUser(pool, {username, email, streetNumber, street, photo:null, isAdmin:createAdminUser, addressID, password});
            
            const token = jwt.sign(
                { 
                    id: user.id, 
                    isAdmin: user.is_admin,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            
            res.status(200).send({ token, user });
        } else {
            res.status(409).send("User account already exists");
        }
    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
    }
}

/**
 * @swagger
 * components: 
 *     responses: 
 *         UserUpdated: 
 *            description: The user has been successfully updated   
 *            content: 
 *              application/json: 
 *                  schema: 
 *                     $ref: '#/components/schemas/User'
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

            const destFolderImages = './middleware/photo';
            const imageName = uuid.v4();

            await saveImage(photo.buffer, imageName, destFolderImages);
            updateData.photo = imageName;
        }

        if (currentUser.password && updateData.password) { 
            const pepper = process.env.PEPPER;
            
            if (!req.user.isAdmin) {
                if (!updateData.oldPassword) { 
                    return res.status(401).send("Old password required.");
                }

                const validOldPassword = await argon2.verify(
                    currentUser.password, 
                    updateData.oldPassword,
                    { secret: Buffer.from(pepper) }
                );

                if (!validOldPassword) {
                    return res.status(401).send("Old password incorrect.");
                }
            }

            const password = updateData.password;
            updateData.password = await argon2.hash(password, { secret: Buffer.from(pepper) }); 
        }

        const updatedUser = await userModel.updateUser(pool, userId, updateData);
        res.status(200).json(updatedUser); 
    } catch (err) {
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
    }
};



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
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
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
 *             type: object 
 *             properties: 
 *               user: 
 *                 $ref: '#/components/schemas/User' 
 */

export const getOwnUser = async (req, res) => {
    try {
        const clientID = req.user.id;
        const user = await userModel.getProfileById(pool, clientID);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const photoUrl = user.photo
        ? `/images/${user.photo}.jpeg` 
        : null;

        res.status(200).json({
            user
        });

    } catch (err) {
        console.error("Internal server error", err);  
        return res.status(500).send("Internal server error");
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     ReadAllUsers:
 *       description: The admin read all users
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     registration_date:
 *                       type: string
 *                       format: date
 *                     address_id:
 *                       type: integer
 *                     is_admin:
 *                       type: boolean
 *                     city:
 *                       type: string
 *                     postal_code:
 *                       type: string
 *                     street:
 *                       type: string
 *                     street_number:
 *                       type: integer
 *               total:
 *                 type: integer
 *                 description: Total number of users matching the search criteria
 *
 *     InvalidRole:
 *       description: Role must be 'admin' or 'user'
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */

export const getUsers = async (req, res) => {
  try {
    const { name, role, page, limit } = req.query;

    if (role && role !== 'admin' && role !== 'user') {
      return res.status(400).send('role must be "admin" or "user"');
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

    const users = await userModel.getUsers(pool, { 
      name,
      role,
      page:  pageResult,
      limit: limitResult
    });

    res.status(200).json(users); 
  } catch (err) {
    if (err instanceof PaginationValidationError) {
         return res.status(400).json({ error: err.message }); 
    }
    console.error("Internal server error", err); 
    return res.status(500).send("Internal server error");
  }
};