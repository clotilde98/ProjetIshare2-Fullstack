import Router from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'; 
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'; 

export const productCategoryRouter = (controller, validator) => {
const router = Router();

router.post('/', checkJWT, mustBeAdmin, validator.createProductCategoryValidator, controller.createProductCategory);

router.get('/',checkJWT, controller.getCategories);

router.patch('/:id',checkJWT, mustBeAdmin, validator.updateProductCategoryValidator, controller.updateProductCategory);

router.delete('/:id',checkJWT,mustBeAdmin, controller.deleteProductCategory);


return router;

}