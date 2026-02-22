import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import HelpPage from './pages/HelpPage';
import PurchasePage from './pages/PurchasePage';
import Messaging from './pages/Messaging';
import LeaveApplication from './pages/LeaveApplication';
import AnalyticsPortal from './pages/AnalyticsPortal';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFees from './pages/admin/AdminFees';
import AdminPayroll from './pages/admin/AdminPayroll';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyTimetable from './pages/faculty/FacultyTimetable';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyProfile from './pages/faculty/FacultyProfile';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyResources from './pages/faculty/FacultyResources';
import FacultyPayroll from './pages/faculty/FacultyPayroll';
import FacultyLayout from './layouts/FacultyLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentProfile from './pages/student/StudentProfile';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentExams from './pages/student/StudentExams';
import StudentNotices from './pages/student/StudentNotices';
import StudentFees from './pages/student/StudentFees';
import FeePaymentPage from './pages/student/FeePaymentPage';
import CourseContentPage from './pages/student/CourseContentPage';
import StudentLayout from './layouts/StudentLayout';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark">
        <ToastContainer theme="dark" position="top-right" />
        <Routes>
          {/* Public Layout with Navbar */}
          <Route element={<><Navbar /><div className="flex-grow"><Outlet /></div></>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/purchase/:courseId" element={<PurchasePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Other Role Dashboards */}
          </Route>

          {/* Faculty Layout */}
          <Route element={<ProtectedRoute roles={['faculty', 'admin']} />}>
            <Route path="/faculty" element={<FacultyLayout />}>
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="profile" element={<FacultyProfile />} />
              <Route path="attendance" element={<FacultyAttendance />} />
              <Route path="timetable" element={<FacultyTimetable />} />
              <Route path="students" element={<FacultyStudents />} />
              <Route path="assignments" element={<FacultyAssignments />} />
              <Route path="resources" element={<FacultyResources />} />
              <Route path="notices" element={<StudentNotices />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="leave" element={<LeaveApplication />} />
              <Route path="analytics" element={<AnalyticsPortal />} />
              <Route path="payroll" element={<FacultyPayroll />} />
              <Route path="grades" element={<FacultyStudents />} /> {/* Reusing component for now */}
              <Route path="classes" element={<FacultyTimetable />} /> {/* Reusing component for now */}
            </Route>
          </Route>

          {/* Student Layout */}
          <Route element={<ProtectedRoute roles={['student', 'admin']} />}>
            <Route path="/student/course/:courseId" element={<CourseContentPage />} />
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="timetable" element={<StudentTimetable />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="notices" element={<StudentNotices />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="leave" element={<LeaveApplication />} />
              <Route path="analytics" element={<AnalyticsPortal />} />
              <Route path="fees" element={<StudentFees />} />
              <Route path="pay-fee/:feeId" element={<FeePaymentPage />} />
            </Route>
          </Route>

          {/* Admin Layout (No Main Navbar) */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="leave" element={<LeaveApplication />} />
              <Route path="finance" element={<AdminFees />} /> {/* Fallback or legacy */}
              <Route path="fees" element={<AdminFees />} />
              <Route path="payroll" element={<AdminPayroll />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
