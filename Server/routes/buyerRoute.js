const {sequelize}=require('../models');
const jwt =require('jsonwebtoken')
const router=require('express').Router();
const bcrypt=require('bcrypt');
const{Admin,Auction,Banker,Bid,Buyer,Category,ClosedBid,Notification,Payment,Pictures,Product,Seller,Transaction}=sequelize.models;
const authorizeCustomer=async(req,res,next)=>{
    let {phonenumber,password}=req.body;
    console.log(phonenumber,password);
    console.log(req.body);
    if(phonenumber==null||password==null){
        return ;
    }
    return Buyer.findOne(
        {
            where: {
            phone:phonenumber,
        },
        attributes:['cid','password']
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
                find.uid=data.cid;
                find.allow=true;
                return find;
            }else{
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
            process.env.REFRESH_TOKEN_SECRET);
        // console.log("accessToken",accessToken);
        res.cookie("u",accessToken,{httpOnly:true});
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
const checkAuthorizationCustomer =async(req,res,next)=>{

    if(req.cookies.u){
        const token=req.cookies.u;
        if(token==null){
            res.sendStatus(400);
        }
        jwt.verify(
            token,process.env.REFRESH_TOKEN_SECRET,
            (err,user)=>{
                if(err){
                    res.sendStatus(403);
                }
                req.user=user;
                next();
            }
        )
    }
    else if(req.headers.cookies){
        let contentincookie=req.headers.cookies;
        const token=contentincookie.slice(2);
        jwt.verify(
            token,process.env.REFRESH_TOKEN_SECRET,
            (err,user)=>{
                if(err){
                    res.sendStatus(403);
                }
                req.user=user;
                next();
            }
        )
    }
    else{
        res.sendStatus(403);
    }

}
router.post('/register',async(req,res)=>{
    let {fname,lname,phonenumber,password,cp}=req.body;
    let type="buyer";
    console.log(phonenumber,password);
    if(password===cp){
        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        return Buyer.create({
            fname:fname, 
            lname:lname,
            password:hash,
            phone:phonenumber,
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
router.post('/changepp',checkAuthorizationCustomer,async(req,res)=>{
    let {fname,lname,telUname,email,region,city}=req.body;
 
    let uid=req.user;
    let=a=req.body;
    console.log("a",a);
    // console.log("fname",fname);
    // console.log("lname",lname);
    // res.sendStatus(200);
    return Buyer.update({
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
router.post('/changepassword',checkAuthorizationCustomer,async(req,res)=>{
    let {pp, np, cp}=req.body;
    let uid=req.user;
    console.log(req.body)
    if(np==cp){
        return Buyer.findOne({
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
router.post('/login',authorizeCustomer,(req,res)=>{
    res.sendStatus(200);
})

module.exports=router;