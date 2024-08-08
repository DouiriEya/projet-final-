import React , {useState , useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';


function UpdateForm() {
   const [profileData, setProfileData] = useState({
        username: '',
        age: '',
        bio: '',
        profilePic:''
   })
   const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { profileId } = useParams();
    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        console.log('token',token)
        try {
              //update the profile
        const  response = await axios.put(`http://localhost:3000/api/profiles/${profileId}`, profileData);
            setSuccess(response.data.message);
            console.log('response:', response);
        

            
                navigate('/profile/:userId');
        
           
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={profileData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            value={profileData.age}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={profileData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            id="profilePic"
            value={profileData.profilePic}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>


      </form>
    </div>
  )
}

export default UpdateForm
