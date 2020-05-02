const jwt =require('jsonwebtoken');

module.exports =(req,res,next)=>{
    
    let decodedToken;
    let token
    try{
        console.log(JSON.stringify(req.headers));
         token =req.get('authorization');
        console.log(token)

    }catch(err){
        console.log(err);
         
        return res.status(500).json({
            message:"Internal Server Error"
        });
   

       
    }
try{

    decodedToken=jwt.verify(token,'secret');
}catch(err){

    console.log(err);
    return res.status(401).json({
        message:"Not Authenticated "
    });
}
    


    
    req.userId=decodedToken.userId;
    console.log("user in token"+req.userId);
    console.log("user in req"+req.params.userId.toString());


    if(!(req.userId===req.params.userId))
    {
        // console.log(err);
    return res.status(401).json({
        message:"Not Authorised,userId in the token is different from userId in the param "
    });
    }

    next();
}