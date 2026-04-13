import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Settings, LogOut, Search, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--sidebar-hover)' }}>
          <img
            src="/study-group-finder-logo.png"
            alt="STUDY_GROUP_FINDER Logo"
            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>STUDY_GROUP_FINDER</span>
        </div>
        
        <nav style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Main Menu</div>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={18} /> Browse Groups
          </NavLink>
          <NavLink to="/create-group" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Plus size={18} /> Create Group
          </NavLink>
          <NavLink to="/chatroom" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MessageCircle size={18} /> Chatroom
          </NavLink>
        </nav>

        <nav style={{ paddingTop: '1rem', borderTop: '1px solid var(--sidebar-hover)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Admin</div>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} /> Admin Panel
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ padding: '0.75rem 0' }}>
            <UserPlus size={18} /> My Profile
          </NavLink>
          <NavLink to="/login" className="nav-link" style={{ color: 'var(--text-muted)', padding: '0.75rem 0' }} onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>
            <LogOut size={18} /> Log Out
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>
              {user?.name || 'User'}
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sidebar-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              M
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
