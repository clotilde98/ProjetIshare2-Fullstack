import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js';

import {
  updateUser,
  deleteUser,
  createUser,
  getUsers,
  getOwnUser,
  createUserWithAdmin,
  deleteImageFromUser
} from "../controller/v1/clientController.js";

import {clientValidatorMiddleware1} from '../middleware/validation.js';

import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'

import {upload} from '../middleware/upload.js';


const router = Router();


router.post("/",upload.single('photo'), clientValidatorMiddleware1.addClientValidator, createUser); 

router.post("/admin", checkJWT, clientValidatorMiddleware1.addClientValidator, createUserWithAdmin); 

router.get("/me", checkJWT, getOwnUser);    

router.get("/", checkJWT, mustBeAdmin, getUsers);      

router.delete("/", checkJWT, deleteUser); 

router.delete("/image", checkJWT, deleteImageFromUser);

router.delete("/:id/image", checkJWT, deleteImageFromUser);

router.delete("/:id", checkJWT, deleteUser);       

router.patch("/", checkJWT, upload.single("photo"), clientValidatorMiddleware1.updateClientValidator , updateUser);  

router.patch("/:id", checkJWT, upload.single("photo"), clientValidatorMiddleware1.updateClientValidator , updateUser);

router.delete("/:id/image", checkJWT, deleteImageFromUser);

export default router;