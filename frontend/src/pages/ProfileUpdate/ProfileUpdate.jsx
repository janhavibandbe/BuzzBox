import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { ArrowBigLeft } from 'lucide-react';
import {useAuthStore} from '../../store/useAuthStore';
import toast from 'react-hot-toast';

function ProfileUpdate() {
  const { getProfile, updateProfile, authUser } = useAuthStore();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async() => {
    await getProfile();
    setName(authUser.fullName);
    setImage(authUser.profilePic);
  }

  const handleScheduledImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!name && !image){
      toast.error("Noting to update");
      return;
    }

    try {
      await updateProfile ({
        fullName: name,
        profilePic: image,
      });
    } catch (error) {
      console.error("Failed to update profile: ", error);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <button className="back-button" onClick={() => navigate('/chat')}>
          <ArrowBigLeft size={28} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Profile Details</h3>
          </div>

          <label htmlFor="avatar" className="profile-label">
            <div className="image-upload">
              <input
                type="file"
                id="avatar"
                hidden
                accept="image/*"
                onChange={handleScheduledImageChange}
              />
              <img
                src={image ? image : assets.avatar_icon}
                alt="Profile"
                className="profile-pic-large"
              />
            </div>
            Upload Profile Image
          </label>

          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="profile-input"
            />
          </div>

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdate;
