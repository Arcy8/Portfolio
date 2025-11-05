import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  ChartContainer,
  ChartCard,
  ChartCards,
  UpperChartCon,
  UpperTextCon,
  SpanText,
  DoughContainer,
} from "../components/Css.style";
import AdminSidebar from "./AdminSidebar";
import AcceptedUsers from "./AcceptedUsers";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function JobChart() {
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const API_BASE = "http://localhost/JobCon/JobCon/src/API";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch applicant data
        const applicantResponse = await fetch(`${API_BASE}/homeAdmin.php`);
        if (!applicantResponse.ok) {
          throw new Error(`HTTP error fetching applicants! Status: ${applicantResponse.status}`);
        }
        const applicantData = await applicantResponse.json();
        if (!applicantData.success || !Array.isArray(applicantData.users)) {
          throw new Error(applicantData.message || "Failed to fetch applicants");
        }

        // Fetch job listings
        const jobResponse = await fetch(`${API_BASE}/getJobs.php`);
        if (!jobResponse.ok) {
          throw new Error(`HTTP error fetching jobs! Status: ${jobResponse.status}`);
        }
        const jobData = await jobResponse.json();
        if (!jobData.success || !Array.isArray(jobData.jobs)) {
          throw new Error(jobData.message || "Failed to fetch jobs");
        }

        // Process applicant data
        const latestSubmissions = processLatestSubmissions(applicantData.users);
        const jobCounts = countApplicantsByJob(latestSubmissions, jobData.jobs);

        setJobData(jobCounts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processLatestSubmissions = (usersArray) => {
    const groupedByUserAndJob = {};

    usersArray.forEach((user, index) => {
      if (!user.email || !user.job_position || !user.created_at) {
        console.warn("Skipping user with missing data:", user);
        return;
      }

      const jobPosition = user.job_position.trim();
      const key = `${user.email}-${jobPosition}`;

      const createdAt = new Date(user.created_at);
      if (isNaN(createdAt.getTime())) {
        console.warn(`Invalid date for user ${user.email}: ${user.created_at}`);
        return;
      }

      if (!groupedByUserAndJob[key]) {
        groupedByUserAndJob[key] = { ...user, originalIndex: index };
      } else {
        const currentDate = new Date(groupedByUserAndJob[key].created_at);
        if (
          !isNaN(createdAt) &&
          (createdAt > currentDate ||
            (createdAt.getTime() === currentDate.getTime() &&
              index > groupedByUserAndJob[key].originalIndex))
        ) {
          groupedByUserAndJob[key] = { ...user, originalIndex: index };
        }
      }
    });

    return Object.values(groupedByUserAndJob).filter(
      (user) =>
        user.filename &&
        !isNaN(new Date(user.created_at).getTime()) &&
        user.job_position
    );
  };

  const countApplicantsByJob = (usersArray, jobList) => {
    const counts = {};

    // Initialize counts for all jobs from getJobs.php, even those with zero applicants
    jobList.forEach((job) => {
      counts[job.jobPosition] = 0;
    });

    // Count applicants for each job
    usersArray.forEach((user) => {
      const job = user.job_position.trim() || "No job selected";
      counts[job] = (counts[job] || 0) + 1;
    });

    return counts;
  };

  const sortedJobEntries = Object.entries(jobData).sort((a, b) => b[1] - a[1]);
  const displayedJobEntries = showAll ? sortedJobEntries : sortedJobEntries.slice(0, 4);
  const totalApplicants = sortedJobEntries.reduce((sum, [, count]) => sum + count, 0);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Loading job data...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</p>;
  }

  if (sortedJobEntries.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px" }}>No job applications or jobs found.</p>;
  }

  return (
    <>
      <AdminSidebar />
      <ChartContainer>
        <ChartCard>
          {displayedJobEntries.map(([job, count]) => {
            const percentage = totalApplicants
              ? ((count / totalApplicants) * 100).toFixed(1)
              : 0;

            const doughnutData = {
              labels: [job, "Others"],
              datasets: [
                {
                  data: [count, totalApplicants - count],
                  backgroundColor: ["#386e79", "#2c3d43"],
                  borderWidth: 1,
                },
              ],
            };

            return (
              <ChartCards key={job}>
                <DoughContainer>
                  <Doughnut
                    data={doughnutData}
                    options={{
                      cutout: "65%",
                      plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    }}
                  />
                  <UpperChartCon>
                    <UpperTextCon $width="100px" style={{ fontSize: "1.2rem" }}>
                      <SpanText size="30px" color="#303233" fontWeight="500">
                        {count}
                      </SpanText>
                    </UpperTextCon>
                    <UpperTextCon $width="100px">
                      <SpanText size="18px" color="#303233" fontWeight="500">
                        {percentage}%
                      </SpanText>
                    </UpperTextCon>
                  </UpperChartCon>
                </DoughContainer>
                <SpanText size="14px" color="#303233" fontWeight="500">
                  {job}
                </SpanText>
              </ChartCards>
            );
          })}
        </ChartCard>

        {sortedJobEntries.length > 4 && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button
              onClick={() => setShowAll((prev) => !prev)}
              style={{
                backgroundColor: "#2c3d43",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        )}
        <AcceptedUsers />
      </ChartContainer>
    </>
  );
}

export default JobChart;