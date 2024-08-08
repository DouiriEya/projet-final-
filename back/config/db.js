const mongoose = require('mongoose') ; 
const uri='mongodb+srv://Mario:cupcake1701@datahub.obtr9rr.mongodb.net/Tariki'; 
const run = async () => {
    try {
        await mongoose.connect(uri) ; 
        console.log('c beau ❤️')
    }
    catch (err) {
        console.log(err) ;
    }
}

module.exports=run;