import { useState, useEffect } from "react";
import { AdminCon } from "../components/Css2.style";
import { Table, Thead, TrCell, ThCell, TdCell, Tbody } from "../components/Css.style";
import { TableBtn, SpanText } from "../components/Css.style";
import { ScheduleInputContainer, ScheduleForm, Select, Input } from "../components/Css2.style";
import AdminSidebar from "./AdminSidebar";
import { AdminContainerCon } from "../components/Css2.style";

function AdminScheduleManager() {
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [day, setDay] = useState("");     // Auto-filled
  const [date, setDate] = useState("");   // Date picker
  const [period, setPeriod] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editScheduleId, setEditScheduleId] = useState(null);

  const periods = ["Morning", "Afternoon"];

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ------------------- API ------------------- */
  const fetchUsers = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("http://localhost/JobCon/JobCon/src/api/users.php");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          const sortedUsers = (data.users || [])
            .map((user) => ({ ...user, id: Number(user.id) }))
            .sort((a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`));
          setUsers(sortedUsers);
          return true;
        }
      } catch (e) {
        console.error(`Fetch users attempt ${i + 1} failed:`, e);
        if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
      }
    }
    setError("Failed to load users");
    setUsers([]);
    return false;
  };

  const fetchSchedules = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("http://localhost/JobCon/JobCon/src/api/schedules.php");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setSchedules(
            (data.schedules || []).map((s) => ({
              ...s,
              userId: Number(s.userId),
            }))
          );
          return true;
        }
      } catch (e) {
        console.error(`Fetch schedules attempt ${i + 1} failed:`, e);
        if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
      }
    }
    setError("Failed to load schedules");
    setSchedules([]);
    return false;
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsers().then((ok) => {
      if (ok) fetchSchedules().then(() => setIsLoading(false));
      else setIsLoading(false);
    });
  }, []);

  /* ------------------- FORM ------------------- */
  const resetForm = () => {
    setSelectedUser("");
    setDay("");
    setDate("");
    setPeriod("");
    setStartTime("");
    setEndTime("");
    setEditScheduleId(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !day || !date || !period || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const morningEnd = new Date("1970-01-01T12:00:00");

    // ----- VALIDATION -----
    if (period === "Morning") {
      if (start >= morningEnd || end >= morningEnd || end <= start) {
        setError("Morning: 00:00 – 11:59, end > start");
        return;
      }
    } else {
      if (start < morningEnd || end <= start) {
        setError("Afternoon: 12:00 – 23:59, end > start");
        return;
      }
    }

    const payload = {
      userId: Number(selectedUser),
      day,
      date,
      period,
      start_time: startTime,
      end_time: endTime,
    };

    const url = editScheduleId
      ? `http://localhost/JobCon/JobCon/src/api/schedules.php?id=${editScheduleId}`
      : "http://localhost/JobCon/JobCon/src/api/schedules.php";
    const method = editScheduleId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data.success) {
          if (editScheduleId) {
            setSchedules((prev) =>
              prev.map((s) => (s.id === editScheduleId ? { ...payload, id: editScheduleId } : s))
            );
          } else {
            setSchedules((prev) => [...prev, { ...payload, id: data.id }]);
          }
          resetForm();
        } else {
          setError(data.error ?? "Unknown error");
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost/JobCon/JobCon/src/api/schedules.php?id=${id}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSchedules((prev) => prev.filter((s) => s.id !== id));
          if (editScheduleId === id) resetForm();
        }
      });
  };

  const handleEdit = (s) => {
    setEditScheduleId(s.id);
    setSelectedUser(s.userId.toString());
    setDay(s.day);
    setDate(s.date);
    setPeriod(s.period);
    setStartTime(s.start_time);
    setEndTime(s.end_time);
    setError("");
  };

  const filteredSchedules = searchQuery
    ? schedules.filter((s) => {
        const u = users.find((user) => user.id === s.userId);
        if (!u) return false;
        const name = `${u.firstname} ${u.lastname}`.toLowerCase();
        const email = u.email.toLowerCase();
        return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
      })
    : schedules;

  /* ------------------- RENDER ------------------- */
  return (
    <>
      <AdminSidebar />
      <AdminContainerCon>
        <AdminCon>
          <SpanText size="23px" color="#222324" fontWeight="700">
            Admin Job Interview Schedule Manager
          </SpanText>

          {error && <p style={{ color: "red", margin: "8px 0" }}>{error}</p>}

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <ScheduleInputContainer>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                />

                <ScheduleForm onSubmit={handleSubmit}>
                  {/* USER */}
                  <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstname} {u.lastname} ({u.email})
                      </option>
                    ))}
                  </Select>

                  {/* DATE → AUTO DAY */}
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDate(val);
                      if (val) {
                        setDay(new Date(val).toLocaleDateString("en-US", { weekday: "long" }));
                      } else {
                        setDay("");
                      }
                    }}
                    required
                  />

                  {/* DAY (READ-ONLY) */}
                  <Input
                    type="text"
                    value={day}
                    readOnly
                    placeholder="Day (auto-filled)"
                    style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
                  />

                  {/* PERIOD */}
                  <Select
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value);
                      setStartTime("");
                      setEndTime("");
                    }}
                    required
                  >
                    <option value="">Select Period</option>
                    {periods.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>

                  {/* START TIME – NO MIN/MAX */}
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!period}
                    required
                  />

                  {/* END TIME – NO MIN/MAX */}
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!period || !startTime}
                    required
                  />

                  <TableBtn $btnwidth="90px" type="submit">
                    {editScheduleId ? "Update" : "Add"}
                  </TableBtn>

                  {editScheduleId && (
                    <TableBtn $btnwidth="90px" type="button" onClick={resetForm}>
                      Cancel
                    </TableBtn>
                  )}
                </ScheduleForm>
              </ScheduleInputContainer>

              {/* TABLE */}
              <Table>
                <Thead>
                  <TrCell>
                    <ThCell>User</ThCell>
                    <ThCell>Day</ThCell>
                    <ThCell>Date</ThCell>
                    <ThCell>Period</ThCell>
                    <ThCell>Start Time</ThCell>
                    <ThCell>End Time</ThCell>
                    <ThCell>Action</ThCell>
                  </TrCell>
                </Thead>
                <Tbody>
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((s) => {
                      const u = users.find((user) => user.id === s.userId);
                      return (
                        <TrCell key={s.id}>
                          <TdCell>{u ? `${u.firstname} ${u.lastname}` : `ID: ${s.userId}`}</TdCell>
                          <TdCell>{s.day}</TdCell>
                          <TdCell>{formatDate(s.date)}</TdCell>
                          <TdCell>{s.period}</TdCell>
                          <TdCell>{formatTimeTo12Hour(s.start_time)}</TdCell>
                          <TdCell>{formatTimeTo12Hour(s.end_time)}</TdCell>
                          <TdCell>
                            <TableBtn onClick={() => handleEdit(s)}>Edit</TableBtn>
                            <TableBtn onClick={() => handleDelete(s.id)}>Delete</TableBtn>
                          </TdCell>
                        </TrCell>
                      );
                    })
                  ) : (
                    <TrCell>
                      <TdCell colSpan={7}>
                        {searchQuery ? "No matches" : "No schedules available"}
                      </TdCell>
                    </TrCell>
                  )}
                </Tbody>
              </Table>
            </>
          )}
        </AdminCon>
      </AdminContainerCon>
    </>
  );
}

export default AdminScheduleManager;