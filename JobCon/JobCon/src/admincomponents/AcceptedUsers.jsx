import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // <-- Added for Doughnut
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2"; // <-- Added Doughnut
import {
  ChartBar,
  ChartBarContainer,
  AcceptedJobCon,
  DoughChartCon
} from "../components/Css2.style";
import {
  Table,
  Thead,
  TrCell,
  ThCell,
  TdCell,
  Tbody,
  UploadImage1,
} from "../components/Css.style";
import { TextSpan } from "../components/Mainpage.style";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // <-- Registered
);

function AcceptedUsers() {
  const [acceptedUsers, setAcceptedUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost/JobCon/JobCon/src/API/homeAdmin.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const latestSubmissions = processLatestSubmissions(data.users);
          const filteredAccepted = latestSubmissions.filter(
            (user) => user.status === "accepted"
          );
          setAcceptedUsers(filteredAccepted);
        } else {
          alert("Failed to fetch users");
        }
      })
      .catch((error) =>
        console.error("Error fetching accepted users:", error)
      );
  }, []);

  const processLatestSubmissions = (usersArray) => {
    const groupedByUserAndJob = {};

    usersArray.forEach((user, index) => {
      const jobPosition = user.job_position || "No job selected";
      const key = `${user.email}-${jobPosition}`;

      if (!groupedByUserAndJob[key]) {
        groupedByUserAndJob[key] = { ...user, originalIndex: index };
      } else {
        const currentDate = new Date(groupedByUserAndJob[key].created_at);
        const newDate = new Date(user.created_at);

        if (
          !isNaN(newDate) &&
          (newDate > currentDate ||
            (newDate.getTime() === currentDate.getTime() &&
              index > groupedByUserAndJob[key].originalIndex))
        ) {
          groupedByUserAndJob[key] = { ...user, originalIndex: index };
        }
      }
    });

    return Object.values(groupedByUserAndJob).filter(
      (user) => user.filename && !isNaN(new Date(user.created_at).getTime())
    );
  };

  // Prepare data for the bar chart
  const jobCounts = acceptedUsers.reduce((acc, user) => {
    const job = user.job_position || "No job selected";
    acc[job] = (acc[job] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(jobCounts),
    datasets: [
      {
        label: "Employes",
        data: Object.values(jobCounts),
        backgroundColor: "#2c3d43",
        borderColor: "#386e79",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Applicants by Job Position",
        color: "#272525",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
          color: "#262424",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#201f1f" },
        grid: {
          color: "#444444",
        },
      },
    },
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ["Employes"],
    datasets: [
      {
        label: "Total",
        data: [acceptedUsers.length],
        backgroundColor: ["#2c3d43"],
        borderColor: ["#386e79"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Total Applicant: ${acceptedUsers.length}`,
        color: "#302e2e",
        font: { size: 16 },
      },
    },
  };

  return (
    <AcceptedJobCon>
      <DoughChartCon>
        
      <ChartBar>
        <Bar data={chartData} options={chartOptions} />
      </ChartBar>

      <ChartBar $height="200px">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </ChartBar>

      {/* Bar Chart */}
      

      </DoughChartCon>

      {/* Accepted Users Table */}
      <ChartBarContainer>
 
          <TextSpan $margin="10px" $size="20px" >Accepted Applicants</TextSpan>
    
        
        <Table>
          <Thead>
            <TrCell>
              <ThCell>First Name</ThCell>
              <ThCell>Last Name</ThCell>
              <ThCell>Email</ThCell>
              <ThCell>Phone Number</ThCell>
              <ThCell>Job Picked</ThCell>
             
            </TrCell>
          </Thead>
          <Tbody>
            {acceptedUsers.length > 0 ? (
              acceptedUsers.map((user, index) => (
                <TrCell key={index}>
                  <TdCell>{user.firstname}</TdCell>
                  <TdCell>{user.lastname}</TdCell>
                  <TdCell>{user.email}</TdCell>
                  <TdCell>{user.pnumber}</TdCell>
                  <TdCell>{user.job_position || "No job selected"}</TdCell>
                 
                </TrCell>
              ))
            ) : (
              <TrCell>
                <TdCell colSpan="7">No accepted applicant found</TdCell>
              </TrCell>
            )}
          </Tbody>
        </Table>
      </ChartBarContainer>
    </AcceptedJobCon>
  );
}

export default AcceptedUsers;
