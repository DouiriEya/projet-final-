const mongoose=require('mongoose');
const User = require('./user');
const validator = require('validator');
const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :User,
        required:true
    },
    vehicule:{
        type: String,
        required:true,
    },
    pricePerSeat:{
        type:Number,
        required:true,
        validate:{
            validator:function(p){
                return p>0;
            },
            message:'this is not a valid price'
        }
    },
    paymentMethod:{
        type : String,
        required:true,
        enum:['cash' , 'transfert bancaire'],
        RIB : {
            type:String,
            required:function( ) {
                 return this.paymentMethod === 'transfert bancaire'},
            validate : {
                validator : function(r) {
                    return validator.isNumeric(r) && r.length === 20 ; 
                }
            },
            message:'this is not a valid RIB'
            }
        
    },
    startlocation : {
        type: String, 
        required: true, 
    },
    destination : {
        type : String , 
        required : true,
    },
    time:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    seats:{
        type:Number,
        default:4,
        validate:{
            validator:function(p){
                return p>0;
            },
            message:'bch yhezouk houma kench fl negatif '
        }
    },
    signature:{
        type:String,
        required:true
    }
},{timestamps:true}) ;
const Post = new mongoose.model('post',postSchema,'posts') ;
module.exports= Post ;