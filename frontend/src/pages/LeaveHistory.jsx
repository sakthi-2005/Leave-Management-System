import { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveHistory({ user }) {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    axios
      .get("/leave/history", { params: { userId: user.id } })
      .then((response) => {
        setLeaveHistory(response.data.history);
        setError(null);
      })
      .catch((err) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setError("Failed to fetch leave history.");
        console.error(err);
      });
  }, [user]);

  const handleViewRequest = (leave) => {
    if (leave.status === "cancelled") {
      return;
    }
    // cancelRequest(leave);
    setSelectedLeave(leave);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedLeave(null);
  };

  async function cancelRequest(id) {
    await axios
      .delete("/leave/deleteRequest", { params: { lrId: id } })
      .then((response) => {
        console.log(response.data.status);
        setIsOverlayOpen(false);
        setSelectedLeave(null);
      })
      .catch((err) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        console.log(err);
      });
  }

  return (
    <div className="leave-history">
      {error && <p className="error">{error}</p>}

      <div className="table-wrapper">
        {leaveHistory.length === 0 ? (
          <>NO LEAVE REQUESTED</>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Leave Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Approved/Rejected By</th>
                <th>Rejected Description</th>
                <th>No of Days</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, index) => (
                <tr key={leave.id} onClick={() => handleViewRequest(leave)}>
                  <td>{index + 1}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.description}</td>
                  <td>
                    {leave.status}{" "}
                    <label htmlFor="file">
                      ({leave.steps_completed}/{leave.steps_required})
                    </label>
                    <progress
                      id="file"
                      value={leave.steps_completed}
                      max={leave.steps_required}
                    ></progress>
                  </td>
                  <td>
                    {leave.approved_by_name || leave.rejected_by_name || "-"}
                  </td>
                  <td>{leave.rejection_reason || "-"}</td>
                  <td>{leave.no_of_days}</td>
                  <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isOverlayOpen && selectedLeave && (
        <div className="overlay fade-in">
          <div className="overlay-content slide-up">
            <h3>Leave Request Details</h3>
            <p>
              <strong>Leave Type:</strong> {selectedLeave.leaveType}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave.description}
            </p>
            <p>
              <strong>Approved/Rejected By:</strong>{" "}
              {selectedLeave.approved_by_name ||
                selectedLeave.rejected_by_name ||
                "N/A"}
            </p>
            <p>
              <strong>Rejected Description:</strong>{" "}
              {selectedLeave.rejection_reason || "N/A"}
            </p>
            <p>
              <strong>No of Days:</strong> {selectedLeave.no_of_days}
            </p>
            <p>
              <strong>From:</strong>{" "}
              {new Date(selectedLeave.from_date).toLocaleDateString()}
            </p>
            <p>
              <strong>To:</strong>{" "}
              {new Date(selectedLeave.to_date).toLocaleDateString()}
            </p>
            <button onClick={handleCloseOverlay} className="close-btn">
              Close
            </button>{" "}
            &nbsp;
            <button
              style={{ background: "red" }}
              onClick={() => cancelRequest(selectedLeave.id)}
            >
              cancelRequest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
