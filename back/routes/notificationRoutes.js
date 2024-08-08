const express= require('express');
const router = express.Router();
const {getNotifications}=require('../controllers/notificationController') ;
// bch naamlou get request bch yjiwah les notif lkol
router.get('/getnotifs',getNotifications) ;
module.exports=router;
