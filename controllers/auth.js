const User =require('../modals/User');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');

const {validationResult} =require('express-validator/check');


exports.postSignUp= (req,res,next)=>{


    const errors =validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(403).json({
            message:"Validation Error",
            error:errors.array()        });
        }

    const name = req.body.name;
    const email=req.body.email;
    const dateOfBirth=req.body.dateOfBirth;
    const friendlist=req.body.friendlist;
    const password =req.body.password;
    const firebaseToken=req.body.firebaseToken;
    
        User.findOne({email:email}).then(user=>{
        if(user)
        {
           return res.status(403).json({
                message:"Email id already registered"
            });
        }
      
        bcrypt.hash(password,12).then(hash=>{
            const newUser =new User({
                name:name,
                email:email,
                dateOfBirth:dateOfBirth,
                friendlist:friendlist,
                password:hash,
                firebaseToken:firebaseToken
            });
        
             return newUser.save()
        
        }).then(result=>{
            console.log(result);
           return res.status(200).json({
                message:"User Created Successfully",
                result:result
            }).catch(err=>{
                console.log(err);
                res.status(500).json({
                    message:"internal server error",
                    error:err
                })
        
            });
       
    


    });

    }).catch(err=>{
        console.log(err);
      return  res.status(500).json({
            message:"internal server error",
            error:err
        })

    });



}

exports.signin =(req,res,next)=>{

   const errors =validationResult(req);
   if(!errors.isEmpty())
   {
    console.log(errors)
    return res.status(403).json({
        message:"Validation Error",
        error:errors.array()        });

   }
    const email =req.body.email;
    const password =req.body.password;
    let loadedUser;

    User.findOne({email:email}).then(user=>{
        if(!user){
            res.status(401).json({
                message:"Email Id not Registered"

            });
        }
        loadedUser=user;
       return  bcrypt.compare(password,user.password).then(isEqual=>{
            if(!isEqual){
                res.status(401).json({
                    message:"invalid password "
                });
            }
            const token=jwt.sign({
                email:loadedUser.email,
                userId:loadedUser._id.toString()},
                'secret');

               return res.status(200).json({token:token,userId:loadedUser._id.toString()});

            });

           

        }).catch(err=>{
            console.log(err);
            return  res.status(500).json({
                  message:"internal server error",
                  error:err
              })
      
        });

    }

