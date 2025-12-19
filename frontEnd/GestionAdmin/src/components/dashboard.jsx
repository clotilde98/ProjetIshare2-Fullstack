import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

import "../styles/dashboard.css";

const Dashboard = () => {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-app">
      <aside className={`sidebar-col ${!isSidebarOpen ? "closed" : ""}`}>
        <Sidebar />
      </aside>

      <div className="main-col">
        <Header toggleSidebar={() => setIsSidebarOpen((s) => !s)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
