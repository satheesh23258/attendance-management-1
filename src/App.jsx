import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { Box, CircularProgress, Typography } from "@mui/material";

// ── Lazy-loaded components ──────────────────────────────────────────────────
// Dashboard / Layout
const WorkingDashboard   = lazy(() => import("./components/WorkingDashboard"));
const DashboardLayout    = lazy(() => import("./components/DashboardLayout"));

// Auth pages
const LoginPortal          = lazy(() => import("./pages/auth/LoginPortal"));
const SignupPortal         = lazy(() => import("./pages/auth/SignupPortal"));
const AdminLogin           = lazy(() => import("./pages/auth/AdminLogin"));
const HRLogin              = lazy(() => import("./pages/auth/HRLogin"));
const EmployeeLogin        = lazy(() => import("./pages/auth/EmployeeLogin"));
const AdminSignup          = lazy(() => import("./pages/auth/AdminSignup"));
const HRSignup             = lazy(() => import("./pages/auth/HRSignup"));
const EmployeeSignup       = lazy(() => import("./pages/auth/EmployeeSignup"));
const VerifyOtp            = lazy(() => import("./pages/auth/VerifyOtp"));
const ResetPassword        = lazy(() => import("./pages/auth/ResetPassword"));
const ForgotPasswordRequest = lazy(() => import("./pages/auth/ForgotPasswordRequest"));

// Dashboard pages
const HybridDashboard = lazy(() => import("./pages/dashboard/HybridDashboard"));

// Employee pages
const MyTasks            = lazy(() => import("./pages/employee/MyTasks"));
const CheckInOutEnhanced = lazy(() => import("./pages/employee/CheckInOutEnhanced"));
const MyLocation         = lazy(() => import("./pages/employee/MyLocation"));
const MyProfileEnhanced  = lazy(() => import("./pages/employee/MyProfileEnhanced"));
const MyExpenses         = lazy(() => import("./pages/employee/MyExpenses"));
const MyPayroll          = lazy(() => import("./pages/employee/MyPayroll"));
const SupportCenter      = lazy(() => import("./pages/support/SupportCenter"));

// Admin pages
const ManageEmployees        = lazy(() => import("./pages/admin/ManageEmployees"));
const SystemReports          = lazy(() => import("./pages/admin/SystemReports"));
const SystemSettings         = lazy(() => import("./pages/admin/SystemSettings"));
const UserManagement         = lazy(() => import("./pages/admin/UserManagement"));
const HybridPermissions      = lazy(() => import("./pages/admin/HybridPermissions"));
const ManagePermissions      = lazy(() => import("./pages/admin/ManagePermissions"));
const AdminServiceManagement = lazy(() => import("./pages/admin/AdminServiceManagement"));
const AuditLogs              = lazy(() => import("./pages/admin/AuditLogs"));
const PayrollManagement      = lazy(() => import("./pages/finance/PayrollManagement"));
const ShiftRoster            = lazy(() => import("./pages/admin/ShiftRoster"));
const AssetInventory         = lazy(() => import("./pages/admin/AssetInventory"));

// Employee CRUD
const EmployeeList    = lazy(() => import("./pages/employees/EmployeeList"));
const EmployeeForm    = lazy(() => import("./pages/employees/EmployeeForm"));
const EmployeeProfile = lazy(() => import("./pages/employees/EmployeeProfile"));

// HR pages
const EmployeeRecords  = lazy(() => import("./pages/hr/EmployeeRecords"));
const AttendanceReports = lazy(() => import("./pages/hr/AttendanceReports"));
const Performance      = lazy(() => import("./pages/hr/Performance"));
const Analytics        = lazy(() => import("./pages/hr/Analytics"));
const ClaimApprovals   = lazy(() => import("./pages/hr/ClaimApprovals"));
const HRAttendance     = lazy(() => import("./pages/attendance/HRAttendance"));

// Leave pages
const LeaveApplication  = lazy(() => import("./pages/leave/LeaveApplication"));
const TestLeave         = lazy(() => import("./pages/leave/TestLeave"));
const LeaveRequestDetails = lazy(() => import("./pages/leave/LeaveRequestDetails"));
const TestLeaveRequests = lazy(() => import("./pages/leave/TestLeaveRequests"));

