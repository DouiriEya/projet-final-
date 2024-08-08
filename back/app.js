const express = require('express');
const cors = require('cors');
//we required the routes mte3 l profiles hne
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes') ;
const rideRequestRoutes = require('./routes/rideRequestRoutes');
const friendRequestRoutes = require('./routes/friendRequestRoutes') ;
const notificationRoutes = require('./routes/notificationRoutes') ;
const ratingRoutes = require('./routes/ratingRoutes');
const app = express(); // ncreatiw instance ml express
const PORT = 3000;

//to connect to the database
const run = require('./config/db');
run();

const corsOptions = {
    origin: 'http://localhost:3001', // Ensure this matches your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  app.use(cors(corsOptions));

  app.options('*', cors()); // Enable pre-flight requests for all routes

  


app.use(express.json());
app.use('/api/profiles', profileRoutes);

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes) ;
app.use('/api/rideRequests',rideRequestRoutes) ;

app.use('/api/friendRequests',friendRequestRoutes);
app.use('/api/notification',notificationRoutes) ;

app.use('/api/ratings',ratingRoutes) ;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



