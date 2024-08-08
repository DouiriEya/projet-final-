const mongoose= require('mongoose') ; 
const post= require('./post') ;
const User = require('./user');

const rideRequestSchema = new mongoose.Schema({
    passengerId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:User,
        required:true,
    },
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:post,
        required:true,
    },
    status:{
        type:String,
        required:false,
        enum:['pending','accepted','rejected'],
        default:'pending',
    },
});
const rideRequest = new mongoose.model('rideRequest',rideRequestSchema,'rideRequests');
module.exports= rideRequest ;