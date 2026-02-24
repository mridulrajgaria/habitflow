import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';
import HabitFlowLogo from './HabitFlowLogo';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/habits',    icon: ListChecks,       label: 'My Habits'  },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const Avatar = ({ size = 32 }) => (
    user?.avatar
      ? <img src={user.avatar} alt={user.name} style={{
          width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
          border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 2px 10px rgba(108,99,255,0.4)'
        }} />
      : <div className="user-avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
          {initials}
        </div>
  );

  return (
    <div className="layout">
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>

        {/* Logo area — X button only shows on mobile via CSS */}
        <div className="sidebar-logo">
          <HabitFlowLogo size={42} showText />
          <button className="mobile-close btn btn-ghost btn-icon" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="theme-toggle-wrap">
          <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </span>
            <span className="theme-toggle-label">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="user-info user-info-btn" onClick={() => setProfileOpen(true)} title="Edit profile">
            <Avatar size={34} />
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </button>
          <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-header">
          <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <HabitFlowLogo size={30} showText />
          <button className="btn btn-ghost btn-icon" onClick={() => setProfileOpen(true)}>
            <Avatar size={30} />
          </button>
        </div>

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  );
}
