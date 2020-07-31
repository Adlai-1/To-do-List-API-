const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB||'mongodb://127.0.0.1:27017/To-Do',{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true})

const Schema = mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        trim:true
    },
    Username:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        minlength:6
    }
},{timestamps:true})

const Model_User = mongoose.model('Users',Schema)

module.exports = {Model_User}