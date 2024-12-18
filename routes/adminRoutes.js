import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.js';
import { getAdmins,getUser } from '../controller/AdminPrivilige.js';

const router=express.Router();

router.route('/getAdmins').get(isAuthorized("super-admin"),getUser);


export default router;