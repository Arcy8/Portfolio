import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ProfileContainer, ProfileContent, AddBtn } from '../components/Css2.style';
import { TextSpan,TextLabel} from '../components/Mainpage.style';
import { FormInput, Label, LabelInputCon, LabelInpContent } from '../components/Css.style';
import { ProfileDataContainer, DataContainer, DataContent, ProfileDataForm, Input} from '../components/Profile.style'
import UserSchedule from '../components/UserSchedule';
import ProfileUpload from '../components/ProfileUpload';



const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    userId: localStorage.getItem('userId') || '',
    firstname: localStorage.getItem('firstname') || '',
    lastname: localStorage.getItem('lastname') || '',
    email: localStorage.getItem('email') || '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    emergency_contact: '',
    birth_date: '',
    marital_status: '',
    religion: '',
    education: '',
    family: { mother: '', father: '', siblings: [] },
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);


  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not authenticated. Please log in.');
      return;
    }
    try {
      const response = await fetch(`http://localhost/JobCon/JobCon/src/api/users.php?id=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setUserData({
          ...userData,
          userId,
          firstname: data.user.firstname || userData.firstname,
          lastname: data.user.lastname || userData.lastname,
          email: data.user.email || userData.email,
          phone: data.user.pnumber || '',
          address: data.user.address || '',
          emergency_contact: data.user.emergency_contact || '',
          birth_date: data.user.birth_date || '',
          marital_status: data.user.marital_status || '',
          religion: data.user.religion || '',
          education: data.user.education || '',
          family: data.user.family ? JSON.parse(data.user.family) : { mother: '', father: '', siblings: [] },
          bio: data.user.bio || '',
        });
      } else {
        setError('Failed to load user data. Using stored data.');
      }
    } catch (err) {
      setError('Error fetching user data. Using stored data.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('family.')) {
      const field = name.split('.')[1];
      setUserData({
        ...userData,
        family: { ...userData.family, [field]: value },
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };


  const handleSiblingsChange = (e) => {
    const siblings = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setUserData({
      ...userData,
      family: { ...userData.family, siblings },
    });
  };


  const validateForm = () => {
    if (!userData.firstname || userData.firstname.length < 2) {
      setError('First name must be at least 2 characters.');
      return false;
    }
    if (!userData.lastname || userData.lastname.length < 2) {
      setError('Last name must be at least 2 characters.');
      return false;
    }
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setError('Invalid email format.');
      return false;
    }
    if (!userData.phone) {
      setError('Phone number is required.');
      return false;
    }
    if (userData.password && userData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (userData.password && userData.password !== userData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (userData.birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(userData.birth_date)) {
      setError('Invalid birth date format (YYYY-MM-DD).');
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;


    try {
      const response = await fetch('http://localhost/JobCon/JobCon/src/api/updateUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('firstname', userData.firstname);
        localStorage.setItem('lastname', userData.lastname);
        localStorage.setItem('email', userData.email);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Error updating profile.');
    }
  };


  return (
    <ProfileContent $width="650px">
      
     
      {isEditing ? (
   
        <ProfileDataForm onSubmit={handleSubmit}>
    

              <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>First Name</TextLabel>

              <DataContent>
              <Input
                width="310px"
                type="text"
                name="firstname"
                value={userData.firstname}
                onChange={handleInputChange}
                required
              />
              </DataContent>
              </DataContainer>
              
      
 
              <DataContainer>
                <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Last Name</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleInputChange}
                required
              />
              </DataContent>
              </DataContainer>
              
        
              <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Email</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
              </DataContent>
              </DataContainer>
        
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Phone Number</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
              />
              </DataContent>
              </DataContainer>
           
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Address</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>
          
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Emergency Contact</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="emergency_contact"
                value={userData.emergency_contact}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>
           
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Birth Date</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="date"
                name="birth_date"
                value={userData.birth_date}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>


            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Marital Status</TextLabel>
              <DataContent>
              <Input
                as="select"
                width="310px"
                name="marital_status"
                value={userData.marital_status}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </Input>
              </DataContent>
              </DataContainer>


            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Religion</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="religion"
                value={userData.religion}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>

              <DataContainer>
              <Label>Education</Label>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="education"
                value={userData.education}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>

            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Mother’s Name</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="family.mother"
                value={userData.family.mother}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>

            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Father’s Name</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="family.father"
                value={userData.family.father}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Siblings (comma-separated)</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="text"
                name="siblings"
                value={userData.family.siblings.join(', ')}
                onChange={handleSiblingsChange}
              />
              </DataContent>
              </DataContainer>

            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Bio</TextLabel>
              <DataContent>
              <Input
               
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                maxLength="200"
              />
              </DataContent>
              </DataContainer>
           
            <DataContainer>
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>New Password</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>

              <DataContainer>
         
              <TextLabel $size="13px" $weight="bold" style={{marginLeft:"10px"}}>Confirm Password</TextLabel>
              <DataContent>
              <Input
                width="310px"
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleInputChange}
              />
              </DataContent>
              </DataContainer>
           <DataContainer $height= "30px">
          <AddBtn type="submit">Save Changes</AddBtn>
          
          </DataContainer>

          <DataContainer $height="30px">
            <AddBtn type="button" onClick={() => setIsEditing(false)}>Cancel</AddBtn>
          </DataContainer>
        </ProfileDataForm>
     
      ) : (
        <ProfileDataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}} >First Name</TextSpan>
             <DataContent><TextSpan> {userData.firstname || 'Not set'}</TextSpan></DataContent>
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Last Name:</TextSpan> 
            <DataContent>   <TextSpan>{userData.lastname || 'Not set'}</TextSpan></DataContent>
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Email:</TextSpan> 
            <DataContent><TextSpan>{userData.email || 'Not set'}</TextSpan></DataContent>
            
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Phone:</TextSpan>
               <DataContent><TextSpan> {userData.phone || 'Not set'}</TextSpan></DataContent>
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Address:</TextSpan>
            <DataContent><TextSpan> {userData.address || 'Not set'}</TextSpan></DataContent>
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Emergency Contact:</TextSpan>
             <DataContent><TextSpan> {userData.emergency_contact || 'Not set'}</TextSpan></DataContent>
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Birth Date:</TextSpan>
            <DataContent><TextSpan> {userData.birth_date || 'Not set'}</TextSpan></DataContent>
             
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Marital Status:</TextSpan>
            <DataContent>   <TextSpan> {userData.marital_status || 'Not set'}</TextSpan></DataContent>
           
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Religion:</TextSpan>
           <DataContent> <TextSpan> {userData.religion || 'Not set'}</TextSpan></DataContent>
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Education:</TextSpan> 
            <DataContent>      <TextSpan>{userData.education || 'Not set'}</TextSpan></DataContent>
          </DataContainer>

          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Mother:</TextSpan> 
            <DataContent>    <TextSpan>{userData.family.mother || 'Not set'}</TextSpan></DataContent>
          
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Father:</TextSpan> 
            <DataContent><TextSpan>{userData.family.father || 'Not set'}</TextSpan></DataContent>
             
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Siblings:</TextSpan>
            <DataContent><TextSpan> {userData.family.siblings.length > 0 ? userData.family.siblings.join(', ') : 'Not set'}</TextSpan></DataContent>
              
          </DataContainer>
          <DataContainer>
            <TextSpan $weight="bold" style={{marginLeft:"10px"}}>Bio:</TextSpan>
            <DataContent>
               <TextSpan> {userData.bio || 'Not set'}</TextSpan>
            </DataContent>
            
         
          </DataContainer>
          

          <DataContainer>

            <ProfileUpload/>
            
          </DataContainer>
          <DataContainer $height="30px">
            <AddBtn onClick={() => setIsEditing(true)}>Edit Profile</AddBtn>
          </DataContainer>
          

         
         
          
       
          
         
         
        
          
          
        
         
        
          
        </ProfileDataContainer>
        
      )}

      
    </ProfileContent>
  );
};


export default function Profile() {
  return (
    <>
      <Sidebar />
      <Header />
      <ProfileContainer>
      <UserProfile/>

      <ProfileContent>
        <UserSchedule/>
      </ProfileContent>
        


      </ProfileContainer>
    </>
  );
}
