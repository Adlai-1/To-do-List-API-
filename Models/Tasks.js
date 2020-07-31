const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB||'mongodb://127.0.0.1:27017/To-Do',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})

const Schema = mongoose.Schema({
    Activity:{
        type:String,
        required:true
    },
    Objective:{
        type:String,
        required:true
    },
    Username:{
        type:String,
        required:true
    },
    Date_of_Completion:{
        type:Date,
        required:true
    }
},{timestamps:true})

const Model_Task = mongoose.model('Tasks',Schema)

module.exports = {Model_Task}