const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes');
const dotevn = require('dotenv');
dotevn.config();
const mongoose = require('mongoose');
const connectToDB = require('./config/db');
connectToDB();
const cookieParser = require('cookie-parser');

app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userRouter);

app.listen(3000,()=>{
    console.log('Server started');
})