const mongoose = require('mongoose');
const validator = require('validator');
// bch naaml schema lel user 
const userSchema = new mongoose.Schema({
    username:{
              type: String,
              required: true,
    },
    familyName:{
                type: String, 
                required: true
    },
    address:{
             type: String,
             required: true
    },
    phoneNumber:{ 
                type:String,
                required: true ,
                validate:{
                          validator: function (n) {
                        return validator.isMobilePhone(n,'ar-TN')
                },
                message: 'this is not a valid tunisian number'
                }
    },
    CIN:{
        type: String,
        required: true,
        unique: true,
        validate:{
                  validator: function (n) {
                 return validator.isNumeric(n) && n.length === 8;
        },
        message: 'this is not a valid CIN'
        }

    },
    birthDate:{
              type: Date,
              required: true,
              validate: {
                        validator: function(d){
                            return d.getFullYear()<=2003;
                        },
             message: 'you are not allowed to be here'
              }
    },
    email:{
           type: String,
           required: true,
           validate: {
                       validator: validator.isEmail,
                       message:'mail non valid'
           },
          
    },
    password: {
        type: String,
        required: true,
      
    },
    role:{
          type: String,
          default: 'customer'
    }, 
    verified:{
              type: Boolean, 
              default: false },
},
{ timestamps: true }) //timestamps ta3tini 2 attributs fl schema mte3i at the end createdAt w updatedAt


// bch naaml model lel user
const User = mongoose.model('User', userSchema, 'Users');


//exportina lel model User
module.exports = User; 