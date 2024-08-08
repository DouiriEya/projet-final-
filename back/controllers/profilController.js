const Profile = require('../models/profil');
const Post = require('../models/post')

// Create Profile
const createProfile = async (req, res) => {
    const { username, age, bio, profilePic } = req.body;
    const { userId } = req.params;
    try {
        const profileCr = await Profile.findOne({ userId });
        if (profileCr) {
            return res.status(409).json({ message: 'Profile already exists', profileCr });
        } else {
            const newProfile = new Profile({
                userId,
                username,
                age,
                bio,
                profilePic
            });
            await newProfile.save();
            return res.status(201).json({ message: 'Profile created successfully', newProfile });
        }
    } catch (err) {
        console.error('Error creating profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// View Profile
const viewProfile = async (req, res) => {
    const { id } = req.params;
    console.log('Requested userId:', id);

    try {
        const profiles = await Profile.findOne({ userId: id }); // Using `find` to search for all matching documents
        console.log('Profiles found:', profiles);
        if (!profiles) {
            return res.status(404).json({ message: 'This user has no profile' });
        }

        return res.status(200).json({ message: 'Profiles retrieved successfully', profiles });
    } catch (err) {
        console.error('Error retrieving profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { username, age, bio, profilePic } = req.body;
    try {
        const profile = await Profile.findByIdAndUpdate(id, { username, age, bio, profilePic }, { new: true });
        console.log('Updated profile:', profile);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return res.status(200).json({ message: 'Profile updated successfully', profile });
}
    catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
// Get Friends List
const getFriendsList = async (req, res) => {
    const { profilId } = req.params;
    try {
        const profile = await Profile.findById(profilId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const friendsList = profile.friendsList.map(element => element);
        console.log('Friends list:', friendsList);
        return res.status(200).json({ message: 'Friends list retrieved successfully', friendsList });
    } catch (err) {
        console.error('Error retrieving friends list:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Search Profiles
const searchProfiles = async (req, res) => {
    const { query } = req.query;
    try {
        const profiles = await Profile.find({ username: new RegExp(query, 'i') });
        console.log('profiles:', profiles)
        return res.status(200).json(profiles);
    } catch (err) {
        console.error('Error searching profiles:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    createProfile,
    viewProfile,
    updateProfile,
    getFriendsList,
    searchProfiles
};
