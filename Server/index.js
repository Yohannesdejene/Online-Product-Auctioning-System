require('dotenv').config();
const express = require('express');
const cors=require("cors");
const {sequelize}=require('./models');
const app = express();
const bcrypt=require('bcrypt');
var cookieParser=require('cookie-parser');
const { json } = require('express');
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);
const { Op} = require('sequelize');
// trying the request 
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:7494'],
    credentials:true,
}));
const adminRoutes=require('./routes/adminRoutes');
const buyerRoute=require('./routes/buyerRoute');
const sellerRoute=require('./routes/sellerRoute');
const{Admin,Auction,Banker,ReportedAuction,Buyer,Category,ClosedBid,Notification,Payment,Pictures,Product,Seller,Transaction}=sequelize.models;
app.options('*', cors());
app.use(express.json()); 
app.use(cookieParser());
app.use('/custom',buyerRoute);
app.use('/special',adminRoutes);
app.use('/sel',sellerRoute);

async function main() {
    // creating database structures
    await sequelize.sync({alter:true});
    console.log("finished")
} 
async function tableChange() {
    await Auction.sync({alter:true});
    console.log("finished")
}
// tableChange();
async function addAdmin(){
    const hash = await bcrypt.hashSync("123", bcrypt.genSaltSync(10));
    console.log(hash);
    return sequelize.models.Admin.create({
        id:"",
        email:"fraolgetachew2772@gmail.com",
        phone:"+251966003807",
        password:hash
    }).then((data)=>{
        console.log(data);
        console.log("finished")
    }).catch(err=>{
        console.log(err);
    })
}

async function addCategories() {
    await  Category.bulkCreate([
        {
            id:"",
            name:"Electronics"
        },
        {
            id:"",
            name:"Furnitures"
        },
        {
            id:"",
            name:"Mobile"
        },
        {
            id:"",
            name:"Vehicle"
        },
        {
            id:"",
            name:"Art"
        },
        {
            id:"",
            name:"Other"
        },
    
    ]);
    console.log("Categories are added in to the database successfully");
}
// addCategories();
// main();

// addAdmin();
function CreateAuction(type) {
    // Types of Notification 
    /**
     *  Types of Notifications in our project
     * 1. Hammerprice update in notification  - 
     * 2. Auction completed notification
     * 3. Auction deleted Notification
     * 4. Auction win and closed notification 
     * 5. Auction start notification
     * 6. 
     * 
     * */
    
}
// CreateAuction();
// io.use((socket,next)=>{
//     console.log("handshake",socket.handshake);
//     next();
// })
let onlineUsers=[];

app.get('/images/:picid',(req,res)=>{
    let id=req.params.picid;
    console.log("fetch image - ",id)
    if(!isNaN(id)){
        return Pictures.findOne({
            where:{id:id}
        }).then(data=>{
            if(data){
                return data.picpath;
            }
        }).then(data=>{
        if(data){
            res.sendFile(__dirname+'/dbImages/'+data)
        }
        else{
            res.sendStatus(404);
        }
    }).catch(err=>{
        console.log(err);
    })
    }else{
        res.sendStatus(404);
    }

})

app.get('/',(req,res)=>{
    console.log("running")
    console.log("the query is",req.query);
    let page=req.query.page==null?1:req.query.page;
    // let type=req.query.subname==null?"electronics":req.query.subname;
    let no_response=6;
    let limit=1;
    let jumpingSet=(page-1)*no_response;
    console.log(page);

    return Auction.findAndCountAll({
                order:[
                    ["createdAt","DESC"]
                ],
                attributes:{exclude:["createdAt","updatedAt"]},
                offset: jumpingSet,
                limit: no_response,
            })
    .then((data)=>{
        let nopage=parseInt(data.count/no_response)+1;
        // console.log(data.rows);
        let response={
            count:nopage,
            data:data.rows
        };
        if (response) {
            console.log(response)
            res.send(response);
        } else {
            res.sendStatus(404);
        }
    })
})

app.get('/category/:cname',async(req,res)=>{
    console.log(req.params);
    const name=req.params.cname;
    Category.findOne({
        attributes:{exclude:["createdAt","updatedAt"]},
        include:{
            model:Auction,
            attributes:{exclude:["createdAt","updatedAt"
            ]}
        },
        where:{name:name}
    }).then(async(data)=> {
        
        if(data){
            res.json( data);
        }
        else{
            res.sendStatus(404);
        }
        
    }).catch(err=>{
        console.log(err)
    })
})

