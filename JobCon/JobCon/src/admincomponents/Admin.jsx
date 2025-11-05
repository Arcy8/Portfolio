import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AdminSidebar from "../admincomponents/AdminSidebar";
import {
  AddJobContainer,
  AddJobContentCon,
  AddFormContainer,
  SelectForm,
  SubmitAddJob,
  JobsContentCon,
  FormContentCon,
  FormContent,
  TextArea,
  InputContent,
  AddBtn,
  UlForm,
  LiCon,
  LiContentCon,
  LiForm,
} from "../components/Css2.style";
import { TextLabel, TextSpan } from "../components/Mainpage.style";

function Admin() {
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [descriptionBullets, setDescriptionBullets] = useState([]);
  const [newDescriptionBullet, setNewDescriptionBullet] = useState("");
  const [requirementsBullets, setRequirementsBullets] = useState([]);
  const [newRequirementBullet, setNewRequirementBullet] = useState("");
  const [chatbotQuestions, setChatbotQuestions] = useState([]);
  const [newChatbotQuestion, setNewChatbotQuestion] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatRelativeTime = (dateString) => {
    try {
      const posted = new Date(dateString);
      const now = new Date();
      const diffMs = now - posted;
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
      if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
      return posted.toLocaleDateString();
    } catch (err) {
      console.error("Error parsing date:", err.message);
      return "Unknown date";
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost/JobCon/JobCon/src/API/getJobs.php");
      if (!res.ok) {
        const text = await res.text();
        console.error(`Fetch error in getJobs: Status ${res.status}, Response:`, text);
        throw new Error(`Failed to fetch jobs: Status ${res.status}`);
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from getJobs:", text);
        setMessage("Server error: Invalid response from getJobs");
        return;
      }
      if (data.success) {
        setJobs(data.jobs || []);
        setMessage("");
      } else {
        setMessage(data.message || "No jobs found");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setMessage(err.message || "Failed to load jobs");
    }
  };

  const clearForm = () => {
    setJobPosition("");
    setJobDescription("");
    setDescriptionBullets([]);
    setNewDescriptionBullet("");
    setRequirementsBullets([]);
    setNewRequirementBullet("");
    setChatbotQuestions([]);
    setNewChatbotQuestion("");
    setLocation("");
    setType("");
    setSalary("");
    setExperience("");
    setEducation("");
    setPostedDate("");
    setEditingJobId(null);
  };

  const handleAddDescriptionBullet = () => {
    if (newDescriptionBullet.trim()) {
      setDescriptionBullets([...descriptionBullets, newDescriptionBullet.trim()]);
      setNewDescriptionBullet("");
    }
  };

  const handleAddRequirementBullet = () => {
    if (newRequirementBullet.trim()) {
      setRequirementsBullets([...requirementsBullets, newRequirementBullet.trim()]);
      setNewRequirementBullet("");
    }
  };

  const handleAddChatbotQuestion = () => {
    if (newChatbotQuestion.trim()) {
      setChatbotQuestions([...chatbotQuestions, newChatbotQuestion.trim()]);
      setNewChatbotQuestion("");
    }
  };

  const handleRemoveDescriptionBullet = (index) => {
    setDescriptionBullets(descriptionBullets.filter((_, i) => i !== index));
  };

  const handleRemoveRequirementBullet = (index) => {
    setRequirementsBullets(requirementsBullets.filter((_, i) => i !== index));
  };

  const handleRemoveChatbotQuestion = (index) => {
    setChatbotQuestions(chatbotQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobPosition.trim() || !jobDescription.trim()) {
      setMessage("Please enter both a job position and description.");
      return;
    }
    if (chatbotQuestions.length === 0) {
      setMessage("Please add at least one screening question.");
      return;
    }

    const formData = new FormData();
    formData.append("jobPosition", jobPosition.trim());
    formData.append("jobDescription", jobDescription.trim());
    formData.append("descriptionBullets", JSON.stringify(descriptionBullets));
    formData.append("requirementsBullets", JSON.stringify(requirementsBullets));
    formData.append("chatbotQuestions", JSON.stringify(chatbotQuestions));
    formData.append("location", location.trim() || "Remote (US-based)");
    formData.append("type", type.trim() || "Full-time · Permanent");
    formData.append("salary", salary.trim() || "$90,000–$110,000/year");
    formData.append("experience", experience.trim() || "Not specified");
    formData.append("education", education.trim() || "Not specified");
    if (postedDate.trim()) {
      formData.append("postedDate", postedDate.trim());
    }
    if (editingJobId) {
      formData.append("id", editingJobId);
    }

    try {
      const url = editingJobId
        ? "http://localhost/JobCon/JobCon/src/API/updateJob.php"
        : "http://localhost/JobCon/JobCon/src/API/addJob.php";
      console.log("Sending form data:", Object.fromEntries(formData));
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      console.log(`Raw response from ${editingJobId ? "updateJob" : "addJob"}: Status ${res.status}, Response:`, text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(`Non-JSON response from ${editingJobId ? "updateJob" : "addJob"}:`, text);
        setMessage(`Server error: Invalid response from ${editingJobId ? "updateJob" : "addJob"}`);
        return;
      }
      if (data.success) {
        setMessage(data.message);
        clearForm();
        fetchJobs();
      } else {
        setMessage(data.message || `Failed to ${editingJobId ? "update" : "add"} job`);
      }
    } catch (err) {
      console.error(`Error in ${editingJobId ? "updateJob" : "addJob"}:`, err.message);
      setMessage(`Failed to ${editingJobId ? "update" : "add"} job: ${err.message}`);
    }
  };

  const handleEdit = (job) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setJobPosition(job.jobPosition);
    setJobDescription(job.jobDescription);
    setDescriptionBullets(job.descriptionBullets ? JSON.parse(job.descriptionBullets) : []);
    setRequirementsBullets(job.requirementsBullets ? JSON.parse(job.requirementsBullets) : []);
    setChatbotQuestions(job.chatbotQuestions ? JSON.parse(job.chatbotQuestions) : []);
    setLocation(job.location || "Remote (US-based)");
    setType(job.type || "Full-time · Permanent");
    setSalary(job.salary || "$90,000–$110,000/year");
    setExperience(job.experience || "Not specified");
    setEducation(job.education || "Not specified");
    setPostedDate(job.postedDate || "");
    setEditingJobId(job.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      const res = await fetch("http://localhost/JobCon/JobCon/src/API/deleteJob.php", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response from deleteJob:", text);
        setMessage("Server error: Invalid response from deleteJob");
        return;
      }
      if (data.success) {
        setMessage(data.message);
        fetchJobs();
      } else {
        setMessage(data.message || "Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err.message);
      setMessage("Failed to delete job: " + err.message);
    }
  };

  const handleViewResponses = (jobPosition) => {
    navigate(`/responses/${encodeURIComponent(jobPosition)}`);
  };

  const handleCancelEdit = () => {
    clearForm();
    setMessage("");
  };

  return (
    <AddJobContainer>
      <AdminSidebar />
      <AddJobContentCon>
        <TextSpan $size="20px" className="text-2xl font-bold mb-4">
          {editingJobId ? "Edit Job" : "Add New Job"}
        </TextSpan>

        <AddFormContainer onSubmit={handleSubmit}>
          <FormContentCon>
            <TextLabel>Job Description</TextLabel>
            <TextArea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Qualifications</TextLabel>
            <FormContent>
              <InputContent
                id="description-bullets"
                type="text"
                value={newDescriptionBullet}
                onChange={(e) => setNewDescriptionBullet(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter a description bullet"
              />
              <AddBtn
                type="button"
                onClick={handleAddDescriptionBullet}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </AddBtn>
            </FormContent>
            {descriptionBullets.length > 0 && (
              <UlForm>
                {descriptionBullets.map((bullet, index) => (
                  <LiCon key={index}>
                    <LiContentCon>
                      <LiForm className="flex justify-between items-center">{bullet}</LiForm>
                    </LiContentCon>
                    <AddBtn
                      type="button"
                      onClick={() => handleRemoveDescriptionBullet(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </AddBtn>
                  </LiCon>
                ))}
              </UlForm>
            )}
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Key Responsibilities</TextLabel>
            <FormContent>
              <InputContent
                id="requirements-bullets"
                type="text"
                value={newRequirementBullet}
                onChange={(e) => setNewRequirementBullet(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter a requirement bullet"
              />
              <AddBtn
                type="button"
                onClick={handleAddRequirementBullet}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </AddBtn>
            </FormContent>
            {requirementsBullets.length > 0 && (
              <UlForm>
                {requirementsBullets.map((bullet, index) => (
                  <LiCon key={index}>
                    <LiContentCon>
                      <LiForm className="flex justify-between items-center">{bullet}</LiForm>
                    </LiContentCon>
                    <AddBtn
                      type="button"
                      onClick={() => handleRemoveRequirementBullet(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </AddBtn>
                  </LiCon>
                ))}
              </UlForm>
            )}
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Screening Questions</TextLabel>
            <FormContent>
              <InputContent
                id="chatbot-questions"
                type="text"
                value={newChatbotQuestion}
                onChange={(e) => setNewChatbotQuestion(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter a screening question"
              />
              <AddBtn
                type="button"
                onClick={handleAddChatbotQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </AddBtn>
            </FormContent>
            {chatbotQuestions.length > 0 && (
              <UlForm>
                {chatbotQuestions.map((question, index) => (
                  <LiCon key={index}>
                    <LiContentCon>
                      <LiForm className="flex justify-between items-center">{question}</LiForm>
                    </LiContentCon>
                    <AddBtn
                      type="button"
                      onClick={() => handleRemoveChatbotQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </AddBtn>
                  </LiCon>
                ))}
              </UlForm>
            )}
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Job Position</TextLabel>
            <InputContent
              id="job-position"
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Location</TextLabel>
            <InputContent
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Remote (US-based)"
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Type</TextLabel>
            <InputContent
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Full-time · Permanent"
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Salary</TextLabel>
            <InputContent
              id="salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., $90,000–$110,000/year"
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Experience</TextLabel>
            <InputContent
              id="experience"
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 2+ years in software development"
            />
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Education Level</TextLabel>
            <SelectForm
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Education Level</option>
              <option value="High School">High School</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Not specified">Not specified</option>
            </SelectForm>
          </FormContentCon>
          <FormContentCon>
            <TextLabel>Posted Date (optional)</TextLabel>
            <InputContent
              id="posted-date"
              type="date"
              value={postedDate}
              onChange={(e) => setPostedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </FormContentCon>
          <SubmitAddJob>
            <AddBtn
              $padding="10px 25px"
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {editingJobId ? "Update Job" : "Add Job"}
            </AddBtn>
            {editingJobId && (
              <AddBtn
                $padding="10px 25px"
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </AddBtn>
            )}
          </SubmitAddJob>
          {message && (
            <div className={`text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </div>
          )}
        </AddFormContainer>
      </AddJobContentCon>

      <AddJobContentCon>
        <TextSpan $margin="40px" $size="20px">
          Existing Jobs
        </TextSpan>
        {jobs.length === 0 ? (
          <TextSpan $margin="40px" $size="15px">
            No jobs posted yet.
          </TextSpan>
        ) : (
          <UlForm>
            {jobs.map((job) => (
              <LiContentCon key={job.id} className="p-4 border rounded-lg">
                <FormContentCon>
                  <JobsContentCon>
                    <TextSpan $size="25px">{job.jobPosition}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">{job.jobDescription.substring(0, 100)}...</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan>Location: {job.location || "Remote (US-based)"}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">Type: {job.type || "Full-time · Permanent"}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">Salary: {job.salary || "$90,000–$110,000/year"}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">Experience: {job.experience || "Not specified"}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">Education: {job.education || "Not specified"}</TextSpan>
                  </JobsContentCon>
                  <JobsContentCon>
                    <TextSpan $size="14px">Posted: {formatRelativeTime(job.postedDate)}</TextSpan>
                  </JobsContentCon>
                  <SubmitAddJob>
                    <AddBtn
                      onClick={() => handleEdit(job)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </AddBtn>
                    <AddBtn
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </AddBtn>
                    <AddBtn
                      onClick={() => handleViewResponses(job.jobPosition)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View Responses
                    </AddBtn>
                  </SubmitAddJob>
                </FormContentCon>
              </LiContentCon>
            ))}
          </UlForm>
        )}
      </AddJobContentCon>
    </AddJobContainer>
  );
}

export default Admin;