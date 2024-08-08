const jwt = require('jsonwebtoken');
const user = require('../models/user');
const profile = require('../models/profil');
const bcrypt = require('bcrypt');

// Register function
const register = async (req, res) => {
    const { username, familyName, phoneNumber, CIN, address, birthDate, email, password } = req.body;
    try {
        const userdeja = await user.findOne({ email });
        if (userdeja) return res.status(400).json({ message: 'Email already used!' });

        let role = 'customer';
        if (email === 'douiri@admin.com') role = 'admin';

        let hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            username,
            familyName,
            phoneNumber,
            address,
            CIN,
            birthDate,
            email,
            password: hashedPassword,
            role,
            verified: true
        });

        // const payload = { id: newUser._id };
        // const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1d' }); 
        // console.log('token:',token);
        // newUser.token = token;
         await newUser.save();

        res.status(201).json({ message: 'User added to the database!', newUser });
    } catch (err) {
        console.error('Error registering user:', err);
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        var userdeja = await user.findOne({ email });
        if (!userdeja) return res.status(404).json({ message: 'User not found!' });
        console.log('userdeja:', userdeja);

        const passValid = await bcrypt.compare(password, userdeja.password);
        if (!passValid) return res.status(400).json({ message: 'Wrong credentials!' });

        const token = jwt.sign({ id: userdeja._id }, 'your-secret-key', { expiresIn: '1d' }); 
        console.log(token);
       

        return res.status(200).json({ message: 'Logged in successfully!', userdeja , token});
    } catch (err) {
        console.error('Error logging in:', err);
    }
};

// Logout function
const logout = async (req, res) => {
    const { userId } = req.params;
    try {
        return res.status(201).json({ message: 'Successfully logged out!' });
    } catch (err) {
        console.error('Error logging out:', err);
    }
};

// Delete account function
const deleteAcc = async (req, res) => {
    const { userId } = req.params;
    try {
        const todelete = await user.findByIdAndDelete(userId);
        const todeleteprofile = await profile.findOneAndDelete({ userId });

        if (!todelete) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ message: 'User and profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, logout, deleteAcc };