app.get('/search',async(req,res)=>{
    let item=req.query.item;
    let page=req.query.page!=null?req.query.page:1;
    let no_response=6;
    let limit=1;
    // blue tshirt
    let jumpingSet=(page-1)*no_response;
    if(item){
    console.log(page,item);
    return  Auction.findAndCountAll({
        order:[
            ["createdAt","DESC"]
        ],
        attributes:{exclude:["createdAt","updatedAt","CategoryCid"]},
        offset: jumpingSet,
        limit: no_response,
        where:{
                [Op.or]:[
                    // {name:
                    //     {[Op.match]: item}
                    // },
                    // {name:
                    //     {[Op.startsWith]: item}
                    // },
                    {name:
                        {[Op.substring]: item}
                    },
                    {description:
                        {[Op.substring]: item}
                    },
                    
                ]
        }
    })  
    .then(data=>{
        // console.log(data);
        if(data){
           let nopage=parseInt(data.count/no_response);
           data.count=nopage; 
           res.send(data);
        }
        else res.sendStatus(404);

    })
    .catch(err=>{
        console.log(err);
        res.sendStatus(404);
    })}
    else{
        res.sendStatus(404);
    }
    // console.log(count);
    // console.log(rows);
})

// app.get('/subcategory/',async(req,res)=>{
//     const cname=req.query.cname;
//     const page=req.query.page!=null?req.query.page:1;
//     console.log(cname,page);
//     let no_response=6;
//     let jumpingSet=(page-1)*no_response;
//     Category.findOne({
//         attributes:["cid"],
//         where:{cname:cname}
//     }).then((data)=>{
//         if(data){
//             let cid=data.cid;
//         return  Product.findAndCountAll({
//             order:[
//                 ["createdAt","DESC"]
//             ],
//             attributes:{exclude:["createdAt","updatedAt"]},
//             offset: jumpingSet,
//             limit: no_response,
//             where:{CategoryCid:cid}
//         });
//         }
//         return null;
//     })
//     .then(data=>{
//         // console.log(data);
//         if(data){
//         let nopage=parseInt(data.count/no_response);
//         data.count=nopage;
//         console.log(data.count);
//         res.send(data); 
//         }else res.sendStatus(404);
        
//     })
//     .catch(err=>{
//         console.log(err);
//         res.sendStatus(404);
//     })
// })

app.get('/details/:id',async(req,res)=>{
    let id=req.params.id;
    console.log("the id is ",id);
    return Auction.findOne(
        {
            attributes:{exclude:["createdAt","updatedAt"]},
            where:{id:id},
            include:[{
                model:Pictures,
                attributes:{exclude:["createdAt","updatedAt","picpath"]}
            },
            {
                model:Seller,
                attributes:{exclude:["fname","lname","phonenumber","city"]}
            }
        ],
        }
    ).then(async (data)=> {
        if(data){
            res.send(data);
        }
        else{
            res.sendStatus(404);
        }
    })
    .catch(err=>{
        console.log("the error is ",err);
        res.sendStatus(404);

    })
})
app.post('/chargeaccount',async(req,res)=>{
    console.log(req.body)
    let bankerId=req.body.bankerId;
    let userphone=req.body.userphone;
    let amount=req.body.amount;
    console.log("Banker id ",bankerId)
    console.log("Buyer phonenumber ",userphone)
    console.log("Amount",amount)
    let now=Date();
    if(bankerId!=null&&userphone!=null&&amount!=null){
        let buy=await Buyer.findOne({
            where:{phonenumber:userphone},
            attributes:["id","account"]
        })
        console.log(amount,buy.account)
        let recharge=Number(amount)+ Number(buy.account);
        console.log(recharge)
        return Buyer.update(
        {
            account:recharge,
        },
        { where:{
            phonenumber:userphone
            }
        }
        ).then(async(data)=>{
           
            if(data){
                await Payment.create({
                id:"",
                bankerId:bankerId,
                BuyerId:buy.id,
                date:now
            })
            }
            res.sendStatus(200)
        }).catch((err)=>{
            console.log(err);
            console.log("Some error has occured");
            res.sendStatus(400)
        })
    }else{
        res.sendStatus(400)
    }
})

