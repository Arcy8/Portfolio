import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../admincomponents/AdminSidebar";
import {
  Table,
  Thead,
  TrCell,
  ThCell,
  Tbody,
  TdCell,
  TableContainer,
} from "../components/Css.style";
import { TextSpan } from "../components/Mainpage.style";

function ChatbotResponses() {
  const { jobPosition } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChatbotResponses = async () => {
      try {
        const res = await fetch(
          `http://localhost/JobCon/JobCon/src/API/getChatbotResponses.php?jobPosition=${encodeURIComponent(jobPosition)}`
        );
        const data = await res.json();
        if (data.success) {
          setResponses(data.responses || []);
          setMessage(data.message || "");
        } else {
          setMessage(data.message || "No responses found");
        }
      } catch (err) {
        console.error("Error fetching chatbot responses:", err.message);
        setMessage("Failed to load responses");
      } finally {
        setLoading(false);
      }
    };
    fetchChatbotResponses();
  }, [jobPosition]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Loading responses...</p>;
  }

  return (
    <TableContainer $bgcolor="rgba(255,255,255,1)">
      <AdminSidebar />
      <TextSpan $margin="15px" $size="20px">
        Chatbot Responses for {decodeURIComponent(jobPosition)}
      </TextSpan>
      {message && <TextSpan $margin="15px" $size="15px">{message}</TextSpan>}
      {responses.length === 0 ? (
        <TextSpan $margin="15px" $size="15px">No chatbot responses found.</TextSpan>
      ) : (
        <div style={{ borderRadius: "8px", boxShadow: "0 0 0 2px #e8e8e8ff", marginTop: "10px", overflow: "hidden" }}>
          <div style={{ maxHeight: "600px", overflowY: "auto", position: "relative" }}>
            <Table style={{ borderCollapse: "collapse", width: "100%" }}>
              <Thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f8f8", zIndex: 2 }}>
                <TrCell>
                  <ThCell style={{ width: "15%" }}>Session ID</ThCell>
                  <ThCell style={{ width: "20%" }}>User Email</ThCell>
                  <ThCell style={{ width: "25%" }}>Question</ThCell>
                  <ThCell style={{ width: "30%" }}>Answer</ThCell>
                  <ThCell style={{ width: "10%" }}>Date</ThCell>
                </TrCell>
              </Thead>
              <Tbody>
                {responses.map((response, index) => (
                  <TrCell key={`${response.sessionId}-${response.questionId}-${index}`}>
                    <TdCell>{response.sessionId}</TdCell>
                    <TdCell>{response.userEmail}</TdCell>
                    <TdCell>{response.question || "Question not found"}</TdCell>
                    <TdCell>{response.answer}</TdCell>
                    <TdCell>{new Date(response.created_at).toLocaleString()}</TdCell>
                  </TrCell>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      )}
    </TableContainer>
  );
}

export default ChatbotResponses;