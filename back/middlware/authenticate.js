const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Replace process.env.JWT_SECRET with your secret key
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }
        req.user = user; // Attach user object to the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Please authenticate' });
    }
};

module.exports = authenticate;
