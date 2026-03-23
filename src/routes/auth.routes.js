import express from 'express'
import { register, login, getme, verifyEmail, logout } from '../controllers/auth.controller.js';
const authRouter = express.Router();
import {registerValidation} from '../validation/auth.validation.js'
import { authMiddle } from '../middlewares/auth.middle.js';





authRouter.post("/register",registerValidation, register);
authRouter.post("/login",login);
authRouter.get("/getme",authMiddle, getme);
authRouter.post("/logout", logout);
authRouter.get("/verify-email", verifyEmail)



export default authRouter