import { useState, useEffect } from "react";
import {
  CompanyContainer,
  CardContainer,
  FileSpan,
  UploadBtn,
  SubmitCon,
  FileLabel,
  SubmitResumeCon,
  JobPosition,
  FileCon,
  DisplayResume,
} from "./Css.style";
import {
  JoblistContainer,
  JoblistContentCon,
  TextSpan,
  JobListDesignCon,
  TextSpanDes,
} from "./Mainpage.style";
import {
  DescriptionJobs,
  SubmitBtn,
  InputBtn,
  DescriptionContainer,
  UlText,
  LiText,
  LiContainer,
  SubmitBtnContainer,
} from "./Css2.style";
import styled from "styled-components";
import { ChatBotContainer, Input, Btn, ChatBotContent } from "./Chatbot.style";

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  height: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

// Search Input Styles
const SearchContainer = styled.div`
  display: flex;
  justify-content: start;
  width: 600px;
  position: sticky;
  height: 50px;
  position: fixed;
  z-index: 20;
  padding: 10px 21px;
  background-color: #edeef0ff;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
`;

function Dashboard() {
  const [resume, setResume] = useState({});
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [jobPositions, setJobPositions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [chatbotQuestions, setChatbotQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatbotCompleted, setChatbotCompleted] = useState(false);
  const [sessionId] = useState("session_" + Math.random().toString(36).substr(2, 9));
  const [searchQuery, setSearchQuery] = useState("");

  // INITIAL LOAD
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
      fetchAllResumes(email);
    }
    fetchJobPositions();
  }, []);

  // Fetch chatbot questions when modal opens
  useEffect(() => {
    if (isModalOpen && selectedJob) {
      fetchChatbotQuestions(selectedJob.jobPosition);
    }
  }, [isModalOpen, selectedJob]);

  // UTIL: DATE FORMATTER
  const formatRelativeTime = (dateString) => {
    try {
      if (!dateString) return "No date";
      const parsed = new Date(dateString);
      if (isNaN(parsed)) return "Invalid date";
      const diffMs = new Date() - parsed;
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (seconds < 60) return `${seconds}s ago`;
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 30) return `${days}d ago`;
      return parsed.toLocaleDateString();
    } catch (err) {
      console.error("Date parse error:", err);
      return "Unknown";
    }
  };

  // FETCH JOB POSITIONS
  const fetchJobPositions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/JobCon/JobCon/src/API/getJobs.php");
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from getJobs:", text);
        setMessage((prev) => ({
          ...prev,
          global: "Server error: Invalid response from getJobs",
        }));
        return;
      }
      if (data.success && Array.isArray(data.jobs)) {
        setJobPositions(data.jobs);
        setSelectedJob(data.jobs[0] || null);
      } else {
        setMessage((prev) => ({ ...prev, global: data.message || "No job positions found" }));
      }
    } catch (error) {
      console.error("Network error fetching jobs:", error);
      setMessage((prev) => ({
        ...prev,
        global: "Network error: Could not load job positions",
      }));
    } finally {
      setLoading(false);
    }
  };

  // FETCH USER RESUMES
  const fetchAllResumes = async (email) => {
    try {
      const res = await fetch(
        `http://localhost/JobCon/JobCon/src/API/getAllResumes.php?email=${encodeURIComponent(email)}`
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from getAllResumes:", text);
        setMessage((prev) => ({
          ...prev,
          global: "Server error: Invalid response from getAllResumes",
        }));
        return;
      }
      if (data.success && Array.isArray(data.jobs)) {
        const latestJobs = processLatestJobs(data.jobs);
        setJobs(latestJobs);
      } else {
        setMessage((prev) => ({ ...prev, global: data.message || "No resumes found" }));
      }
    } catch (error) {
      console.error("Network error fetching resumes:", error);
      setMessage((prev) => ({
        ...prev,
        global: "Network error: Could not load resumes",
      }));
    }
  };

  // SELECT MOST RECENT RESUME PER JOB
  const processLatestJobs = (jobsArray) => {
    const latest = {};
    jobsArray.forEach((job) => {
      if (!latest[job.jobPosition] || new Date(job.uploadDate) > new Date(latest[job.jobPosition].uploadDate)) {
        latest[job.jobPosition] = job;
      }
    });
    return Object.values(latest);
  };

  // HANDLE FILE SELECTION
  const handleFileChange = (position) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume((prev) => ({ ...prev, [position]: file }));
      setMessage((prev) => ({ ...prev, [position]: "" }));
    }
  };

  // HANDLE RESUME UPLOAD
  const handleUpload = (position) => async (e) => {
    e.preventDefault();
    if (!resume[position]) {
      setMessage((prev) => ({ ...prev, [position]: "Please select a file first" }));
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume[position]);
    formData.append("email", userEmail);
    formData.append("jobPosition", position);

    setMessage((prev) => ({ ...prev, [position]: "Uploading..." }));

    try {
      const res = await fetch("http://localhost/JobCon/JobCon/src/API/resume.php", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from resume.php:", text);
        setMessage((prev) => ({
          ...prev,
          [position]: "Server error: Invalid response from resume.php",
        }));
        return;
      }
      if (data.success) {
        setMessage((prev) => ({ ...prev, [position]: data.message || "Upload successful!" }));
        setModalMessage(data.message || "Your resume has been successfully submitted!");
        setIsModalOpen(true);
        if (data.newJob) {
          setJobs((prev) => processLatestJobs([...prev, data.newJob]));
        }
        setResume((prev) => ({ ...prev, [position]: null }));
        const inputEl = document.getElementById(
          `file-upload-${jobPositions.findIndex((j) => j.jobPosition === position)}`
        );
        if (inputEl) inputEl.value = "";
      } else {
        setMessage((prev) => ({
          ...prev,
          [position]: data.message || "Upload failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage((prev) => ({
        ...prev,
        [position]: "Network error: Unable to connect to server",
      }));
    }
  };

  // FETCH CHATBOT QUESTIONS
  const fetchChatbotQuestions = async (jobPosition) => {
    try {
      const res = await fetch(
        `http://localhost/JobCon/JobCon/src/API/getChatbotQuestions.php?jobPosition=${encodeURIComponent(jobPosition)}`
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from getChatbotQuestions:", text);
        setChatMessages([{ type: "bot", message: "Server error: Invalid response from getChatbotQuestions" }]);
        setChatbotCompleted(true);
        return;
      }
      console.log("Fetched questions:", data);
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const questions = data.questions.filter((q) => q && q.trim()).map((q, index) => ({ id: index + 1, text: q }));
        setChatbotQuestions(questions);
        console.log("Mapped questions:", questions, "Length:", questions.length);
        setChatMessages([{ type: "bot", message: "Hi! Let's start the screening for this position. Ready?" }]);
        setCurrentQuestionIndex(0);
        setChatbotCompleted(false);
      } else {
        console.log("No valid questions found for jobPosition:", jobPosition);
        setChatMessages([{ type: "bot", message: "No screening questions available for this position. Please proceed." }]);
        setChatbotQuestions([]);
        setChatbotCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching chatbot questions:", error);
      setChatMessages([{ type: "bot", message: "Error loading questions. Please try again." }]);
      setChatbotQuestions([]);
      setChatbotCompleted(true);
    }
  };

  // HANDLE CHATBOT ANSWER SUBMISSION
  const handleChatbotAnswer = async () => {
    if (!userAnswer.trim() || isChatLoading) return;
    setChatMessages((prev) => [...prev, { type: "user", message: userAnswer }]);
    setIsChatLoading(true);
    console.log("Submitting answer:", userAnswer, "Current index:", currentQuestionIndex, "Questions available:", chatbotQuestions);

    // Handle greeting response
    if (currentQuestionIndex === 0 && chatMessages.length === 1) {
      console.log("Processing greeting response");
      setTimeout(() => {
        if (chatbotQuestions.length > 0) {
          setChatMessages((prev) => [
            ...prev,
            { type: "bot", message: chatbotQuestions[0].text },
          ]);
          setCurrentQuestionIndex(1);
        } else {
          setChatMessages((prev) => [
            ...prev,
            { type: "bot", message: "No screening questions available for this position. Please proceed." },
          ]);
          setChatbotCompleted(true);
        }
        setUserAnswer("");
        setIsChatLoading(false);
      }, 1000);
      return;
    }

    // Validate question index
    const questionIndex = currentQuestionIndex - 1;
    if (!chatbotQuestions[questionIndex]) {
      console.error("Invalid question index:", questionIndex, "Questions:", chatbotQuestions);
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", message: "Error: Invalid question index. Please try again." },
      ]);
      setChatbotCompleted(true);
      setIsChatLoading(false);
      setUserAnswer("");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("questionId", chatbotQuestions[questionIndex].id);
      formData.append("answer", userAnswer);
      formData.append("jobPosition", selectedJob?.jobPosition || "");
      formData.append("userEmail", userEmail);
      console.log("Sending to saveChatbotResponse:", {
        sessionId,
        questionId: chatbotQuestions[questionIndex].id,
        answer: userAnswer,
        jobPosition: selectedJob?.jobPosition,
        userEmail,
      });

      const response = await fetch("http://localhost/JobCon/JobCon/src/API/saveChatbotResponse.php", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from saveChatbotResponse:", text);
        setChatMessages((prev) => [
          ...prev,
          { type: "bot", message: `Server error: Failed to process response (${text})` },
        ]);
        setIsChatLoading(false);
        return;
      }
      console.log("Save response:", responseData);
      if (!responseData.success) {
        setChatMessages((prev) => [
          ...prev,
          { type: "bot", message: responseData.message || "Error saving response" },
        ]);
        setIsChatLoading(false);
        return;
      }

      setTimeout(() => {
        console.log("Next index:", currentQuestionIndex, "Total questions:", chatbotQuestions.length);
        if (currentQuestionIndex < chatbotQuestions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setChatMessages((prev) => [
            ...prev,
            { type: "bot", message: chatbotQuestions[currentQuestionIndex].text },
          ]);
        } else {
          setChatMessages((prev) => [
            ...prev,
            { type: "bot", message: "Thank you! Your screening is complete. We'll review your responses." },
          ]);
          setChatbotCompleted(true);
        }
        setUserAnswer("");
        setIsChatLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving response:", error);
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", message: "Network error: Unable to connect to server" },
      ]);
      setIsChatLoading(false);
    }
  };

  // HANDLE ENTER KEY PRESS
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (e.g., adding a newline)
      handleChatbotAnswer();
    }
  };

  // CARD CLICK HANDLER
  const handleCardClick = (job) => {
    setSelectedJob(job);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
    setChatMessages([]);
    setUserAnswer("");
    setCurrentQuestionIndex(0);
    setChatbotQuestions([]);
    setChatbotCompleted(false);
  };

  // Filter jobs based on search query
  const filteredJobs = jobPositions.filter((job) =>
    searchQuery
      ? job.jobPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // RENDER
  return (
    <>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      <CompanyContainer>
        {loading && <FileSpan>Loading job positions...</FileSpan>}
        {!loading && filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <CardContainer key={job.id || index} onClick={() => handleCardClick(job)}>
              <JoblistContainer>
                <JoblistContentCon $bgcolor="#2c3d43">
                  <TextSpan $textColor="#f8f5f5" $size="18px">
                    {job.jobPosition || "No Job Title"}
                  </TextSpan>
                </JoblistContentCon>
              </JoblistContainer>
              <JoblistContainer>
                <JoblistContentCon $justify="start">
                  <TextSpan $size="12px" $weight="500">
                    {job.jobDescription || "No description provided."}
                  </TextSpan>
                </JoblistContentCon>
              </JoblistContainer>
              <JoblistContainer>
                <JoblistContentCon>
                  {job.type && (
                    <JobListDesignCon>
                      <TextSpan>{job.type}</TextSpan>
                    </JobListDesignCon>
                  )}
                  {job.experience && (
                    <JobListDesignCon>
                      <TextSpan>{job.experience}</TextSpan>
                    </JobListDesignCon>
                  )}
                  {job.education && (
                    <JobListDesignCon>
                      <TextSpan>{job.education}</TextSpan>
                    </JobListDesignCon>
                  )}
                  {job.salary && (
                    <JobListDesignCon>
                      <TextSpan>{job.salary}</TextSpan>
                    </JobListDesignCon>
                  )}
                </JoblistContentCon>
              </JoblistContainer>
              <JoblistContainer $border="1px solid #3a3232ff">
                <JoblistContentCon>
                  <JobListDesignCon $border="none" $bgcolor="white">
                    {job.location && (
                      <TextSpan>
                        <i className="fa-solid fa-location-dot"></i> {job.location}
                      </TextSpan>
                    )}
                  </JobListDesignCon>
                </JoblistContentCon>
                <JoblistContentCon $justify="end">
                  {job.postedDate && (
                    <TextSpan>Posted: {formatRelativeTime(job.postedDate)}</TextSpan>
                  )}
                </JoblistContentCon>
              </JoblistContainer>
            </CardContainer>
          ))
        ) : (
          !loading && <FileSpan>No job positions match your search.</FileSpan>
        )}
        {message.global && <FileSpan>{message.global}</FileSpan>}
      </CompanyContainer>

      {selectedJob && (
        <DescriptionJobs>
          <DescriptionContainer>
            <TextSpan $size="23px">{selectedJob.jobPosition}</TextSpan>
          </DescriptionContainer>
          <DescriptionContainer>
            <TextSpan $size="14px">{selectedJob.jobDescription}</TextSpan>
          </DescriptionContainer>
          {selectedJob.descriptionBullets && (() => {
            try {
              const bullets = JSON.parse(selectedJob.descriptionBullets);
              return (
                bullets.length > 0 && (
                  <DescriptionContainer>
                    <TextSpan $size="17px">Qualifications</TextSpan>
                    <UlText className="list-disc pl-5">
                      {bullets.map((b, i) => (
                        <LiContainer key={i}>
                          <LiText>{b}</LiText>
                        </LiContainer>
                      ))}
                    </UlText>
                  </DescriptionContainer>
                )
              );
            } catch {
              return null;
            }
          })()}
          {selectedJob.requirementsBullets && (() => {
            try {
              const bullets = JSON.parse(selectedJob.requirementsBullets);
              return (
                bullets.length > 0 && (
                  <DescriptionContainer>
                    <TextSpan $size="17px" $textColor="#312f2f">
                      Key Responsibilities
                    </TextSpan>
                    <UlText className="list-disc pl-5">
                      {bullets.map((b, i) => (
                        <LiContainer key={i}>
                          <LiText>{b}</LiText>
                        </LiContainer>
                      ))}
                    </UlText>
                  </DescriptionContainer>
                )
              );
            } catch {
              return null;
            }
          })()}
          <DescriptionContainer>
            <TextSpan $size="17px">Details</TextSpan>
            <LiContainer>
              <TextSpan>{selectedJob.type || "Full-time · Permanent"}</TextSpan>
            </LiContainer>
            <LiContainer>
              <TextSpan>{selectedJob.salary || "$90,000–$110,000/year"}</TextSpan>
            </LiContainer>
            <LiContainer>
              <TextSpan>
                <i className="fa-solid fa-location-dot"></i>{" "}
                {selectedJob.location || "Remote (US-based)"}
              </TextSpan>
            </LiContainer>
            <LiContainer $justify="end" $bgcolor="#ffffff">
              <TextSpan>Posted: {formatRelativeTime(selectedJob.postedDate)}</TextSpan>
            </LiContainer>
          </DescriptionContainer>
          <DescriptionContainer>
            <SubmitBtnContainer>
              <InputBtn
                id={`file-upload-${jobPositions.findIndex(
                  (j) => j.jobPosition === selectedJob.jobPosition
                )}`}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onChange={handleFileChange(selectedJob.jobPosition)}
              />
              <SubmitBtn onClick={handleUpload(selectedJob.jobPosition)}>
                Submit
              </SubmitBtn>
            </SubmitBtnContainer>
            {message[selectedJob.jobPosition] && (
              <TextSpan>{message[selectedJob.jobPosition]}</TextSpan>
            )}
          </DescriptionContainer>
        </DescriptionJobs>
      )}

      {isModalOpen && (
        <ModalOverlay >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ChatBotContainer style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px"
            }}>
              <TextSpan $size="18px" style={{ margin: "20px 0 10px 0" }}>
                Screening Questions for {selectedJob?.jobPosition} <TextSpan onClick={closeModal}>X</TextSpan>
              </TextSpan>
            </ChatBotContainer>
            <ChatBotContainer
              $height="400px"
              style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              {chatMessages.map((msg, index) => (
                <ChatBotContent
                  key={index}
                  style={{
                    marginBottom: "15px",
                    textAlign: msg.type === "user" ? "right" : "left",
                    width: "99%"
                  }}
                >
                  <ChatBotContent
                    style={{
                      display: "inline-block",
                      background: msg.type === "user" ? "#3e93ed" : "#e1e3e4",
                      color: msg.type === "user" ? "white" : "black",
                      padding: "10px 15px",
                      borderRadius: "18px",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.message}
                  </ChatBotContent>
                </ChatBotContent>
              ))}
              {isChatLoading && (
                <div style={{ textAlign: "center", color: "#666" }}>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </div>
              )}
            </ChatBotContainer>
            <ChatBotContainer style={{ display: "flex", gap: "10px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={chatbotCompleted || isChatLoading}
              />
              <Btn
                onClick={chatbotCompleted ? closeModal : handleChatbotAnswer}
                disabled={!userAnswer.trim() || isChatLoading || chatbotCompleted}
              >
                {chatbotCompleted ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-paper-plane"></i>
                )}
              </Btn>
            </ChatBotContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default Dashboard;