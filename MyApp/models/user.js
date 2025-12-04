const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username:String,
    name:String,
    email:String,
    age:String,
    password:String,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "post" }
    ]
});

module.exports = mongoose.model('user',userSchema);