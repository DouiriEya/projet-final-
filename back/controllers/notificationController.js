const Notifications = require('../models/notification');
const User = require('../models/user');
// bch naaml fc for the user to see all his notifications 
const getNotifications = async (req, res) => {
    const { userId } = req.query;
    try {
        const notif = await Notifications.find({ userId });// hne notif li howa l result mtee l query is an array 
        if (!notif) { return res.status(404).json({ message: 'no notifications for you yet ' }) };
        console.log(notif);
     await Notifications.updateMany({ userId, seen: false }, { $set: { seen: true } });

        console.log(notif);
       
        return res.status(200).json({ message: 'here are your notifications',notif});
    }
    catch (err) {
        return res.status(500).json({ message: 'error server' });
    }
};
module.exports = { getNotifications };

