import React, { useContext } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link
} from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import {
    LayoutDashboard,
    Users,
    User,
    LogOut,
    LogIn,
    UserPlus
} from 'lucide-react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupList from './pages/GroupList';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';

/* ================= NAVBAR ================= */
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                StudyGroup Finder
            </Link>

            <div className="nav-links">

                {user ? (
                    <>
                        <Link to="/dashboard" className="btn btn-secondary" style={{ border: 'none' }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>

                        <Link to="/groups" className="btn btn-secondary" style={{ border: 'none' }}>
                            <Users size={18} /> Discover
                        </Link>

                        <span
                            className="text-muted"
                            style={{
                                marginLeft: '1rem',
                                borderLeft: '1px solid var(--border)',
                                paddingLeft: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <User size={16} />
                            Welcome, {user?.name || 'User'}
                        </span>

                        <button
                            className="btn btn-secondary"
                            onClick={logout}
                            style={{ color: 'var(--danger)' }}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">
                            <LogIn size={18} /> Login
                        </Link>

                        <Link to="/register" className="btn btn-primary">
                            <UserPlus size={18} /> Sign Up
                        </Link>
                    </>
                )}

            </div>
        </nav>
    );
};

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

/* ================= APP ================= */
function App() {
    return (
        <Router>
            <div className="app-container">

                <Navbar />

                <Toaster position="top-right" />

                <Routes>

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups"
                        element={
                            <ProtectedRoute>
                                <GroupList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups/create"
                        element={
                            <ProtectedRoute>
                                <CreateGroup />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups/:id"
                        element={
                            <ProtectedRoute>
                                <GroupDetails />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </div>
        </Router>
    );
}

export default App;