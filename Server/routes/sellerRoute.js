const {sequelize}=require('../models');
const jwt =require('jsonwebtoken');
const bcrypt=require("bcrypt");
const router=require('express').Router();
const fs=require('fs');
var bodyParser = require('body-parser');
const{Admin,Auction,Banker,Bid,Buyer,Category,ClosedBid,Notification,Payment,Pictures,Product,Seller,Transaction}=sequelize.models;
const authorizeSeller=async(req,res,next)=>{
    let {phonenumber,password}=req.body;
    return Seller.findOne(
        {
            where: {
                phoneNo:phonenumber,
        },
        attributes:['sid','password']
        }
    ).then(async(data)=>{
        // console.log("the data is ",data.Aid,data.password);
        const find={
            allow:false,
            uid:null
        }
        if (data) {
            const hashed=data.password;
            const compared=await bcrypt.compare(password,hashed);
            if(compared){
                console.log("correct password")
                find.uid=data.sid;
                find.allow=true;
                return find;
            }else{
                console.log("Invalid  password")
                return find;
            }
        }
        else{
            return find;
        }
    }).then(async (find)=>{
        console.log("the find is ",find);
    if(find.allow)
    {  
        const user=find.uid;
        const accessToken=await jwt.sign(user,
            process.env.ACCESS_TOKEN_SECRET);
        console.log("accessToken",accessToken);
        res.cookie("jwt",accessToken,{maxAge: 7200000,httpOnly:true});
        next();
    }
    else {
        console.log(find);
        res.status(400).send("error username or password");
    }
    })
    .catch((err)=>{
        console.log("The error occures is  " +err);
        res.sendStatus(500);
    })
}
const checkAuthorizationSeller=async(req,res,next)=>{
    if(req.cookies.jwt){
        const token=req.cookies.jwt;
        if(token==null){
            res.status(400).send("not logged in")
        }
        jwt.verify(
            token,process.env.ACCESS_TOKEN_SECRET,
            (err,user)=>{
                if(err){
                    res.sendStatus(404);
                }
                req.user=user;
                next();
            }
        )
    }
}
let filname;
const multer =require('multer');
const path=require("path");
var jsonParser = bodyParser.json();
const { urlencoded } = require('express');
// const Deletefiles = require('../deletefile');
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
            cb(null,'./dbImages')
    }
    ,filename:(req,file,cb)=>{
        filname=Date.now()+ Math.round(Math.random()*1000)+ path.extname(file.originalname) ;
        cb(null,filname)
    }
})
const multerFilter=(req,file,cb)=>{
    if(file.mimetype=="image/png"|| file.mimetype=="image/jpg"|| file.mimetype=="image/jpeg" ){
        cb(null,true);
    }else{
         return cb(new Error("type error"),false);
    }
       
}
const upload=multer({
    storage:storage,
    fileFilter:multerFilter,
    
}).fields([
    {name:"image",maxCount:7}
]);
router.use(jsonParser);

router.post('/register',async(req,res)=>{
    let {fname,lname,region,city,phonenumber,password,cp}=req.body;
    console.log(phonenumber,password);
    if(password===cp){
        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        return Buyer.create({
            fname:fname, 
            lname:lname,
            password:hash,
            phone:phonenumber,
            city:city,
            region:region
        }).then(()=>{
            res.status(200).send("registeration verified");
        }).catch((err)=>{
            console.log(err);
            res.status(500).send("some thing went wrong ");
        })
    }
    else{
        res.sendStatus(500);
    }
})
router.post('/changepp',checkAuthorizationSeller,async(req,res)=>{
    let {fname,lname,telUname,email,region,city}=req.body;
 
    let uid=req.user;
    let=a=req.body;
    console.log("a",a);
    // console.log("fname",fname);
    // console.log("lname",lname);
    // res.sendStatus(200);
    return Seller.update({
        fname:fname,
        lname:lname,
        telUname:telUname,
        email:email,
        region:region,
        city:city
    },{
        where:{cid:uid}
    })
    .then(data=>{
        if(data){
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
  
})
router.post('/changepassword',checkAuthorizationSeller,async(req,res)=>{
    let {pp, np, cp}=req.body;
    let uid=req.user;
    console.log(req.body)
    if(np==cp){
        return Seller.findOne({
            attributes:[
                "password"
            ],
            where:{cid:uid}
        })
        .then(async (data)=>{
            const check=await bcrypt.compare(pp,data.password);
            if(check){  
                console.log("true")
                const hash = await bcrypt.hashSync(np, bcrypt.genSaltSync(10));
                return Customer.update({
                    password:hash
                },{
                    where:{cid:uid}
                }).then((data)=>{
                    console.log("succesful update")
                    if(data){
                        res.status(200).send("ok");
                    }
                })
            }else{
                console.log("false")
                res.sendStatus(404);
            }
        })
        .catch((err)=>{
            console.log(err);
            res.status(404);
        })
    
    }
})
router.post('/login',authorizeSeller,(req,res)=>{
    res.sendStatus(200);
})




module.exports=router;