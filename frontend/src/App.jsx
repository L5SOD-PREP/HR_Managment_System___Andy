import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import Departments from './pages/Departments';
import Positions from './pages/Positions';
import Users from './pages/Users';
import Report from './pages/Report';
import { Menu } from 'lucide-react';

function DashboardLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const pageTitle = (() => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    const map = {
      '/employees': 'Employees',
      '/departments': 'Departments',
      '/positions': 'Positions',
      '/users': 'Users',
      '/report': 'Reports',
    };
    if (path.startsWith('/employees/new')) return 'Add Employee';
    if (path.startsWith('/employees/')) return 'Edit Employee';
    return 'HRMS';
  })();

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={onLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sidebar-content">
        <div className="sidebar-topbar">
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
            <span className="page-title">{pageTitle}</span>
          </div>
          <div className="topbar-right">
            <span className="text-muted small">{user?.UserName}</span>
          </div>
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{height:'100vh',background:'#0f172a'}}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Employees />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/employees/new" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <EmployeeForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/employees/:id" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <EmployeeForm />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/departments" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Departments />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/positions" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Positions />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Users />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout}>
            <Report />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
