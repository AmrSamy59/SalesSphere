import React, { useState, useContext, useEffect } from "react";
import SideBar from "../components/SideBar";
import { DefaultSection } from "../components/SectionComponents";
import RecordsSection from "../components/LayoutSections/RecordsSection";
import LogsSection from "../components/LayoutSections/LogsSection";
import DealsSection from "../components/LayoutSections/DealsSection";
import EmployeesSection from "../components/LayoutSections/EmployeesSection";
import CustomersSection from "../components/LayoutSections/CustomersSection";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import NotificationsSection from "../components/LayoutSections/NotificationsSection";
import SettingsSection from "../components/LayoutSections/SettingsSection";
import BusinessSection from "../components/LayoutSections/BusinessSection";
import OverviewSection from "../components/LayoutSections/OverviewSection";
import NotFoundPage from "./NotFoundPage";
import TargetsSection from "../components/LayoutSections/TargetsSection";

function Home() {
  const { isAuthenticated, employee } = useContext(UserContext);
  const Navigate = useNavigate();

  console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      Navigate("/login");
    }
  }, [isAuthenticated, Navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <SideBar />

      {/* Main content area on the right */}
      <div
        className={`
        flex flex-col flex-grow 
        duration-300 
      `}
      >
        <div className="max-h-full overflow-y-auto ">
          <Routes>
            <Route path="/business" element={<BusinessSection />} />
            <Route path="/logs" element={<LogsSection />} />
            <Route path="/records" element={<RecordsSection />} />
            <Route path="/notifications" element={<NotificationsSection />} />
            <Route path="/settings" element={<SettingsSection />} />
            <Route path="/deals/*" element={<DealsSection />} />
            <Route path="/targets/*" element={<TargetsSection />} />
            <Route path="/employees/*" element={<EmployeesSection />} />
            <Route path="/customers/*" element={<CustomersSection />} />
            <Route path="/" element={<OverviewSection />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;
