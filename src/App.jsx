import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";

// Enhanced Components
import WorkingDashboard from "./components/WorkingDashboard";
import DashboardLayout from "./components/DashboardLayout";

// Original Components
import MyTasks from "./pages/employee/MyTasks";
import CheckInOutSimple from "./pages/employee/CheckInOutSimple";
import MyLocation from "./pages/employee/MyLocation";
import MyProfileSimple from "./pages/employee/MyProfileSimple";
import ManageEmployees from "./pages/admin/ManageEmployees";
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeProfile from "./pages/employees/EmployeeProfile";

// Auth Pages
import LoginPortal from "./pages/auth/LoginPortal";
import SignupPortal from "./pages/auth/SignupPortal";
import AdminLogin from "./pages/auth/AdminLogin";
import HRLogin from "./pages/auth/HRLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import AdminSignup from "./pages/auth/AdminSignup";
import HRSignup from "./pages/auth/HRSignup";
import EmployeeSignup from "./pages/auth/EmployeeSignup";

// HR Pages
import EmployeeRecords from "./pages/hr/EmployeeRecords";
import AttendanceReports from "./pages/hr/AttendanceReports";
import Performance from "./pages/hr/Performance";
import Analytics from "./pages/hr/Analytics";
import HybridDashboard from "./pages/dashboard/HybridDashboard";
import LeaveApplication from "./pages/leave/LeaveApplication";
import TestLeave from "./pages/leave/TestLeave";
import LeaveRequestDetails from "./pages/leave/LeaveRequestDetails";
import TestLeaveRequests from "./pages/leave/TestLeaveRequests";
import EmployeeAttendance from "./pages/attendance/EmployeeAttendance";
import HRAttendance from "./pages/attendance/HRAttendance";

