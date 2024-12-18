import express from 'express';
import {signUp,verifyEmail,sendVerificationEmail, signin, forgotPassword,resetPassword} from '../controller/userController.js'
import { signUpLimiter, verificationLimiter } from '../middlewares/rate-limmiters.js';
import ValidateUser from '../middlewares/validations/UserValidate.js';
const router=express.Router();


router.post('/auth/signup',signUpLimiter,ValidateUser,signUp);

router.post("/auth/verify-email",verificationLimiter,sendVerificationEmail);

router.put("/auth/verify-email/:token",verificationLimiter,verifyEmail);

router.post('/auth/signin',signUpLimiter, signin);

router.post('/auth/forgetPassword',forgotPassword);

router.post('/auth/reset-password/:token',resetPassword)


export default router;



