const express = require('express');
const router = express.Router();
const { createRating, updateRating,aMonAvis,viewRatings,deleteRating } = require('../controllers/ratingController');

// bch naamlou post request to actually create a rating 
router.post('/createRating',createRating) ; 
// bch naamlou put request to  update a rating
router.put('/updateRating/:ratingId' , updateRating) ; 
// bch naamlou get request to view the rating of a spesific user*
router.get('/viewRatings/:rated',viewRatings) ;
// bch naamlou get request bch a user gets to see the list of people he rated 
router.get('/aMonAvis/:ratedBy',aMonAvis) ; 
// bch naamlou delete request to delete a rating 
router.delete('/deleteRating/:ratingId',deleteRating) ;

module.exports = router;