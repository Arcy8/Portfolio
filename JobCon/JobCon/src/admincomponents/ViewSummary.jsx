import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TableBtn } from "../components/Css.style";
import { TextSpan } from "../components/Mainpage.style";


function ViewSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const API_BASE = "http://localhost/JobCon/JobCon/src/API";


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API_BASE}/getSummary.php?id=${id}`);
        const data = await response.json();


        if (data.success) {
          setSummaryData(data.summary);
        } else {
          setError("No summary data found for this applicant.");
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Error fetching summary data from the server.");
      } finally {
        setLoading(false);
      }
    };


    fetchSummary();
  }, [id]);


  const handleBack = () => {
    navigate("/Applicant");
  };


  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <p>Loading summary...</p>
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
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          Applicant Resume Summary
        </h1>


        <div
          style={{
            backgroundColor: "#fff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            whiteSpace: "pre-line",
            lineHeight: "1.6",
            fontSize: "15px",
            color: "#333",
            maxWidth: "100%",
          }}
        >
          <TextSpan $size="20">
             {summaryData}
          </TextSpan>
         
        </div>


        <div style={{ marginTop: "25px" }}>
          <TableBtn onClick={handleBack}>Back to Applicants</TableBtn>
        </div>
      </div>
    </div>
  );
}


export default ViewSummary;