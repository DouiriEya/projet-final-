const mongoose = require('mongoose') ; 
const User= require('./user') ;

const friendRequestSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    status:{
        type:String,
        enum : ['pending','accepted','rejected'] ,
        
    }
},{timestamps:true}) ; 

// bch naaml instance 
const friendRequest = mongoose.model('friendRequest',friendRequestSchema,'friendRequests') ;
module.exports= friendRequest ; 