// Attendance pages
const EmployeeAttendance = lazy(() => import("./pages/attendance/EmployeeAttendance"));
const AttendanceDashboard = lazy(() => import("./pages/attendance/AttendanceDashboard"));

// Services
const ServiceList    = lazy(() => import("./pages/services/ServiceList"));
const ServiceForm    = lazy(() => import("./pages/services/ServiceForm"));
const ServiceDetails = lazy(() => import("./pages/services/ServiceDetails"));

// Location
const LiveLocation    = lazy(() => import("./pages/location/LiveLocation"));
const LocationHistory = lazy(() => import("./pages/location/LocationHistory"));
const GeofenceManager = lazy(() => import("./pages/location/GeofenceManager"));

// Reports
const AttendanceAnalytics = lazy(() => import("./pages/reports/AttendanceAnalytics"));
const FinancialReport     = lazy(() => import("./pages/reports/FinancialReport"));
const PerformanceReport   = lazy(() => import("./pages/reports/PerformanceReport"));

// Notifications
const NotificationsPage      = lazy(() => import("./pages/notifications/Notifications"));
const NotificationSettings   = lazy(() => import("./pages/notifications/NotificationSettings"));

// Settings, Profile, API
const Settings = lazy(() => import("./pages/settings/Settings"));
const ApiDocs  = lazy(() => import("./pages/api/ApiDocs"));

// ── Loading fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <Box sx={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    minHeight: "60vh", gap: 2
  }}>
    <CircularProgress sx={{ color: "#00c853" }} />
    <Typography variant="body2" color="text.secondary">Loading…</Typography>
  </Box>
);