// Admin Pages
import SystemReports from "./pages/admin/SystemReports";
import SystemSettings from "./pages/admin/SystemSettings";
import UserManagement from "./pages/admin/UserManagement";
import HybridPermissions from "./pages/admin/HybridPermissions";
import ManagePermissions from "./pages/admin/ManagePermissions";
import AdminServiceManagement from "./pages/admin/AdminServiceManagement";
import ServiceList from "./pages/services/ServiceList";
import ServiceForm from "./pages/services/ServiceForm";
import ServiceDetails from "./pages/services/ServiceDetails";
import LiveLocation from "./pages/location/LiveLocation";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPasswordRequest from "./pages/auth/ForgotPasswordRequest";
import NotificationsPage from "./pages/notifications/Notifications";
import AttendanceDashboard from "./pages/attendance/AttendanceDashboard";
import Settings from "./pages/settings/Settings";
function App() {
  return (
    <>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPortal />} />
        <Route path="/signup" element={<SignupPortal />} />

        {/* Role-specific Login Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/hr" element={<HRLogin />} />
        <Route path="/login/employee" element={<EmployeeLogin />} />

        {/* Role-specific Signup Routes */}
        <Route path="/signup/admin" element={<AdminSignup />} />
        <Route path="/signup/hr" element={<HRSignup />} />
        <Route path="/signup/employee" element={<EmployeeSignup />} />

        {/* Test Route */}
        <Route
          path="/test"
          element={
            <div style={{ padding: "20px", fontSize: "24px" }}>
              ✅ Test Route Working!
            </div>
          }
        />

        {/* Working Dashboard Route */}
        <Route path="/dashboard/:role" element={<WorkingDashboard />} />
        <Route path="/dashboard/hybrid" element={<HybridDashboard />} />

        {/* Original Dashboard Routes (fallback) */}
        <Route
          path="/dashboard-original/:role"
          element={<WorkingDashboard />}
        />
        
        {/* Protected Dashboard Routes (Wrapped in Main Sidebar) */}
        <Route element={<DashboardLayout />}>
        {/* Employee Routes */}
        <Route path="/employee/mytasks" element={<MyTasks />} />
        <Route path="/employee/checkinout" element={<CheckInOutSimple />} />
        <Route path="/employee/mylocation" element={<MyLocation />} />
        <Route path="/employee/myprofile" element={<MyProfileSimple />} />
        <Route
          path="/employee/leave-application"
          element={<LeaveApplication />}
        />
        <Route
          path="/employee/leave-requests"
          element={<TestLeaveRequests />}
        />
        <Route path="/employee/attendance" element={<EmployeeAttendance />} />
        <Route
          path="/test-navigation"
          element={
            <div
              style={{ padding: "50px", fontSize: "24px", textAlign: "center" }}
            >
              ✅ Navigation Test Working! <br />
              <button onClick={() => window.history.back()}>Go Back</button>
            </div>
          }
        />
        {/* Aliases so quick-action paths work */}
        <Route path="/employee/location" element={<MyLocation />} />
        <Route path="/employee/profile" element={<MyProfileSimple />} />
        {/* Admin Routes */}
        <Route path="/admin/manage-employees" element={<ManageEmployees />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/reports" element={<SystemReports />} />
        <Route path="/admin/system-reports" element={<SystemReports />} />
        <Route path="/admin/system-settings" element={<SystemSettings />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route
          path="/admin/hybrid-permissions"
          element={<HybridPermissions />}
        />
        <Route
          path="/admin/manage-permissions"
          element={<ManagePermissions />}
        />
        {/* HR Routes */}
        <Route path="/hr/employee-records" element={<EmployeeRecords />} />
        <Route path="/hr/attendance-reports" element={<AttendanceReports />} />
        <Route path="/hr/performance" element={<Performance />} />
        <Route path="/hr/analytics" element={<Analytics />} />
        <Route path="/hr/leave-application" element={<LeaveApplication />} />
        <Route path="/hr/test-leave" element={<TestLeave />} />
        <Route path="/hr/attendance-management" element={<HRAttendance />} />
        {/* Service Management Routes */}
        <Route path="/services" element={<ServiceList />} />
        <Route
          path="/services/create"
          element={<div>Create Service Request - Coming Soon</div>}
        />
        <Route path="/services/:id" element={<ServiceDetails />} />

        {/* Admin employee/service CRUD routes */}
        <Route path="/admin/employees/new" element={<EmployeeForm />} />
        <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/admin/services" element={<AdminServiceManagement />} />
        <Route path="/admin/services/new" element={<ServiceForm />} />
        <Route path="/admin/services/edit/:id" element={<ServiceForm />} />
        <Route path="/admin/services/:id" element={<ServiceDetails />} />

        {/* Location Tracking Routes */}
        <Route path="/location/tracking" element={<LiveLocation />} />
        <Route path="/location/live" element={<LiveLocation />} />
        <Route
          path="/location/history"
          element={<div>Location History - Coming Soon</div>}
        />
        <Route
          path="/location/geofence"
          element={<div>Geo-fence Management - Coming Soon</div>}
        />

        {/* OTP / Reset Password */}
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPasswordRequest />} />

        {/* Notification Routes */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/notifications/settings"
          element={<div>Notification Settings - Coming Soon</div>}
        />
        <Route path="/employee/notifications" element={<NotificationsPage />} />

        {/* Employee Services & Attendance */}
        <Route path="/employee/services" element={<ServiceList />} />
        <Route path="/employee/attendance" element={<AttendanceDashboard />} />

        {/* Report Routes */}
        <Route
          path="/reports/attendance"
          element={<div>Attendance Reports - Coming Soon</div>}
        />
        <Route
          path="/reports/performance"
          element={<div>Performance Reports - Coming Soon</div>}
        />
        <Route
          path="/reports/financial"
          element={<div>Financial Reports - Coming Soon</div>}
        />
        <Route
          path="/reports/export"
          element={<div>Export Reports - Coming Soon</div>}
        />

        {/* API Documentation Route */}
        <Route
          path="/api/docs"
          element={<div>API Documentation - Coming Soon</div>}
        />

        {/* Unified Quick Actions Routes mapping to their features */}
        <Route path="/profile" element={<MyProfileSimple />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/system-settings" element={<Settings />} />

        </Route> {/* Close DashboardLayout wrapper */}
        
        {/* Home Route */}
        <Route path="/" element={<LoginPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
