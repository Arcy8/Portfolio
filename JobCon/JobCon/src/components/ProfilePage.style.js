import styled from "styled-components";
import { CompanyContainer as BaseContainer } from "./Css.style";

export const ProfileContainer = styled(BaseContainer)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

export const ProfileHeader = styled.div`
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const ProfileSubtitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 20px 0;
  opacity: 0.95;
  font-weight: 400;
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  font-size: 1rem;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  i {
    width: 16px;
  }
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
`;

export const ProfileSection = styled.div`
  h3 {
    font-size: 1.5rem;
    margin: 0 0 25px 0;
    color: #2c3d43;
    font-weight: 600;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }
`;

export const ProfileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ProfileItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

export const ProfileBullet = styled.li`
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  line-height: 1.6;
  color: #555;
  &::before {
    content: "▸";
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: bold;
  }
`;

export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 20px;
`;

export const SkillTag = styled.div`
  padding: 12px 20px;
  background: ${props => 
    props.$level === 'Expert' ? '#667eea' : 
    props.$level === 'Advanced' ? '#764ba2' : 
    '#e1e3e4'
  };
  color: ${props => props.$level ? 'white' : '#333'};
  border-radius: 25px;
  font-weight: 500;
  text-align: center;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const ExperienceTimeline = styled.div`
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    strong {
      color: #2c3d43;
      font-size: 1.1rem;
    }
    span {
      color: #666;
      font-size: 0.95rem;
    }
  }
  .timeline-date {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 15px;
    font-weight: 500;
  }
`;

export const TimelineItem = styled.div`
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 1.2rem;
  color: #666;
  i {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #667eea;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 1.2rem;
  color: #e74c3c;
  i {
    font-size: 3rem;
    margin-bottom: 20px;
  }
`;