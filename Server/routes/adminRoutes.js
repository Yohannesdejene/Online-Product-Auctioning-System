const {sequelize}=require('../models');
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
const router=require('express').Router();
const multer =require('multer');
const upload=multer({storage:multer.memoryStorage()})
var cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
var jsonParser=bodyParser.json();

router.use(jsonParser);
const{Admin,Auction,Banker,ReportedAuction,Buyer,Category,ClosedBid,Notification,Payment,Pictures,Product,Seller,Transaction}=sequelize.models;
const authorize=async(req,res,next)=>{
    let {phonenumber,password}=req.body;
    console.log(phonenumber,password);
    return Admin.findOne(
        {
            where: {
            phonenumber:phonenumber,
        },
        attributes:['Aid','password']
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
                find.uid=data.Aid;
                find.allow=true;
            }
            return find;
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
        res.cookie("jwt",accessToken,{httpOnly:true});
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
const checkAuthorization =async(req,res,next)=>{
    if(req.cookies.jwt){
        const token=req.cookies.jwt;
        if(token==null){
            res.status(400).send("not logged in")
        }
        jwt.verify(
            token,process.env.ACCESS_TOKEN_SECRET,
            (err,user)=>{
                if(err){
                    res.send(err).status(404);
                }
                req.user=user;
                next();
            }
        )
    }
}

router.post('/login',authorize,(req,res)=>{
    res.sendStatus(200);
})
router.post('/deleteauction',checkAuthorization,async(req,res)=>{
    let aid=req.body.aid;
    try {
    let bidders=await Bid.findAll(
        {
            where:{AuctionId:aid}
        }
    )
    if(bidders){
        bidders.map(async(bidder)=>{
            let prevbidprice=bidder.bidprice;
            await Bid.update({
                bidprice:prevbidprice+100,
                where:{
                    id:bidder.id
                }
            })
        })
        await Auction.destroy({
            where:{
                id:aid
            }
        })
        res.sendStatus(200);
    }else{
        await Auction.destroy({where:{id:aid}});
        res.sendStatus(200);
    }
} catch (error) {
      console.log("The error was ",err);
      res.sendStatus(500);  
}
})
router.post('/deletseller',checkAuthorization,async (req,res)=>{
    try {
        await Seller.destroy({
            where:{id:sid}
        })
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
        console.log("The error occuted is ",error)
    }
}

)
router.get('/myprofile',checkAuthorization,(req,res)=>{
    let userid=req.user;
    return Admin.findOne({
        where:{id:uid}
    }).then((data)=>{
        res.send(data);

    }).catch(err=>{
        console.log("The error occures is ",err);
        res.sendStatus(
            400
        );
    })
})
router.post('/changepassword',checkAuthorization,async(req,res)=>{
    let {pp, np, cp}=req.body;
    let uid=req.user;
    console.log(req.body)
    if(np==cp){
        return Admin.findOne({
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
                return Admin.update({
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
router.get('/closedbid',checkAuthorization,async(req,res)=>{
    return ClosedBid({
        include:[
            {model:"Auction"}
        ]
    }).then((data)=>{
        res.send(data);
    })
})
router.get('/reportedAuction',(req,res)=>{
    return ReportedAuction.findAll({
        include:{model:Auction}
    }).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(400)
    })
})


module.exports=router;