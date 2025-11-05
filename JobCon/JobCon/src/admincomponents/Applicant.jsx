import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import {
  Table,
  Thead,
  TrCell,
  ThCell,
  Tbody,
  TdCell,
  UploadImage1,
  TableContainer,
  TableBtn,
} from "../components/Css.style";
import { TextSpan } from "../components/Mainpage.style";
import {
  ApplicantContainer,
  ApplicantBtnContainer,
} from "../components/Css2.style";

function Applicant() {
  const [users, setUsers] = useState([]);
  const [editAccepted, setEditAccepted] = useState(false);
  const [editRejected, setEditRejected] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost/JobCon/JobCon/src/API";

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`${API_BASE}/homeAdmin.php`);
        const data = await response.json();
        if (data.success) {
          // Filter to keep only the latest application for each email-job pair
          const filteredUsers = Object.values(
            data.users.reduce((acc, user) => {
              const key = `${user.email}-${user.job_position}`;
              if (!acc[key] || new Date(user.created_at) > new Date(acc[key].created_at)) {
                acc[key] = user;
              }
              return acc;
            }, {})
          );
          setUsers(filteredUsers);
        } else {
          console.error("Failed to fetch applicants:", data.message);
          alert("Failed to fetch applicants");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        alert("Server error fetching applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleStatusChange = async (userId, status) => {
    try {
      const response = await fetch(`${API_BASE}/updateStatus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status } : user
          )
        );
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      alert("Server error updating status");
    }
  };

  const pendingUsers = users.filter(
    (user) => !user.status || user.status === "pending"
  );
  const acceptedUsers = users.filter((user) => user.status === "accepted");
  const rejectedUsers = users.filter((user) => user.status === "rejected");

  const renderActionButtons = (user, type) => {
    const buttons = {
      pending: [
        { text: "Accept", action: "accepted" },
        { text: "Reject", action: "rejected" },
      ],
      accepted: [
        { text: "Reject", action: "rejected" },
        { text: "Set Pending", action: "pending" },
      ],
      rejected: [
        { text: "Accept", action: "accepted" },
        { text: "Set Pending", action: "pending" },
      ],
    };

    return buttons[type].map((btn, i) => (
      <TableBtn
        key={i}
        style={{ marginRight: "6px" }}
        onClick={() => handleStatusChange(user.id, btn.action)}
      >
        {btn.text}
      </TableBtn>
    ));
  };

  const renderTable = (list, listType, editable = false) => (
    <div
      style={{
        borderRadius: "8px",
        boxShadow: "0 0 0 2px #e8e8e8ff",
        marginTop: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: "600px",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <Table style={{ borderCollapse: "collapse", width: "100%" }}>
          <Thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f8f8",
              zIndex: 2,
            }}
          >
            <TrCell>
              <ThCell style={{ width: "8%" }}>ID</ThCell>
              <ThCell style={{ width: "10%" }}>First Name</ThCell>
              <ThCell style={{ width: "10%" }}>Last Name</ThCell>
              <ThCell style={{ width: "15%" }}>Email</ThCell>
              <ThCell style={{ width: "10%" }}>Phone</ThCell>
              <ThCell style={{ width: "10%" }}>Job</ThCell>
              <ThCell style={{ width: "15%" }}>Date & Time</ThCell>
              <ThCell style={{ width: "10%" }}>Resume</ThCell>
              <ThCell style={{ width: "15%" }}>Summary / Responses</ThCell>
              <ThCell style={{ width: "10%" }}>Status</ThCell>
              {editable && <ThCell style={{ width: "12%" }}>Actions</ThCell>}
            </TrCell>
          </Thead>
          <Tbody>
            {list.length > 0 ? (
              list.map((user) => (
                <TrCell key={user.id}>
                  <TdCell>{user.id}</TdCell>
                  <TdCell>{user.firstname}</TdCell>
                  <TdCell>{user.lastname}</TdCell>
                  <TdCell>{user.email}</TdCell>
                  <TdCell>{user.pnumber}</TdCell>
                  <TdCell>{user.job_position}</TdCell>
                  <TdCell>{new Date(user.created_at).toLocaleString()}</TdCell>
                  <TdCell>
                    <a
                      href={`${API_BASE}/Uploads/${user.filename}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {user.filename?.endsWith(".pdf") ? (
                        "View PDF"
                      ) : (
                        <UploadImage1
                          src={`${API_BASE}/Uploads/${user.filename}`}
                          alt="Resume"
                          width="80"
                        />
                      )}
                    </a>
                  </TdCell>
                  <TdCell>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <Link to={`/summary/${user.id}`}>
                        <TableBtn style={{ fontSize: "12px", padding: "6px 10px" }}>
                          View Summary
                        </TableBtn>
                      </Link>
                      <Link
                        to={`/responses/${encodeURIComponent(user.email)}/${encodeURIComponent(user.job_position)}`}
                      >
                        <TableBtn style={{ fontSize: "12px", padding: "6px 10px" }}>
                          View Responses
                        </TableBtn>
                      </Link>
                    </div>
                  </TdCell>
                  <TdCell>{user.status || "Pending"}</TdCell>
                  {editable && (
                    <TdCell>{renderActionButtons(user, listType)}</TdCell>
                  )}
                </TrCell>
              ))
            ) : (
              <TrCell>
                <TdCell colSpan={editable ? "11" : "10"} style={{ textAlign: "center" }}>
                  No records found
                </TdCell>
              </TrCell>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        Loading applicants...
      </p>
    );

  return (
    <TableContainer $bgcolor="rgba(255,255,255,1)">
      <AdminSidebar />
      <TextSpan $margin="15px" $size="20px">
        Pending Applications ({pendingUsers.length})
      </TextSpan>
      {renderTable(pendingUsers, "pending", true)}

      <ApplicantContainer>
        <ApplicantBtnContainer>
          <TextSpan $size="20px">
            Accepted Applicants ({acceptedUsers.length})
          </TextSpan>
          <TableBtn
            $margin="100px"
            $btnwidth="140px"
            style={{ marginBottom: "10px" }}
            onClick={() => setEditAccepted(!editAccepted)}
          >
            {editAccepted ? "Close Edit Mode" : "Edit Results"}
          </TableBtn>
        </ApplicantBtnContainer>
        {renderTable(acceptedUsers, "accepted", editAccepted)}
      </ApplicantContainer>

      <ApplicantContainer>
        <ApplicantBtnContainer>
          <TextSpan $size="20px">
            Rejected Applicants ({rejectedUsers.length})
          </TextSpan>
          <TableBtn
            $margin="100px"
            $btnwidth="140px"
            style={{ marginBottom: "10px" }}
            onClick={() => setEditRejected(!editRejected)}
          >
            {editRejected ? "Close Edit Mode" : "Edit Results"}
          </TableBtn>
        </ApplicantBtnContainer>
        {renderTable(rejectedUsers, "rejected", editRejected)}
      </ApplicantContainer>
    </TableContainer>
  );
}

export default Applicant;