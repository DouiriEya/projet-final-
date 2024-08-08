const mongoose = require('mongoose');
const User = require('./user');
// 3malna schema lel profile
const profilSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :User,
        unique:true
    },
    username:{
        type: String,
        required: true,
},
    age:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        required:false,
    } ,
    profilePic:{
        type:String,
        required:false,
        default:'https://i.pinimg.com/236x/90/de/25/90de257fdac14d35d66a81ab8e282cad.jpg',
    },
    friendsList: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        _id: false
    }]
},{timestamps:true}
);
const Profile = new mongoose.model('profil',profilSchema,'profils');
module.exports= Profile