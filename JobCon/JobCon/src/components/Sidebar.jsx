import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AsideContainer, ProfileContainer, SidebarNav, NavContainer, SidebarLink, SpanText2, Icon, ProfileImg, ProfileImgCon, ProfileNameCon, ProfileName } from './Css.style';
import profile from '../assets/profile1.jpg';

function Sidebar() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const storedFirstname = localStorage.getItem('firstname');
    const storedLastname = localStorage.getItem('lastname');
    const storedAvatar = localStorage.getItem('avatar');
    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId on mount:', storedUserId);
    console.log('Stored avatar on mount:', storedAvatar);
    if (storedFirstname && storedLastname) {
      setFirstname(storedFirstname);
      setLastname(storedLastname);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost/JobCon/JobCon/src/api/users.php?id=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Fetch avatar response:', data);
          if (data.success && data.user && data.user.avatar) {
            const avatarUrl = `http://localhost/JobCon/JobCon/src/api/${data.user.avatar}`;
            setAvatar(avatarUrl);
            localStorage.setItem('avatar', avatarUrl);
          } else {
            setAvatar('');
            localStorage.removeItem('avatar');
          }
        })
        .catch(err => {
          console.error('Error fetching avatar:', err);
          setAvatar('');
        });
    }
  }, []);

  return (
    <AsideContainer $width="230px">
      <ProfileContainer>
        <ProfileImgCon>
          <ProfileImg src={avatar || profile} alt="Profile" />
          
        </ProfileImgCon>
        <ProfileNameCon>
          <ProfileName>{firstname && lastname ? `${firstname} ${lastname}` : 'Guest'}</ProfileName>
        </ProfileNameCon>
      </ProfileContainer>

      <NavContainer>
        <SidebarNav>
          <SidebarLink to="/profile">
            <Icon className="fa-solid fa-user"></Icon>
            <SpanText2>My Profile</SpanText2>
          </SidebarLink>
          <SidebarLink to="/">
            <Icon className="fa-solid fa-laptop"></Icon>
            <SpanText2>Jobs</SpanText2>
          </SidebarLink>
          <SidebarLink to="/myselection">
            <Icon className="fa-solid fa-floppy-disk"></Icon>
            <SpanText2>My Selection</SpanText2>
          </SidebarLink>
        </SidebarNav>
      </NavContainer>
    </AsideContainer>
  );
}

export default Sidebar;