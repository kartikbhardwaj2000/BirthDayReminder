const express =require('express');
const router =express.Router();

const {body} =require('express-validator/check');

const authController =require('../controllers/auth');


router.post('/signup',[body('name').isString(),body('password').isString().isLength(5).trim(),body('email').isEmail()
   ],authController.postSignUp);

router.post('/login',[body('password').isString().isLength(5).trim(),body('email').isEmail()],authController.signin);   


module.exports=router;