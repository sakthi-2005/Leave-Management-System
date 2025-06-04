import React, { useState } from "react";
import "../App.css";
import { Sidebar } from "../components/sidebar";
import { Dashboard } from "./dashboard";
import { RequestPending } from "./pendingRequest";
import LeaveHistory from "./LeaveHistory";
import { CalendarPage } from "./calendar";
import { Profile } from "./profile";

function Main({ setlogin }) {
  let [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  let [profile, setProfile] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setUser={setlogin}
      />

      {/* Main Content */}
      <div className="content">
        {profile && <Profile setUser={setlogin} />}
        <div className="profilebutton-wrapper">
          <button
            onClick={() => setProfile((e) => !e)}
            className="admin-header-profile"
          >
            👤
          </button>
        </div>
        {active === "History" ? (
          <LeaveHistory user={user} />
        ) : active === "Dashboard" ? (
          <Dashboard user={user} setActive={setActive} />
        ) : active === "Calendar" ? (
          <CalendarPage user={user} />
        ) : (
          <RequestPending user={user} />
        )}
      </div>
    </div>
  );
}

export default Main;
