const express = require('express');
const router = express.Router();
const {body,validationResult}=require('express-validator');
const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register',(req,res)=>{
    res.render('register');
})

router.post('/register',
    body('email').trim().isEmail().isLength(13),
    body('username').trim().isLength(3),
    body('password').trim().isLength(5),
    
    async (req,res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'Invalid Data'
            })
        }

        const {username,email,password}=req.body;

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = await userSchema.create({
            email,
            username,
            password:hashPassword
        })

        res.send('Register');
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength(3),
    body('password').trim().isLength(5),

    async(req,res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'Username or Password is Incorrect'
            })
        }

        const {username,password}=req.body

        const user = await userSchema.findOne({
            username:username
        })

        if(!user){
            return res.status(400).json({
                message:'Username or Password is Incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.status(400).json({
                message:'Username or Password is Incorrect'
            })   
        }

        const token = jwt.sign({
            userId:user._id,
        }, process.env.JWT_SECRET)

        res.cookie('token',token)
        res.send(`Welcome ${username} , You are Logged in`)

})

module.exports=router;
