import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AddJobContainer,
  AddJobContentCon,
  FormContentCon,
  UlForm,
  LiContentCon,
  TextSpan,
} from './Css2.style';
import AdminSidebar from './AdminSidebar';

function ViewResponses() {
  const { jobPosition } = useParams();
  const navigate = useNavigate();
  const [applicantResponses, setApplicantResponses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantResponses = async () => {
      console.log("Fetching responses for jobPosition:", jobPosition);
      try {
        const res = await fetch(
          `http://localhost/JobCon/JobCon/src/API/getApplicantResponses.php?jobPosition=${encodeURIComponent(jobPosition)}`
        );
        console.log("Response status:", res.status, "OK:", res.ok);
        if (!res.ok) {
          const text = await res.text();
          console.error(`Fetch error in getApplicantResponses: Status ${res.status}, Response:`, text);
          throw new Error(`Failed to fetch responses: Status ${res.status}`);
        }
        const text = await res.text();
        console.log("Raw response:", text);
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON from getApplicantResponses:", text);
          setMessage("Server error: Invalid response from getApplicantResponses");
          setLoading(false);
          return;
        }
        if (data.success) {
          setApplicantResponses(data.responses || []);
          setMessage(data.responses.length > 0 ? '' : 'No responses found for this job');
        } else {
          setApplicantResponses([]);
          setMessage(data.message || 'No responses found for this job');
        }
      } catch (err) {
        console.error("Error fetching applicant responses:", err.message);
        setMessage("Failed to load responses: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantResponses();
  }, [jobPosition]);

  return (
    <AddJobContainer>
      <AdminSidebar />
      <AddJobContentCon>
        <TextSpan $size="20px" className="text-2xl font-bold mb-4">
          Applicant Responses for {jobPosition}
        </TextSpan>
        <AddBtn
          onClick={() => navigate('/admin')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Back to Admin
        </AddBtn>
        {loading ? (
          <TextSpan $margin="40px" $size="15px">
            Loading responses...
          </TextSpan>
        ) : applicantResponses.length > 0 ? (
          <UlForm>
            {applicantResponses.map((applicant, index) => (
              <LiContentCon key={index} className="p-4 border rounded-lg">
                <FormContentCon>
                  <TextSpan $size="18px">Applicant: {applicant.user_email}</TextSpan>
                  <TextSpan $size="14px">Session ID: {applicant.session_id}</TextSpan>
                  {applicant.responses.map((response, idx) => (
                    <div key={idx} className="mt-4">
                      <TextSpan $size="16px">
                        Question {response.question_id}: {response.question}
                      </TextSpan>
                      <TextSpan $size="14px">Answer: {response.answer}</TextSpan>
                      <TextSpan $size="14px" className="text-blue-600">
                        Evaluation: {response.evaluation || "No evaluation available"}
                      </TextSpan>
                    </div>
                  ))}
                </FormContentCon>
              </LiContentCon>
            ))}
          </UlForm>
        ) : (
          <TextSpan $margin="40px" $size="15px">
            {message || "No responses found for this job"}
          </TextSpan>
        )}
      </AddJobContentCon>
    </AddJobContainer>
  );
}

export default ViewResponses;