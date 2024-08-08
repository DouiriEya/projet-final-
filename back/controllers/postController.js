// lkolhom tsted w ye5dmou 
const Post = require('../models/post');
const User = require('../models/user');
const Profile = require('../models/profil');
const Notification = require('../models/notification');
// fc to notify all his friends he posted a new post or updated or deleted 
const notify = async (userId, message, postId) => {
    try {
        const profile = await Profile.findOne({ userId });
        const friendsList = profile.friendsList;
        for (const friend of friendsList) {
            const notifData = {
                userId: friend.userId,
                message: message,
                type: 'post',
                seen: false,
                from: userId
            };
            if (postId) {
                notifData.postId = postId; // Include postId if provided
            }
            const notif = new Notification(notifData);
            await notif.save();
        }
    } catch (err) {
        console.error(err);
    }
};

// fc to create a post tested w te5dem
const createPost = async (req, res) => {
    const { vehicule, pricePerSeat, paymentMethod, RIB, startlocation, destination, time, date, seats } = req.body;
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });
    const username = profile.username;

    try {
        const postedDeja = await Post.findOne({
            userId,
            startlocation,
            destination,
            time,
            date,
            signature: username
        });
        if (postedDeja) {
            return res.status(400).json({ msg: 'You cannot post the same ride again.' });
        }
        const newPost = new Post({
            userId,
            vehicule,
            pricePerSeat,
            paymentMethod,
            RIB,
            startlocation,
            destination,
            time,
            date,
            seats,
            signature: username
        });
        await newPost.save();

        // Notify friends about the new post
        await notify(userId, `New post from ${profile.username}`, newPost._id);

        res.status(201).json({ msg: 'Post created successfully!', post: newPost });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// fc to update a post  tested w te5dem 
const updatePost = async (req, res) => {
    const { userId, vehicule, pricePerSeat, paymentMethod, RIB, startlocation, destination, time, date, seats } = req.body;
    const { postId } = req.params;
    const profile = await Profile.findOne({ userId });

    try {
        const postToUpdate = await Post.findById(postId);
        if (!postToUpdate) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { userId ,vehicule, pricePerSeat, paymentMethod, RIB, startlocation, destination, time, date, seats },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(500).json({ msg: 'Failed to update post' });
        }

        // Notify
        await notify(userId, `Your friend ${profile.username} updated this post: ${vehicule} from ${startlocation} to ${destination}`);

        res.status(200).json({ msg: 'Post updated successfully', updatedPost });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
// fc to delete a post
const deletePost = async(req,res)=>{
    const {postId} = req.params;
    const {userId} = req.body;
    const profile = await Profile.findOne({userId});
    try {
        const postToDelete = await Post.findById(postId);
        if (!postToDelete) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        await Post.findByIdAndDelete(postId);
        await notify(userId, `sorry , your  friend ${profile.username} canceled this trip 
             from ${postToDelete.startlocation} to ${postToDelete.destination}`);
        res.status(200).json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ msg: 'Server error', error: err.message });
    
}}
// fc to get all posts posted by a user selon son id 
const viewPost = async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all posts for the given user ID and sort them by creation date in descending order
        const posts = await Post.find({ userId }).sort({ createdAt: -1 });
        console.log(posts);
        if (!posts || posts.length === 0) {
            return res.status(404).json({ msg: 'No posts found' });
        } else {
            return res.status(200).json({ message: 'Here are your posts', posts });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
 };


// fc to get a post by its id
const getPostById = async (req, res) => {
    const { postId } = req.query;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// fc to look for a post based on criteria 
const searchPosts = async(req,res)=>{
    const {startlocation, destination, date} = req.query;
    try{
        const filter = {}
        if (startlocation) filter.startlocation = startlocation;
        if (destination) filter.destination= destination;
        if (date) filter.date = date ;
        const post = await Post.find(filter);
        console.log('posts:',post) ; 
        return res.status(200).json({message:'voili voilo',post})
    
    }
    catch(err){
        res.status(500).json({msg: err.message})
    }

}

module.exports = {
    createPost, 
    updatePost, 
    deletePost,
    searchPosts, 
    getPostById,
    viewPost} ;



