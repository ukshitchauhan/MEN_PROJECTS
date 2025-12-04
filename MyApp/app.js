const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/register',async (req,res)=>{
    let {name,username,email,age,password} = req.body;

    let user = await userModel.findOne({email});
    if(user){
        return res.status(500).send('Something Wrong');
    }

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createUser = await userModel.create({
                name,
                username,
                email,
                age,
                password:hash
            });

            res.render('login');
        })
    })
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login', async (req,res)=>{
    let {email,password} = req.body;

    let user = await userModel.findOne({email});
    if(!user){
        res.redirect('/register');
    }

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email , userid:user._id},"shhhhh");
            res.cookie('token',token);
            res.status(200).redirect('/dashboard');
        }else{
            res.redirect('/register');
        }
    });
});

app.get('/profile',isLoggedIn, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate('posts');
    // console.log(user);
    res.render('profile',{user});
});

app.post('/post',isLoggedIn, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    let content = req.body.content;

    let newPost = await postModel.create({
        content,
        user:user._id
    });

    user.posts.push(newPost._id);
    await user.save();
    res.redirect('/profile');
});

app.get('/logout',(req,res)=>{
    res.clearCookie("token");
    res.redirect('/login');
});

app.get('/like/:id',isLoggedIn, async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate('user');
    
    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1);
    }

    await post.save();
    res.redirect('/dashboard');
});

app.get('/edit/:id',isLoggedIn, async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate('user');
    res.render('edit',{post});
});

app.post('/update/:id',isLoggedIn,async (req,res)=>{
    let post = await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content});
    res.redirect('/profile');
});

app.get('/dashboard',isLoggedIn,async (req,res)=>{
    let posts = await postModel.find().populate('user');
    res.render('dashboard',{posts});
});

function isLoggedIn(req,res,next){
    let token = req.cookies.token;
    
    if(!token){
        res.redirect('/login');
    }else{
        let data = jwt.verify(token,"shhhhh");
        req.user = data;
        next();
    }
}
app.listen(3000);