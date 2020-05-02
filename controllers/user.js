const User =require('../modals/User');

const {validationResult} =require('express-validator/check');

exports.postAddFriend=(req,res,next)=>{

const errors =validationResult(req);
if(!errors.isEmpty())
{
    console.log(errors)
    return res.status(403).json({
        message:"Validation Error",
        error:errors.array()        });
}
    const friend = req.body.friend;
    const userId=req.params.userId;
    User.findById(userId).then(user=>{
         const friendList =user.friendList
         friendList.push(friend);
         return user.save();
    }).then(result=>{
        console.log(result);
        res.status(201).json({
            message:"friend added successfully",
            result:result
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"internal server error",
            error:err
        });

    })
}

exports.getUser=(req,res,next)=>{
    const userId=req.params.userId;
    let friendList;
    let name;
    let currDateTime=new Date();
    console.log(currDateTime);
    let currDate=currDateTime.toISOString().slice(0,10);
    console.log(currDate);

    let dateArray =currDate.split('-');
    console.log(dateArray);

    

    User.findById(userId).then(user=>{
        if(!user)
        {
            return res.status(404).json({
                message:"User Does not exist"
            });}

           name=user.name;
           console.log(user);
           list=user.friendList;
           console.log(list);

           friendList=list.map(friend=>{
               console.log(friend)
               let friendDateArr= friend.dateOfBirth.split('-');
               if(friendDateArr[2]>dateArray[2]){
                   return friend;
               }else if(friendDateArr[2]===dateArray[2]&&(friendDateArr[3]>dateArray[3])){
                   return friend;
               }
           });

           let response={
               name:name,
               friendList:friendList
           };
           res.status(200).json({
               message:"sucess",
               data:response
           });
           

        
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"internal server error",
            error:err
        });
    });



}

exports.postToken=(req,res,next)=>{


    const errors =validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors)
        return res.status(403).json({
            message:"Validation Error",
            error:errors.array()        });
    }
    const userId=req.params.userId;

    const firebaseToken=req.body.firebaseToken;
    console.log(userId);

    User.findById(userId).then(user=>{

        if(!user){
      
            return res.status(404).json({
                message:"User Does not exist"
            });
        }

        user.firebaseToken=firebaseToken;
        console.log(user.fireBaseToken)
       return user.save();



    }).then(result=>{
        return res.status(201).json({
            message:"Success firebaseToken Added/updated",
            result:result
    
    });
    }).catch(err=>{

    })
}