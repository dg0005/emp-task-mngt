import express from 'express';
import { loginController, registerController } from '../controllers/index.js';
import { loginUserSchema, registerUserSchema } from '../validators/useValidators.js';
import validate from '../middleware/validate.js';

const router = express.Router();


router.post('/register',validate(registerUserSchema), registerController);

router.post('/login',validate(loginUserSchema), loginController);



export default router;
