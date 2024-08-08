import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogInForm.css';
import { FaUser, FaLock } from "react-icons/fa";

function LogInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userdeja._id);
      setSuccess('Logged in successfully');
      navigate('/Feed');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <div className='input-box'>
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            value={email}
            onChange={handleChange}
          />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            value={password}
            onChange={handleChange}
          />
          <FaLock className='icon' />
        </div>
        <div className='remember-forgot'>
          <label>
            <input type='checkbox' />
            Remember me
          </label>
          <a href='#'>Forgot password?</a>
        </div>
        <button type='submit'>Log In</button>
        <div className='register-link'>
          <p>Don't have an account? <a href='/Register'>Register</a></p>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
}

export default LogInForm;
