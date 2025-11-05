import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, DataContent, Form } from './Profile.style';
import { TextLabel } from './Mainpage.style';
import { AddBtn } from './Css2.style';

function ProfileUpload() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userId = localStorage.getItem('userId');
    console.log('Submitting with userId:', userId);
    if (!userId || isNaN(parseInt(userId))) {
      setError('User not authenticated or invalid userId. Please log in again.');
      navigate('/login');
      return;
    }
    if (!avatarFile) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('avatar', avatarFile);
    console.log('FormData userId:', formData.get('userId'));

    try {
      const response = await fetch('http://localhost/JobCon/JobCon/src/api/updateUserPP.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.success) {
        const newAvatar = data.avatar;
        setAvatar(newAvatar);
        localStorage.setItem('avatar', newAvatar);
        setSuccess('Avatar updated successfully!');
        setAvatarFile(null);
        setTimeout(() => navigate('/profile'), 2000); // Redirect to profile page after success
      } else {
        setError(data.message || 'Failed to update avatar.');
      }
    } catch (err) {
      setError('Error updating avatar: ' + err.message);
    }
  };

  return (
  
    

       
        <Form onSubmit={handleSubmit} id="avatar-upload-form">
         
            
              <TextLabel  $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Upload Profile</TextLabel>
              <DataContent>
              <Input $mar="15px"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
              />
                 
          {avatarFile && (
            <AddBtn type="submit" form="avatar-upload-form" className="save-button">
              Save
            </AddBtn>
          )}
              </DataContent>
          
     
       
        </Form>
   
  );
}

export default ProfileUpload;