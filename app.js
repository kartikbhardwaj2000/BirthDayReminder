const express =require('express');
const bodyParser=require('body-parser');
const path =require('path');
const mongoose =require('mongoose');
const cron =require('node-cron');

const authRouter =require('./routes/auth');
const userRouter=require('./routes/user');

const User =require('./modals/User');

const sendNotification =require('./sendNotification');



const app =express();


const MongoDB_URI='mongodb+srv://kartikbhardwaj016:k30082000@cluster0-punkd.mongodb.net/birthday-reminder?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true'


app.use(bodyParser.json());


app.use("/auth",authRouter);
app.use("/user",userRouter);



cron.schedule("* * * * *",()=>{
    console.log("cron job executed");
    let friends=[];
    let currDateTime=new Date();
        let currDate=currDateTime.toISOString().slice(0,10);
        let dateArray =currDate.split('-');
        console.log("current date" +dateArray);
    User.find({},(err,users)=>{
       
        //code to wish the user if it is his birthday today

       users.forEach(user=>{
        let UserDateArr= user.dateOfBirth.split('-');
        console.log(UserDateArr);
        if(UserDateArr[2]===dateArray[2]&&(UserDateArr[3]===dateArray[3])){
             let title= user.name;
             let token =user.firebaseToken;
             console.log(title);

             if(token&&title)
             {
                let body = {
                    title:"Its your birthday today",
                    body:"have great day"
                };

                sendNotification(token,body);

             }


             
        }
        //code to notify the user if today is any of his friend's birthday 


        if(user.friendList){
            userFriendList=user.friendList;
            userFriendList.forEach(friend=>{
                if(friend)
{
                let friendDateArr= friend.dateOfBirth.split('-');
                console.log(friendDateArr);
                if(friendDateArr[2]===dateArray[2]&&(friendDateArr[3]===dateArray[3])){
                    let title= friend.name;
                    let token =user.firebaseToken;
                    console.log(title);
                  let body = {title:"Its "+ title+"'s birthday today",body:"send him your good wishes"};

                    if(token&&title)
                    {
                        sendNotification(token,body);

                    }

                    }
                }
       
       });

    }
    
});

    });
});





mongoose.connect(MongoDB_URI).then(result=>{
    console.log('connected');
    app.listen(8080);
}).catch(err=>{
    console.log(err);
});
   
