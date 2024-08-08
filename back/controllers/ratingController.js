const Rating = require('../models/rating');
const Profile = require('../models/profil');
const Notification = require('../models/notification');

//fc to create a rating tested w te5dem mrigla 
const createRating = async (req, res) => {
    const { rating, ride, rated, ratedBy, review } = req.body;
    const profile = await Profile.findById(ratedBy);
    console.log(profile);
    try {
        const rating$ = await Rating.findOne({
            ride,
            rated,
            ratedBy,
           
        });
        if (rating$) {return res.status(400).json({ message: 'You can not give your rating twice' }) }
        else { 
           const newRating = new Rating({
            rating,
            ride,
            rated,
            ratedBy,
            review,
            
           }) ;
           await newRating.save();
            // send him notification
            const newNotification = new Notification({
                userId: rated,
                message: `You have been rated by ${profile.username}
                with ${rating} stars`,
            });
            await newNotification.save();
           return res.status(201).json({ message: 'Rating created successfully', newRating});
        }
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//fc to update a rating 
const updateRating = async (req, res) => {
    const { ratingId } = req.params;
    const { rating, ride, rated, ratedBy, review } = req.body;
    try {
        const updatedRating = await Rating.findByIdAndUpdate(
            ratingId,
            { rating, ride, rated, ratedBy, review },
            { new: true }
        );

        if (!updatedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        } else {
            const profile = await Profile.findById(ratedBy);
            const newNotification = new Notification({
                userId: rated,
                message: ` ${profile.username} has updated their rate to ${rating} stars`,
            });
            await newNotification.save();
            return res.status(200).json({ message: 'Rating updated successfully', updatedRating });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//fc to delete a rating
const deleteRating = async (req, res) => {
    const {ratingId}=req.params
    try {
        const deletedRating = await Rating.findByIdAndDelete(ratingId);
        if (!deletedRating) {return res.status(404).json({ message: 'Rating not found' })}
        else {return res.status(200).json({ message: 'Rating deleted successfully', deletedRating })}
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//fc to get all ratings of a specific user siwwe enti t7b tatla3 maah wala howa y7b yra ro7ou 
// tested and it works 
const viewRatings = async(req,res)=>{
    const {rated} = req.params;
    try {
        const ratings = await Rating.find({rated});// ratings will be displayed in an array
        console.log(ratings);
        if (!ratings) {return res.status(404).json({ message: 'No ratings found yet ' })}
        else {
            var x=0;
            for (var i=0; i<ratings.length; i++){
               x = x + ratings[i].rating;
            }
            // console.log('x=',x);
            var average = (x/ratings.length);
            return res.status(200).json({ message: `${average} is the average rate of this user 👻` })
             
           }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
//fc to get all the ratings you gave  tested w te5dem mrigla
const aMonAvis = async(req,res)=>{
    const {ratedBy} = req.params;
    try {
        const ratings = await Rating.find({ratedBy}); // ratings will be displayed in an array
        if (!ratings) {return res.status(404).json({ message: 'No ratings found for you ' })}
        else {
            const array = [];
            for (rate of ratings){
                const profile = await Profile.findById(rate.rated);
                const username = profile.username;
                const rating = rate.rating;
                const review = rate.review;
                array.push({username, rating, review});
            }
            return res.status(200).json({ message: 'here are the people you rated ', array })}
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = { createRating, updateRating, deleteRating, viewRatings, aMonAvis };