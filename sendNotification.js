
const firebaseAdmin =require('firebase-admin');
const serviceAccount =require('./firebaseKey/private-key.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://birthday-reminder-6989e.firebaseio.com"
});


module.exports =(token,body)=>{

    
    let message={
       
        notification:body,

        token:token
    };

    firebaseAdmin.messaging().send(message).then((resp)=>{
        console.log("success:"+resp);
        res.send("sucess");
    }).catch(err=>{
        console.log("error: "+err);
    });




}