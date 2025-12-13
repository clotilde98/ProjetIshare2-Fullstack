import Router from 'express';
import {getCategories, createTypeProduct, updateTypeProduct, deleteTypeProduct} from '../controller/productTypeController.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'
import {categoryProductValidatorMiddleware} from '../middleware/validation.js';


const router = Router();
router.post('/', checkJWT,mustBeAdmin,categoryProductValidatorMiddleware.createCategoryProductValidator,createTypeProduct);


router.get('/',checkJWT, getCategories);

router.patch('/:id',checkJWT,mustBeAdmin,categoryProductValidatorMiddleware.updateCategoryProductValidator, updateTypeProduct);
router.delete('/:id',checkJWT,mustBeAdmin, deleteTypeProduct);


export default router;

