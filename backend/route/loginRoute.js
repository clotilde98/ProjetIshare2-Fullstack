import Router  from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'; 


export const loginRouter = (controller, validator) => {
const router = Router();
router.post('/login', validator.loginValidator, controller.login);

router.post('/loginWithGoogle', validator.loginValidator, controller.loginWithGoogle); 

if(controller.refreshToken){
    router.post('/refresh-token', checkJWT,controller.refreshToken); 
}

return router;
}