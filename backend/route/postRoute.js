import { Router } from 'express';
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  searchPostByCategory
} from '../controller/postController.js';

import {checkJWT} from '../middleware/identification/jwt.js'
import {postValidatorMiddleware} from '../middleware/validation.js';
import {upload} from '../middleware/photo/upload.js';


const router = Router();

router.post("/", checkJWT, upload.single('photo'), postValidatorMiddleware.createPostValidator, createPost);           
router.get("/byCategory", checkJWT, searchPostByCategory); 
router.get("/", checkJWT, getPosts);      
router.get("/:id", checkJWT, getPost);     
router.patch("/:id", checkJWT, upload.single('photo'), postValidatorMiddleware.updatePostValidator, updatePost);     
router.delete("/:id", checkJWT, deletePost);      

export default router;
