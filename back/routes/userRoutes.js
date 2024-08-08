const express = require('express');
const router=express.Router();
const {register , login , logout,deleteAcc}= require('../controllers/userController');

//bch n9aydou user jdid donc post method testitha mrigla 
router.post('/registerUser',register) ; 

// bch naamlou login it is a get method  testitha aal postman mrigla 
router.post('/login',login) ; 

// bch naaml logout => get method      testitha te5dem aal postman mrigla
router.post('/logout/:userId',logout) ; 

// Delete account route (DELETE method) tested w te5dem 
router.delete('/delete/:userId', deleteAcc);



module.exports = router ; 
