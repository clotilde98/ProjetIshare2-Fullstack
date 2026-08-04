import Router from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'

export const productTypeRouter = (controller, validator) => {
const router = Router();

router.post('/', checkJWT, mustBeAdmin, validator.createProductCategoryValidator, controller.createProductType);

router.get('/',checkJWT, controller.getCategories);

router.patch('/:id',checkJWT, mustBeAdmin, validator.updateProductCategoryValidator, controller.updateProductType);

router.delete('/:id',checkJWT,mustBeAdmin, controller.deleteProductType);


return router;

}