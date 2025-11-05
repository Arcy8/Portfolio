import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeaderContainer,
  LogoContainer,
  LogoutContainer,
  Headernav,
  HeaderLink,
  Logo,
  LogoutProfileCon,
  LogOutProfile,
  LogOutNotifCon,
  ApplyJobCon,
  ButtonMain,
  Bell,
  LogOutProfileContent,
  LogOutProfileName,
  Span,
  LogOutContentCon,
  Icon,
  HomeBtnLink,
  SpanText,
} from './Css.style';
import profileImg from '../assets/profile1.jpg';
import logo from '../assets/JobCon.jpg';
import styled from 'styled-components';

// Styled Components for Notifications
const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => (props.open ? 'block' : 'none')};
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
  &:last-child {
    border-bottom: none;
  }
  &.today {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
    font-weight: bold;
  }
`;

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Format time to 12-hour (e.g., 6:06 PM)
  const formatTimeTo12Hour = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  };

  // Format date: "Today" or "Oct 28, 2025"
  const formatDate = (date) => {
    if (!date) return '';
    const scheduleDate = new Date(date);
    const now = new Date();
    if (scheduleDate.toDateString() === now.toDateString()) {
      return 'Today';
    }
    return scheduleDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch upcoming schedules
  const fetchSchedules = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'null') {
      setSchedules([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost/JobCon/JobCon/src/api/schedules.php?userId=${userId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.success) {
        const upcoming = (data.schedules || [])
          .map(s => ({ ...s, userId: Number(s.userId), date: s.date }))
          .filter(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setSchedules(upcoming);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    }
  };

  // Load user data + avatar + schedules
  useEffect(() => {
    const storedFirstname = localStorage.getItem("firstname");
    const storedLastname = localStorage.getItem("lastname");
    const storedEmail = localStorage.getItem("email");
    const storedAvatar = localStorage.getItem("avatar");

    if (storedFirstname && storedLastname) {
      setFirstname(storedFirstname);
      setLastname(storedLastname);
    }
    if (storedAvatar) setAvatar(storedAvatar);
    setIsLoggedIn(!!storedEmail);

    // Fetch avatar from API if userId exists
    const userId = localStorage.getItem('userId');
    if (userId && storedEmail) {
      fetch(`http://localhost/JobCon/JobCon/src/api/users.php?id=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user?.avatar) {
            const avatarUrl = `http://localhost/JobCon/JobCon/src/api/${data.user.avatar}`;
            setAvatar(avatarUrl);
            localStorage.setItem('avatar', avatarUrl);
          }
        })
        .catch(err => console.error('Avatar fetch error:', err));
    }

    // Fetch schedules if logged in
    if (storedEmail) {
      fetchSchedules();
      const interval = setInterval(fetchSchedules, 60000); // Every 60s
      return () => clearInterval(interval);
    }
  }, []);

  const dropDown = () => {
    if (isLoggedIn) {
      setOpen(!open);
      setShowNotifications(false);
    } else {
      navigate("/login");
    }
  };

  const closeDropDown = () => {
    setOpen(false);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setSchedules([]);
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const toggleNotifications = () => {
    if (isLoggedIn) {
      setShowNotifications(!showNotifications);
      setOpen(false);
    }
  };

  return (
    <>
      <HeaderContainer>
        <LogoContainer>
          <Logo src={logo} alt="JobCon Logo" />
        </LogoContainer>

        <Headernav>
          <HeaderLink to="/home">Home</HeaderLink>
          <HeaderLink to="/aboutus">About us</HeaderLink>
          <HeaderLink to="/home">Events</HeaderLink>
        </Headernav>

        <LogoutContainer>
          <ApplyJobCon>
            <HeaderLink onClick={handleClick}>
              <ButtonMain>Apply Now</ButtonMain>
            </HeaderLink>
          </ApplyJobCon>

          {/* Notification Bell */}
          <LogOutNotifCon style={{ position: 'relative' }}>
            <Bell
              className="fa-regular fa-bell"
              onClick={toggleNotifications}
              style={{
                pointerEvents: isLoggedIn ? 'auto' : 'none',
                opacity: isLoggedIn ? 1 : 0.5,
                cursor: isLoggedIn ? 'pointer' : 'default'
              }}
            />
            {schedules.length > 0 && (
              <NotificationBadge>{schedules.length}</NotificationBadge>
            )}
          </LogOutNotifCon>

          {/* Profile */}
          <LogoutProfileCon>
            <LogOutProfile
              onClick={dropDown}
              src={avatar || profileImg}
              alt="Profile"
            />
            <LogOutProfileName>
              <SpanText size="14px" color="#2c3d43">
                {firstname && lastname ? `${firstname} ${lastname}` : "Guest"}
              </SpanText>
            </LogOutProfileName>
          </LogoutProfileCon>
        </LogoutContainer>
      </HeaderContainer>

      {/* Notifications Dropdown */}
      <NotificationDropdown open={showNotifications}>
        {schedules.length > 0 ? (
          schedules.map(schedule => (
            <NotificationItem
              key={schedule.id}
              className={formatDate(schedule.date) === 'Today' ? 'today' : ''}
            >
              Interview on <strong>{formatDate(schedule.date)}</strong> ({schedule.day})
              <br />
              {formatTimeTo12Hour(schedule.start_time)} - {formatTimeTo12Hour(schedule.end_time)} ({schedule.period})
            </NotificationItem>
          ))
        ) : (
          <NotificationItem>No upcoming interviews</NotificationItem>
        )}
      </NotificationDropdown>

      {/* Profile Dropdown */}
      <LogOutProfileContent open={open}>
        <LogOutContentCon onClick={closeDropDown}>
          <Icon className="fa-solid fa-user"></Icon>
          <Span color="rgb(88, 83, 83)" $marginL="10px">Profile</Span>
        </LogOutContentCon>

        <LogOutContentCon onClick={closeDropDown}>
          <Icon className="fa-solid fa-moon"></Icon>
          <Span color="rgb(88, 83, 83)" $marginL="10px">Dark Mode</Span>
        </LogOutContentCon>

        <LogOutContentCon onClick={closeDropDown}>
          <Icon className="fa-solid fa-user-tie"></Icon>
          <HomeBtnLink to="/Applicant">
            <Span color="rgb(88, 83, 83)" $marginL="10px">Admin</Span>
          </HomeBtnLink>
        </LogOutContentCon>

        <LogOutContentCon onClick={closeDropDown}>
          <Icon className="fa-solid fa-right-from-bracket"></Icon>
          <HomeBtnLink onClick={handleLogout}>
            <Span color="rgb(88, 83, 83)" $marginL="10px">Logout</Span>
          </HomeBtnLink>
        </LogOutContentCon>
      </LogOutProfileContent>
    </>
  );
}

export default Header;