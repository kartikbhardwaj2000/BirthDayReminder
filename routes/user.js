const express =require('express');
const router =express.Router();

const userController =require('../controllers/user');

const {body} =require('express-validator/check');
const isAuth =require('../middlewares/isAuth');


router.post('/addfriend/:userId',[body('name').isString().notEmpty(),body('dateOfBirth').isString().notEmpty()],isAuth,userController.postAddFriend);


router.get('/:userId',isAuth,userController.getUser);


router.post('/tokenUpdate/:userId',[body('firebaseToken').isString().notEmpty()],isAuth,userController.postToken);


module.exports=router;