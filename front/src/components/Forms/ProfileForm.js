import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import StyledAlert from '../Alert/StyledAlert';
import styled from 'styled-components';

const ProfileFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 50px auto;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    resize: vertical;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const ProfileForm = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [profileData, setProfileData] = useState({
        username: '',
        age: '',
        bio: '',
        profilePic: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:3000/api/profiles/createProfile/${userId}`, profileData);
            setSuccess(response.data.message);
            const profileId = response.data.newProfile._id;

            localStorage.setItem('profileId', profileId);
            localStorage.setItem('data', JSON.stringify(response.data.newProfile));
            if (token && response.data.newProfile) {
                navigate('/');
            }
            setError('');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
            console.error(err);
        }
    };

    const handleCloseAlert = () => {
        setError('');
        setSuccess('');
    };

    return (
        <ProfileFormContainer>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="username">Username:</Label>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        value={profileData.username}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="age">Age:</Label>
                    <Input
                        type="number"
                        name="age"
                        id="age"
                        placeholder="Enter your age"
                        value={profileData.age}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="bio">Bio:</Label>
                    <TextArea
                        name="bio"
                        id="bio"
                        placeholder="Enter your bio"
                        value={profileData.bio}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="profilePic">Profile Picture URL:</Label>
                    <Input
                        type="text"
                        name="profilePic"
                        id="profilePic"
                        placeholder="Profile Picture URL"
                        value={profileData.profilePic}
                        onChange={handleChange}
                    />
                </FormGroup>
                <Button type="submit">Create Profile</Button>
            </form>
            {error && <StyledAlert message={error} onClose={handleCloseAlert} />}
            {success && <StyledAlert message={success} onClose={handleCloseAlert} />}
        </ProfileFormContainer>
    );
};

export default ProfileForm;
