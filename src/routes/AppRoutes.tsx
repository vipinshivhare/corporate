import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import ManagerDashboard from "../features/manager/Dashboard";
import TeamManagement from "../features/manager/TeamManagement";
import ExpenseApprovals from "../features/manager/ExpenseApprovals";
import Reports from "../features/manager/Reports";
import EmployeeDashboard from "../features/employee/Dashboard";
import FlightBooking from "../features/employee/FlightBooking";
import HotelBooking from "../features/employee/HotelBooking";
import AirportPickup from "../features/employee/AirportPickup";
import BookingHistory from "../features/employee/BookingHistory";
import ExpenseReport from "../features/employee/ExpenseReport";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/team-management" element={<TeamManagement />} />
        <Route path="/manager/expense-approvals" element={<ExpenseApprovals />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/book-flight" element={<FlightBooking />} />
        <Route path="/employee/book-hotel" element={<HotelBooking />} />
        <Route path="/employee/book-pickup" element={<AirportPickup />} />
        <Route path="/employee/booking-history" element={<BookingHistory />} />
        <Route path="/employee/expense-report" element={<ExpenseReport />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
