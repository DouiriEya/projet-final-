import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogInForm.css'; // Reuse the same CSS
import { FaUser, FaLock, FaPhone, FaAddressCard, FaCalendarAlt, FaEnvelope, FaIdCard } from "react-icons/fa";
import StyledAlert from '../Alert/StyledAlert';
import './RegisterForm.css';
const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        familyName: '',
        phoneNumber: '',
        CIN: '',
        address: '',
        birthDate: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/registerUser', { ...formData });
            console.log('response:', response);
            console.log('el wezza:', response.data.newUser);
            const userId = response.data.newUser._id;
            console.log('userId:', userId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('token', response.data.token);
          
            navigate(`/profileForm/${userId}`);
          
          
            setError('');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className='input-box'>
                    <input
                        type='text'
                        name='username'
                        placeholder='Enter your username'
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='text'
                        name='familyName'
                        placeholder='Enter your family name'
                        value={formData.familyName}
                        onChange={handleChange}
                    />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='text'
                        name='phoneNumber'
                        placeholder='Enter your phone number'
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    <FaPhone className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='text'
                        name='CIN'
                        placeholder='Enter your CIN'
                        value={formData.CIN}
                        onChange={handleChange}
                    />
                    <FaIdCard className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='text'
                        name='address'
                        placeholder='Enter your address'
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <FaAddressCard className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='date'
                        name='birthDate'
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                    <FaCalendarAlt className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='email'
                        name='email'
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <FaEnvelope className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <FaLock className='icon' />
                </div>
                <button type='submit'>Register</button>
                {error && <p className="error-message">{error}</p>}
                <StyledAlert message={error} onClose={() => setError('')} />

                <div className='register-link'>
                    <p>Already have an account? <a href="/">Log In</a></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