function App() {
  return (
    <>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: { duration: 3000 },
          error: { duration: 5000 },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Auth ──────────────────────────────────────────────────── */}
          <Route path="/login"           element={<LoginPortal />} />
          <Route path="/signup"          element={<SignupPortal />} />
          <Route path="/login/admin"     element={<AdminLogin />} />
          <Route path="/login/hr"        element={<HRLogin />} />
          <Route path="/login/employee"  element={<EmployeeLogin />} />
          <Route path="/signup/admin"    element={<AdminSignup />} />
          <Route path="/signup/hr"       element={<HRSignup />} />
          <Route path="/signup/employee" element={<EmployeeSignup />} />
          <Route path="/verify-otp"      element={<VerifyOtp />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPasswordRequest />} />

          {/* ── Test ─────────────────────────────────────────────────── */}
          <Route path="/test" element={<div style={{ padding: 20, fontSize: 24 }}>✅ Test Route Working!</div>} />

          {/* ── Dashboards ───────────────────────────────────────────── */}
          <Route path="/dashboard/:role"         element={<WorkingDashboard />} />
          <Route path="/dashboard/hybrid"        element={<HybridDashboard />} />
          <Route path="/dashboard-original/:role" element={<WorkingDashboard />} />

          {/* ── Protected / Feature Routes ────────────────────────────── */}
          <Route element={<Outlet />}>
            {/* Employee */}
            <Route path="/employee/mytasks"          element={<MyTasks />} />
            <Route path="/employee/checkinout"       element={<CheckInOutEnhanced />} />
            <Route path="/employee/mylocation"       element={<MyLocation />} />
            <Route path="/employee/myprofile"        element={<MyProfileEnhanced />} />
            <Route path="/employee/location"         element={<MyLocation />} />
            <Route path="/employee/profile"          element={<MyProfileEnhanced />} />
            <Route path="/employee/leave-application" element={<LeaveApplication />} />
            <Route path="/employee/leave-requests"   element={<TestLeaveRequests />} />
            <Route path="/employee/attendance"       element={<EmployeeAttendance />} />
            <Route path="/employee/services"         element={<ServiceList />} />
            <Route path="/employee/expenses"         element={<MyExpenses />} />
            <Route path="/employee/support"          element={<SupportCenter />} />
            <Route path="/employee/payroll"          element={<MyPayroll />} />
            <Route path="/employee/notifications"    element={<NotificationsPage />} />

            {/* Admin */}
            <Route path="/admin/manage-employees"    element={<ManageEmployees />} />
            <Route path="/admin/employees"           element={<EmployeeList />} />
            <Route path="/admin/employees/new"       element={<EmployeeForm />} />
            <Route path="/admin/employees/edit/:id"  element={<EmployeeForm />} />
            <Route path="/admin/reports"             element={<SystemReports />} />
            <Route path="/admin/system-reports"      element={<SystemReports />} />
            <Route path="/admin/system-settings"     element={<SystemSettings />} />
            <Route path="/admin/user-management"     element={<UserManagement />} />
            <Route path="/admin/expenses"            element={<ClaimApprovals />} />
            <Route path="/admin/audit-logs"          element={<AuditLogs />} />
            <Route path="/admin/asset-inventory"     element={<AssetInventory />} />
            <Route path="/admin/shift-roster"        element={<ShiftRoster />} />
            <Route path="/admin/payroll"             element={<PayrollManagement />} />
            <Route path="/admin/hybrid-permissions"  element={<HybridPermissions />} />
            <Route path="/admin/manage-permissions"  element={<ManagePermissions />} />
            <Route path="/admin/services"            element={<AdminServiceManagement />} />
            <Route path="/admin/services/new"        element={<ServiceForm />} />
            <Route path="/admin/services/edit/:id"   element={<ServiceForm />} />
            <Route path="/admin/services/:id"        element={<ServiceDetails />} />

            {/* HR */}
            <Route path="/hr/employee-records"      element={<EmployeeRecords />} />
            <Route path="/hr/attendance-reports"    element={<AttendanceReports />} />
            <Route path="/hr/performance"           element={<Performance />} />
            <Route path="/hr/analytics"             element={<Analytics />} />
            <Route path="/hr/leave-application"     element={<LeaveApplication />} />
            <Route path="/hr/test-leave"            element={<TestLeave />} />
            <Route path="/hr/attendance-management" element={<HRAttendance />} />
            <Route path="/hr/expenses"              element={<ClaimApprovals />} />
            <Route path="/hr/payroll"               element={<PayrollManagement />} />
            <Route path="/hr/shift-roster"          element={<ShiftRoster />} />

            {/* Services */}
            <Route path="/services"         element={<ServiceList />} />
            <Route path="/services/create"  element={<ServiceForm />} />
            <Route path="/services/:id"     element={<ServiceDetails />} />

            {/* Employee CRUD */}
            <Route path="/employees/:id"    element={<EmployeeProfile />} />

            {/* Location */}
            <Route path="/location/tracking" element={<LiveLocation />} />
            <Route path="/location/live"     element={<LiveLocation />} />
            <Route path="/location/history"  element={<LocationHistory />} />
            <Route path="/location/geofence" element={<GeofenceManager />} />

            {/* Attendance */}
            <Route path="/employee/attendance" element={<AttendanceDashboard />} />

            {/* Reports */}
            <Route path="/reports/attendance"  element={<AttendanceAnalytics />} />
            <Route path="/reports/performance" element={<PerformanceReport />} />
            <Route path="/reports/financial"   element={<FinancialReport />} />
            <Route path="/reports/export"      element={<AttendanceAnalytics />} />

            {/* Notifications */}
            <Route path="/notifications"          element={<NotificationsPage />} />
            <Route path="/notifications/settings" element={<NotificationSettings />} />

            {/* API Docs */}
            <Route path="/api/docs" element={<ApiDocs />} />

            {/* Global quick-action routes */}
            <Route path="/profile"               element={<MyProfileEnhanced />} />
            <Route path="/settings"              element={<Settings />} />
            <Route path="/test-navigation"       element={<div style={{ padding: 50, fontSize: 24, textAlign: "center" }}>✅ Navigation Test Working!</div>} />
          </Route>

          {/* ── Home / Catch-all ─────────────────────────────────────── */}
          <Route path="/"  element={<LoginPortal />} />
          <Route path="*"  element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
