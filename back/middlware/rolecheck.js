//middlware to check the user s role 
module.exports = function (req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}



