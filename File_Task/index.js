const express = require('express');
const app = express();
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    fs.readdir('./files',(err,file)=>{
        res.render('index',{file:file});
    });
});

app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`,`${req.body.details}`,(err)=>{
        res.redirect('/');
    });
});

app.get('/readFile/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,(err,data)=>{
        if(err){
            res.redirect='/';
        }else{
            res.render('readFile',{filename:req.params.filename,data:data});
        }
    })
});

app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename:req.params.filename});
});

app.post('/edit',(req,res)=>{
    fs.rename(`./files/${req.body.pervTitle}`,`./files/${req.body.newTitle}`,()=>{
        res.redirect('/');
    })
});

app.listen(3000)