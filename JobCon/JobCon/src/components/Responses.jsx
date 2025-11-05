import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TableBtn } from "../components/Css.style";
import { TextSpan } from "../components/Mainpage.style";

// Utility: extract numeric score from evaluation string
const extractScore = (evalStr) => {
  if (!evalStr || typeof evalStr !== "string") return 0;
  const match = evalStr.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

function Responses() {
  const { userEmail, jobPosition } = useParams();
  const navigate = useNavigate();
  const [latestSession, setLatestSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = "http://localhost/JobCon/JobCon/src/API";

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const url = new URL(`${API_BASE}/getApplicantResponses.php`);
        url.searchParams.append("userEmail", decodeURIComponent(userEmail));
        url.searchParams.append("jobPosition", decodeURIComponent(jobPosition));
        const res = await fetch(url);
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setError("Invalid data from server");
          return;
        }
        if (data.success && Array.isArray(data.responses) && data.responses.length > 0 && data.responses[0].responses) {
          setLatestSession(data.responses[0]);
        } else {
          setError(data.message || "No responses found for this user and job");
        }
      } catch {
        setError("Failed to load responses");
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [userEmail, jobPosition]);

  const handleBack = () => {
    navigate("/Applicant");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <p>Loading responses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <TableBtn onClick={handleBack}>Back to Applicants</TableBtn>
      </div>
    );
  }

  // Calculate TOP SCORE (highest score in the session)
  const topScore = latestSession
    ? Math.max(...latestSession.responses.map((resp) => extractScore(resp.evaluation)))
    : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ flex: 1, padding: "40px" }}>
        {/* User & Job Info */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px 25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            fontSize: "15px",
            color: "#333",
          }}
        >
          <TextSpan $size="20">
            <strong>Applicant:</strong> {decodeURIComponent(userEmail)} <br />
            <strong>Job Position:</strong> {decodeURIComponent(jobPosition)}
          </TextSpan>
        </div>
        {/* Latest Session */}
        {latestSession && latestSession.responses.length > 0 ? (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* TOP SCORE */}
            <TextSpan
              $size="16"
              style={{ fontWeight: "600", color: "#dc2626", display: "block", marginBottom: "15px" }}
            >
              Top Score: {topScore.toFixed(1)}
            </TextSpan>
            <div>
              {latestSession.responses.map((resp, index) => (
                <div
                  key={`${resp.id}-${index}`}
                  style={{
                    marginBottom: "18px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <TextSpan $size="15" style={{ fontWeight: "600", color: "#000000" }}>
                    Q: {resp.question || "—"}
                  </TextSpan>
                  <br />
                  <TextSpan $size="15" style={{ color: "#080808" }}>
                    A: {resp.answer || "—"}
                  </TextSpan>
                  {resp.evaluation && (
                    <>
                      <br />
                      <TextSpan $size="13px" style={{ color: "#0b0a0a" }}>
                        → {resp.evaluation}
                      </TextSpan>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              color: "#666",
            }}
          >
            <p>No responses found.</p>
          </div>
        )}
        {/* Back Button */}
        <div style={{ marginTop: "25px" }}>
          <TableBtn onClick={handleBack}>Back to Applicants</TableBtn>
        </div>
      </div>
    </div>
  );
}

export default Responses;