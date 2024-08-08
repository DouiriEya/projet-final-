import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegisterForm from './components/Forms/RegisterForm.js';
import ProfileForm from './components/Forms/ProfileForm.js';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Home from './pages/Home';
import ProfileSearch from './components/SearchBarResults/ProfileBar/ProfileSearch.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileIcon from './components/ProfileIcon/ProfileIcon.js';
import PostSearchBar from './components/SearchBars/PostSearchBar.js';
import SubmitComplaint from './components/Complaint/SubmitCompalint.js';
import Carpool from './pages/Carpool.js';
import AboutUs from './pages/AboutUs.js';


export default function App() {
  return (
    <div className='App'>
   
   <ToastContainer />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profileForm/:userId" element={<ProfileForm />} />
        <Route path="/Feed" element={<Feed />} />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/searchprofile" element={<ProfileSearch />} /> 
        <Route path='/carpoolSearch' element={<Carpool/>}/>
        <Route path='/aboutUs' element={<AboutUs/>}/>
        <Route path="/submit-complaint" element={<SubmitComplaint/>} />
      </Routes>
      
    </div>
  );
}
