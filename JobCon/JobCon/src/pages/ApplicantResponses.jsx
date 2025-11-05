import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AddJobContainer,
  AddJobContentCon,
  UlForm,
  LiContentCon,
  FormContentCon,
} from "../components/Css2.style"; // Adjust path as needed
import AdminSidebar from "../admincomponents/AdminSidebar"; // Adjust path as needed
import { TextSpan } from "../components/Mainpage.style";
import { ContainerResponse, ResponsesContainer } from "../components/Chatbot.style";
import { AddBtn } from "../components/Css2.style";

// Utility function to extract numerical score from evaluation string
const extractScore = (evaluation) => {
  if (!evaluation || typeof evaluation !== "string") return 0;
  // Example: Assuming evaluation is like "Score: 85/100" or "85"
  const match = evaluation.match(/\d+(\.\d+)?/); // Extract number (integer or decimal)
  return match ? parseFloat(match[0]) : 0; // Return parsed number or 0 if not found
};

function ApplicantResponses() {
  const { jobPosition } = useParams(); // Get jobPosition from URL
  const [topResponses, setTopResponses] = useState([]);
  const [lowerResponses, setLowerResponses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicantResponses(jobPosition);
  }, [jobPosition]);

  const fetchApplicantResponses = async (jobPosition) => {
    try {
      const res = await fetch(
        `http://localhost/JobCon/JobCon/src/API/getApplicantResponses.php?jobPosition=${encodeURIComponent(jobPosition)}`
      );
      if (!res.ok) {
        const text = await res.text();
        console.error(`Fetch error in getApplicantResponses: Status ${res.status}, Response:`, text);
        throw new Error(`Failed to fetch responses: Status ${res.status}`);
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from getApplicantResponses:", text);
        setMessage("Server error: Invalid response from getApplicantResponses");
        return;
      }
      if (data.success) {
        const responses = data.responses || [];
        if (responses.length === 0) {
          setTopResponses([]);
          setLowerResponses([]);
          setMessage("No responses found for this job");
          return;
        }

        // Calculate top score for each applicant
        const responsesWithScores = responses.map((applicant) => ({
          ...applicant,
          topScore: Math.max(...applicant.responses.map((r) => extractScore(r.evaluation))),
        }));

        // Split into lower (≤7) and top (>7) and sort each by top score (ascending)
        const lower = responsesWithScores
          .filter((r) => r.topScore <= 7)
          .sort((a, b) => a.topScore - b.topScore);
        const top = responsesWithScores
          .filter((r) => r.topScore > 7)
          .sort((a, b) => a.topScore - b.topScore);

        setLowerResponses(lower);
        setTopResponses(top);
        setMessage("");
      } else {
        setTopResponses([]);
        setLowerResponses([]);
        setMessage(data.message || "No responses found for this job");
      }
    } catch (err) {
      console.error("Error fetching applicant responses:", err.message);
      setMessage("Failed to load responses: " + err.message);
    }
  };

  // Reusable component to render a list of responses
  const renderResponseList = (responses, title) => (
    <>
      <ResponsesContainer style={{ backgroundColor:"white", padding:"20px"}}>
        <TextSpan $margin="40px" $size="18px" $weight="bold">
          {title}
        </TextSpan>
      </ResponsesContainer>
      {responses.length > 0 ? (
        <UlForm>
          {responses.map((applicant, index) => (
            <LiContentCon key={index} className="p-4 border rounded-lg">
              <FormContentCon style={{ marginTop: "50px" }}>
                <ResponsesContainer>
                  <TextSpan $size="20px">Applicant: {applicant.user_email}</TextSpan>
                </ResponsesContainer>
                <ResponsesContainer>
                  <TextSpan $size="16px">Session ID: {applicant.session_id}</TextSpan>
                </ResponsesContainer>
                <ResponsesContainer>
                  <TextSpan $size="16px">
                    Top Score: {applicant.topScore || "N/A"}
                  </TextSpan>
                </ResponsesContainer>
                {applicant.responses.map((response, idx) => (
                  <ContainerResponse key={idx} className="mt-4">
                    <ResponsesContainer>
                      <TextSpan $size="17px" $weight="bold">
                        Question {response.question_id}: {response.question}
                      </TextSpan>
                    </ResponsesContainer>
                    <ResponsesContainer>
                      <TextSpan $size="16px">Answer: {response.answer}</TextSpan>
                    </ResponsesContainer>
                    <ResponsesContainer>
                      <TextSpan $size="16px" className="text-blue-600">
                        {response.evaluation || "No evaluation available"}
                      </TextSpan>
                    </ResponsesContainer>
                  </ContainerResponse>
                ))}
              </FormContentCon>
            </LiContentCon>
          ))}
        </UlForm>
      ) : (
        <TextSpan $margin="20px" $size="15px">
          No applicants in this category.
        </TextSpan>
      )}
    </>
  );

  return (
    <AddJobContainer>
      <AdminSidebar />
      <AddJobContentCon>
        <ResponsesContainer>
          <TextSpan $margin="40px" $size="20px">
            Applicant Responses for {decodeURIComponent(jobPosition)}
          </TextSpan>
        </ResponsesContainer>

        {message ? (
          <TextSpan $margin="40px" $size="15px">
            {message}
          </TextSpan>
        ) : (
          <>
            {renderResponseList(topResponses, "Top Scoring Applicants (Above 7)")}
            {renderResponseList(lowerResponses, "Lower Scoring Applicants (7 or Below)")}
          </>
        )}

        <AddBtn
          onClick={() => navigate("/AddJobs")} // Navigate back to Admin page
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to AddJob
        </AddBtn>
      </AddJobContentCon>
    </AddJobContainer>
  );
}

export default ApplicantResponses;