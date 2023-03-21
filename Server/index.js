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
const { Server } = require("socket.io");
const io = new Server(server);

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
app.options('*', cors());
app.use(express.json()); 
app.use(cookieParser());
app.use('/custom',buyerRoute);
app.use('/special',adminRoutes);
app.use('/sel',sellerRoute);
app.get("/",(req,res)=>{
    console.log("hello");
})

// io.use((socket,next)=>{
//     console.log("handshake",socket.handshake);
//     next();
// })
app.get('/h',(req,res)=>{
    res.send("Hello every one ");
})
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
    console.log(req.query);
    let page=req.query.page==null?1:req.query.page;
    let type=req.query.subname==null?"electronics":req.query.subname;
    let no_response=6;
    let limit=1;
    let jumpingSet=(page-1)*no_response;
    console.log(type,page);

    return Product.findAndCountAll({
                order:[
                    ["createdAt","DESC"]
                ],
                attributes:{exclude:["createdAt","updatedAt"]},
                offset: jumpingSet,
                limit: no_response,
                where:{CategoryCid:categorycid}
            })
    .then((data)=>{
        let nopage=parseInt(count/no_response);
        console.log(rows);
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
    Broadcategory.findOne({
        attributes:{exclude:["createdAt","updatedAt"]},
        include:{
            model:Category,
            attributes:{exclude:["createdAt","updatedAt","BroadcategoryPid"
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
    return  Product.findAndCountAll({
        order:[
            ["createdAt","DESC"]
        ],
        attributes:{exclude:["createdAt","updatedAt","CategoryCid"]},
        offset: jumpingSet,
        limit: no_response,
        where:{
                [Op.or]:[
                    {pname:
                        {[Op.eq]: item}
                    },
                    {pname:
                        {[Op.startsWith]: item}
                    },
                    {pname:
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

app.get('/subcategory/',async(req,res)=>{
    const cname=req.query.cname;
    const page=req.query.page!=null?req.query.page:1;
    console.log(cname,page);
    let no_response=6;
    let jumpingSet=(page-1)*no_response;
    Category.findOne({
        attributes:["cid"],
        where:{cname:cname}
    }).then((data)=>{
        if(data){
            let cid=data.cid;
        return  Product.findAndCountAll({
            order:[
                ["createdAt","DESC"]
            ],
            attributes:{exclude:["createdAt","updatedAt"]},
            offset: jumpingSet,
            limit: no_response,
            where:{CategoryCid:cid}
        });
        }
        return null;
    })
    .then(data=>{
        // console.log(data);
        if(data){
        let nopage=parseInt(data.count/no_response);
        data.count=nopage;
        console.log(data.count);
        res.send(data); 
        }else res.sendStatus(404);
        
    })
    .catch(err=>{
        console.log(err);
        res.sendStatus(404);
    })
})

app.get('/details/:id',async(req,res)=>{
    let id=req.params.id;
    console.log("the id is ",id);
    return Product.findOne(
        {
            attributes:{exclude:["createdAt","updatedAt"]},
            where:{pid:id},
            include:[{
                model:Pictures,
                attributes:{exclude:["createdAt","updatedAt","picpath"]}
            },
            {
                model:Seller,
                attributes:["companyName","slocation"]
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

server.listen(6000,()=>{
    console.log("The server is running on 6000");
})




io.on("connection",(socket)=>{
    console.log("The socket id is ",socket.id);
    console.log("The number of users are ", io.engine.clientsCount);
    let data=[];
    socket.on("message",(data)=>{
        socket.broadcast.emit('message',data);
        console.log(data);
    })
})