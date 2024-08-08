const Complaint = require('../models/complaint') ; 

// fc for the user to type in a complaint 
const complain = async (req,res)=>{
    const {title , lettre , userId , status }=req.body ; 
    try {
        const complaint = new Complaint({
            title , 
            lettre , 
            userId , 
            status
        })
        await complaint.save() ; 
        res.status(201).send(complaint) ; 
    }
    catch(err){
        console.log(err) ;
    }
} ;
