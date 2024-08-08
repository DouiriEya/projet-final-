import React, { useState } from 'react';
import axios from 'axios';
import './Posting.css';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { FaCar, FaMoneyBillAlt, FaCreditCard, FaMapPin, FaCalendarAlt, FaClock } from 'react-icons/fa';

function Posting() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('data.profiles.username');
    const [data, setData] = useState({
        vehicule: '',
        pricePerSeat: '',
        paymentMethod: 'cash',
        rib: '',
        startlocation: '',
        destination: '',
        time: '',
        date: '',
        seats: '',
        signature: username,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentMethodChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            paymentMethod: value,
            rib: value === 'transfert bancaire' ? data.rib : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        if (!token) {
            navigate('/login');
            return;
        }
    
        if (data.seats < 1) {
            setError('Please enter a valid number of seats');
            return;
        }
    
        try {
            const res = await axios.post(`http://localhost:3000/api/posts/createPost/${userId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Post created successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            console.log('Post created successfully:', res);
            setData({
                vehicule: '',
                pricePerSeat: '',
                paymentMethod: 'cash',
                rib: '',
                startlocation: '',
                destination: '',
                time: '',
                date: '',
                seats: '',
                signature: username || '',
            });
            setError('');
            navigate('/feed');
        } catch (error) {
            console.error('Error creating post:', error);
    
            // Extract error message from the response or default message
            const errorMessage = error.response?.data?.message || "An error occurred you can't post same post twice";
            console.log('Error message:', errorMessage);
    
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } 
    };

    return (
        <div className="post-form">
            <h2>Post a Ride</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <FaCar className="form-icon" />
                    <input
                        type="text"
                        name="vehicule"
                        value={data.vehicule}
                        placeholder="Vehicle"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <FaMoneyBillAlt className="form-icon" />
                    <input
                        type="number"
                        name="pricePerSeat"
                        value={data.pricePerSeat}
                        placeholder="Price per Seat"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <FaCreditCard className="form-icon" />
                    <select
                        name="paymentMethod"
                        value={data.paymentMethod}
                        onChange={handlePaymentMethodChange}
                        required
                    >
                        <option value="cash">Cash</option>
                        <option value="transfert bancaire">Transfert Bancaire</option>
                    </select>
                </div>
                {data.paymentMethod === 'transfert bancaire' && (
                    <div className="form-group">
                        <FaCreditCard className="form-icon" />
                        <input
                            type="text"
                            name="rib"
                            value={data.rib}
                            placeholder="RIB"
                            onChange={handleChange}
                            className="rib-input"
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <FaMapPin className="form-icon" />
                    <input
                        type="text"
                        name="startlocation"
                        value={data.startlocation}
                        placeholder="Start Location"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <FaMapPin className="form-icon" />
                    <input
                        type="text"
                        name="destination"
                        value={data.destination}
                        placeholder="Destination"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <FaClock className="form-icon" />
                    <input
                        type="time"
                        name="time"
                        value={data.time}
                        placeholder="Time"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <FaCalendarAlt className="form-icon" />
                    <input
                        type="date"
                        name="date"
                        value={data.date}
                        placeholder="Date"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    < div className="form-icon" />
                    <input
                        type="number"
                        name="seats"
                        value={data.seats}
                        placeholder="Seats"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
}

export default Posting;
