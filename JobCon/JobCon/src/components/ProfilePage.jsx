import { useState, useEffect } from "react";
import {
  ProfileContainer,
  ProfileHeader,
  ProfileCard,
  ProfileSection,
  ProfileTitle,
  ProfileSubtitle,
  ProfileItem,
  ProfileList,
  ProfileBullet,
  SkillsGrid,
  SkillTag,
  ExperienceTimeline,
  TimelineItem,
  ContactInfo,
  ContactItem,
  LoadingSpinner,
  ErrorMessage,
} from "./ProfilePage.style";
import { TextSpan } from "./Mainpage.style";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
      fetchProfileData(email);
    } else {
      setError("Please log in to view your profile");
      setLoading(false);
    }
  }, []);

  const fetchProfileData = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost/JobCon/JobCon/src/API/getProfileData.php?email=${encodeURIComponent(email)}`
      );
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (data.success) {
        setProfileData(data.profile);
      } else {
        setError(data.message || "No profile data found");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingSpinner>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <div>Loading your profile...</div>
        </LoadingSpinner>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ErrorMessage>
          <i className="fa-solid fa-exclamation-triangle"></i>
          {error}
        </ErrorMessage>
      </ProfileContainer>
    );
  }

  if (!profileData) {
    return (
      <ProfileContainer>
        <ErrorMessage>No profile data available</ErrorMessage>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>{profileData.name || "Professional Profile"}</ProfileTitle>
        <ProfileSubtitle>
          {profileData.profession || "Qualified Professional"} |{" "}
          {profileData.location || "Location"}
        </ProfileSubtitle>
        <ContactInfo>
          {profileData.email && (
            <ContactItem>
              <i className="fa-solid fa-envelope"></i>
              {profileData.email}
            </ContactItem>
          )}
          {profileData.phone && (
            <ContactItem>
              <i className="fa-solid fa-phone"></i>
              {profileData.phone}
            </ContactItem>
          )}
          {profileData.linkedin && (
            <ContactItem>
              <i className="fa-brands fa-linkedin"></i>
              <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </ContactItem>
          )}
        </ContactInfo>
      </ProfileHeader>

      {profileData.aiSummary && (
        <ProfileCard>
          <ProfileSection>
            <h3>AI-Generated Professional Summary</h3>
            <div style={{ lineHeight: "1.6", color: "#333" }}>
              {profileData.aiSummary}
            </div>
          </ProfileSection>
        </ProfileCard>
      )}

      {profileData.skills && profileData.skills.length > 0 && (
        <ProfileCard>
          <ProfileSection>
            <h3>Core Skills & Technologies</h3>
            <SkillsGrid>
              {profileData.skills.map((skill, index) => (
                <SkillTag key={index} $level={skill.level}>
                  {skill.name}
                  {skill.level && ` (${skill.level})`}
                </SkillTag>
              ))}
            </SkillsGrid>
          </ProfileSection>
        </ProfileCard>
      )}

      {profileData.experience && profileData.experience.length > 0 && (
        <ProfileCard>
          <ProfileSection>
            <h3>Professional Experience</h3>
            <ExperienceTimeline>
              {profileData.experience.map((exp, index) => (
                <TimelineItem key={index}>
                  <div className="timeline-header">
                    <strong>{exp.title}</strong>
                    <span>{exp.company}</span>
                  </div>
                  <div className="timeline-date">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                  <ProfileList>
                    {exp.responsibilities?.map((resp, i) => (
                      <ProfileBullet key={i}>{resp}</ProfileBullet>
                    ))}
                  </ProfileList>
                </TimelineItem>
              ))}
            </ExperienceTimeline>
          </ProfileSection>
        </ProfileCard>
      )}

      {profileData.education && (
        <ProfileCard>
          <ProfileSection>
            <h3>Education & Certifications</h3>
            <ProfileList>
              {profileData.education.map((edu, index) => (
                <ProfileItem key={index}>
                  <strong>{edu.degree}</strong> - {edu.institution}
                  {edu.year && ` (${edu.year})`}
                </ProfileItem>
              ))}
            </ProfileList>
          </ProfileSection>
        </ProfileCard>
      )}

      {profileData.projects && profileData.projects.length > 0 && (
        <ProfileCard>
          <ProfileSection>
            <h3>Key Projects & Achievements</h3>
            <ProfileList>
              {profileData.projects.map((project, index) => (
                <ProfileItem key={index}>
                  <strong>{project.name}</strong>: {project.description}
                </ProfileItem>
              ))}
            </ProfileList>
          </ProfileSection>
        </ProfileCard>
      )}
    </ProfileContainer>
  );
}

export default ProfilePage;