server.listen(6000,()=>{
    console.log("The server is running on 6000");
})

const auctionManage=async ()=>{
    const date=new Date();
    let auctions=await Auction.findAll(
        {
            attributes:["id","startdate","enddate"],
            where:{
                [Op.or]:[
                    {status:"started"
                    },
                    {pname:"notstarted"
                    },
                    
                ]
            }
        }
    );
    auctions.map(async(auction)=>{
        if(auction.startdate==date){
            await Auction.update({
                status:"started",
                include:{
                    model:Seller,
                    attributes:[
                        "phonenumber"
                    ]
                },
                where:{id:auction.id}
            })
        }
        if (auction.enddate==date) {
            await auction.update({
                status:"closed",
                winnerId:winner.buyerId,
                where:{id:auction.id}
            })
            let winner=await Bid.findOne({
                where:{
                    AuctionId:auction.id,
                    bidprice:auction.hammerprice
                }
            })
            await Notification.create({
                id:"",
                AuctionId:auction.id,
                BuyerId:winner.BuyerId,
                message:`Congratulations you have won the auction ${auction.name} you can reach the vendor with phonenumber - ${auction.Seller.phonenumber} `
            })
            let bidders=Bid.findAll(
                {
                    where:{AuctionId:auction.id},
                    attributes:["BuyerId"]
                }
            )
            bidders.map(async(bid)=>{
                    await Notification.create({
                        id:"",
                        AuctionId:auction.id,
                        BuyerId:bidders.BuyerId,
                        message:`The auction ${auction.name} you were participating on has been closed with winning price ${auction.hammerprice}`
                })
            })
            // await ClosedBid.create({

            // })
        }
    });
}
const addOnlineUser=(userid,socketid)=>{
    !onlineUsers.some((user)=>user.userid===userid)&&
    onlineUsers.push({userid,socketid});
}

const removeonlineUser=(socketid)=>{
    onlineUsers=onlineUsers.filter((user)=>user.socketid!==socketid);
}

const authSocketMiddleware = (socket, next) => {
    // since you are sending the token with the query
    const token = socket.handshake.query?.token;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        socket.user = decoded;
    } catch (err) {
        return next(new Error("NOT AUTHORIZED"));
    }
    next();
};
let thereisStart=false;
function Hello() {
    setInterval(() => {
        console.log("Changing the start")
        thereisStart=!thereisStart;
    }, 6000);
    
}
// Hello();
io.on("connection",async(socket)=>{
    console.log(socket.handshake
        )

    console.log("The socket header is ", socket.handshake.headers.cookie)
    //     setInterval(() => {
    //         if (thereisStart) {
    //             socket.emit('message',{message:"the aution has started"});
    //         }else{
    //             socket.emit('message',{message:"the aution hasn't  started yet "});
    //         }
        
    // },4000)
    // Types of Notification 
    /**
     *  Types of Notifications in our project
     * 1. Hammerprice update in notification  
     * 2. Auction completed notification
     * 3. Auction deleted Notification
     * 4. Auction win and closed notification 
     * 5. Auction start notification
     * 6. 
     * 
     * */
    
    // addOnlineUser(userid,socket.id);

    console.log("The socket id is ",socket.id);
    console.log("The number of users are ", io.engine.clientsCount);
    let data=[];
    // bidplaced notification
    socket.on("bidupdate",async(userid,auctionid)=>{
        await bidders
        socket.broadcast.emit('message',data);
        console.log(data);
    })
    socket.on("start",(userid,type)=>{
        
        socket.broadcast.emit('message',data);
        console.log(data);
    })
    socket.on("closed",(userid,type)=>{
        
        socket.broadcast.emit('message',data);
        console.log(data);
    })
    socket.on("deleted",(userid,type)=>{
        
        socket.broadcast.emit('message',data);
        console.log(data);
    })
    socket.on("message",(data)=>{
        console.log(data);
        socket.broadcast.emit('message',data);
        
    })
    var i=0;
    // setInterval(() => {
    //     socket.emit('message', {
    //         message: i++
    //       });
    // }, 3000);
    socket.on('disconnect', () => {
        console.log("Some one has disconnected")
        // removeonlineUser(socket.id);
      });
})