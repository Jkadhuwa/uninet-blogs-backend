import express from 'express';
import verifyToken from '../middleware/verifyToken';
import Validation from '../middleware/validation';
import UserAuth from '../controllers/userController';


const usersRouter = express.Router();
usersRouter.post('/signup', Validation.signupValidation, UserAuth.signup);
usersRouter.post('/logout', [verifyToken], UserAuth.logout);
usersRouter.post('/login', Validation.loginValidation, UserAuth.login);


export default usersRouter;
