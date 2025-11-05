import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Table, Thead, TrCell, ThCell, TdCell, Tbody } from "./Css.style";
import { UserScheduleCon, UserScheduleContainer } from "./Css2.style";
import { TextSpan } from "./Mainpage.style";

const ErrorMessage = styled.p`
  color: #ff4444;
  margin: 10px 0;
`;

function UserSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${hour}:${minutes} ${period}`;
  };

  // Function to format date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to fetch user and schedule data
  const fetchData = (userId) => {
    if (!userId || userId === "null") {
      setError("Please log in to view your profile");
      setUser(null);
      setSchedules([]);
      return;
    }

    fetch(`http://localhost/JobCon/JobCon/src/api/users.php?id=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data:", data);
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setError("Failed to fetch user data: " + (data.error || "No user found"));
          setUser(null);
        }
      })
      .catch((error) => {
        setError("Error fetching user data: " + error.message);
        console.error("Error fetching user:", error);
        setUser(null);
      });

    fetch(`http://localhost/JobCon/JobCon/src/api/schedules.php?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Schedules data:", data);
        if (data.success) {
          // Sort schedules by date, then by day in calendar order
          const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const sortedSchedules = (data.schedules || []).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB;
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
          });
          setSchedules(sortedSchedules);
        } else {
          setError("Failed to fetch schedules: " + (data.error || "No schedules found"));
          setSchedules([]);
        }
      })
      .catch((error) => {
        setError("Error fetching schedules: " + error.message);
        console.error("Error fetching schedules:", error);
        setSchedules([]);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetchData(userId);

    // Listen for storage changes (e.g., logout from Header.jsx)
    const handleStorageChange = () => {
      const newUserId = localStorage.getItem("userId");
      if (!newUserId || newUserId === "null") {
        setUser(null);
        setSchedules([]);
        setError("Please log in to view your profile");
        navigate("/login"); // Navigate to login if userId is cleared
      } else if (newUserId !== userId) {
        fetchData(newUserId);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return (
    <UserScheduleCon>
      <UserScheduleContainer>
        <TextSpan $size="20px" $weight="bold">Job Interview Schedule</TextSpan>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Table $bgcolor="rgb(255, 255, 255)">
          <Thead>
            <TrCell>
              <ThCell $border="1px solid #1b1c1d" $thColor="rgb(28, 25, 25)" $thcolor="rgb(255, 255, 255)">Date</ThCell>
              <ThCell $border="1px solid #1b1c1d" $thColor="rgb(28, 25, 25)" $thcolor="rgb(255, 255, 255)">Day</ThCell>
              <ThCell $border="1px solid #1b1c1d" $thColor="rgb(28, 25, 25)" $thcolor="rgb(255, 255, 255)">Period</ThCell>
              <ThCell $border="1px solid #1b1c1d" $thColor="rgb(28, 25, 25)" $thcolor="rgb(255, 255, 255)">Start Time</ThCell>
              <ThCell $border="1px solid #1b1c1d" $thColor="rgb(28, 25, 25)" $thcolor="rgb(255, 255, 255)">End Time</ThCell>
            </TrCell>
          </Thead>
          <Tbody>
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <TrCell key={schedule.id}>
                  <TdCell $firstColor="#101616" $border="1px solid #1b1c1d" $tdcolor="rgb(255, 255, 255)">{formatDate(schedule.date)}</TdCell>
                  <TdCell $tdColor="#101616" $border="1px solid #1b1c1d" $tdcolor="rgb(255, 255, 255)">{schedule.day}</TdCell>
                  <TdCell $tdColor="#101616" $border="1px solid #1b1c1d" $tdcolor="rgb(255, 255, 255)">{schedule.period}</TdCell>
                  <TdCell $tdColor="#101616" $border="1px solid #1b1c1d" $tdcolor="rgb(255, 255, 255)">{formatTimeTo12Hour(schedule.start_time)}</TdCell>
                  <TdCell $tdColor="#101616" $border="1px solid #1b1c1d" $tdcolor="rgb(255, 255, 255)">{formatTimeTo12Hour(schedule.end_time)}</TdCell>
                </TrCell>
              ))
            ) : (
              <TrCell>
                <TdCell colSpan="5">{error || "No schedules assigned"}</TdCell>
              </TrCell>
            )}
          </Tbody>
        </Table>
      </UserScheduleContainer>
    </UserScheduleCon>
  );
}

export default UserSchedule;