import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import databaseConnect from './config/connectDatabase.js'
import Userroutes from './routes/userRoutes.js';
import error from './middlewares/error.js';
import BookingRoutes from './routes/bookingRoutes.js';
import AdminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app=express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL,
    exposedHeaders:["set-cookie","Access-Control-Allow-Headers"],
    allowedHeaders:["Content-Type","Authorization"]
}));
databaseConnect();

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}));

app.use(error)

app.get('/',(req,res)=>{
    res.status(200).send("<h1>hello hii world</h1>");
});

app.use('/api/v1/user',Userroutes);
app.use('/api/v1/book',BookingRoutes);
app.use('/api/v1/admin',AdminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Port can be connected ${process.env.PORT}`);
});


process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled rejection`);
    server.close(()=>{
        process.exit(1);
    })
})