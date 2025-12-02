const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', async (req,res)=>{
    let allUsers = await userModel.find();
    res.render('index',{users:allUsers});
});

app.get('/addUser',(req,res)=>{
    res.render('addUser');
});

app.post('/create', async (req,res)=>{
    let {name,email,image} = req.body;
    let createUser = await userModel.create({
        name,email,image
    });

    res.redirect('/');
});

app.get('/delete/:id', async (req,res)=>{
    let deleteUser = await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect('/');
})

app.get('/edit/:id', async (req,res)=>{
    let oneUser = await userModel.findOne({_id:req.params.id});
    res.render('edit',{users:oneUser});
});

app.post('/edit/:id', async (req,res)=>{
    let editUser = await userModel.findOneAndUpdate({_id:req.params.id},{
        name:req.body.name,
        email:req.body.email,
        image:req.body.image
    });

    res.redirect('/');
});

app.listen(3000);