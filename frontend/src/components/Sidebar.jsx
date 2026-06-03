import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, LogOut, ShieldCheck, X
} from 'lucide-react';

const navItems = [
  { label: 'MAIN', items: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { label: 'MANAGEMENT', items: [
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/positions', label: 'Positions', icon: Briefcase },
    { path: '/users', label: 'Users', icon: ShieldCheck },
    { path: '/report', label: 'Reports', icon: FileText },
  ]},
];

export default function Sidebar({ user, onLogout, open, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className={`sidebar-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-header">
          <Building2 />
          <span>DAB HRMS</span>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.UserName ? user.UserName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="name">{user.UserName || 'User'}</div>
              <div className="role">Administrator</div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link${isActive(item.path) ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={onLogout} style={{width:'100%',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
            <LogOut />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
