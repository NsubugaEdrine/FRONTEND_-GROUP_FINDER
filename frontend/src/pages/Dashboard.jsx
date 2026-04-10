import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, ArrowRight, PlusCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const [data, setData] = useState({
        myGroups: [],
        upcomingSessions: [],
        recentGroups: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard/student');

                setData({
                    myGroups: response.data?.myGroups || [],
                    upcomingSessions: response.data?.upcomingSessions || [],
                    recentGroups: response.data?.recentGroups || []
                });

            } catch (err) {
                console.error("Error fetching dashboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <div className="spinner"></div>;

    const firstName = user?.name?.split(' ')?.[0] || 'Student';

    return (
        <div className="main-content">

            {/* HEADER */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1>Welcome, {firstName}!</h1>
                    <p className="text-muted">Stay on top of your study goals today.</p>
                </div>

                <Link to="/groups/create" className="btn btn-primary">
                    <PlusCircle size={18} /> Create Group
                </Link>
            </header>

            {/* QUICK STATS */}
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#EEF2FF', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{data.myGroups.length}</h4>
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                                Groups Joined
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '12px', color: 'var(--secondary)' }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{data.upcomingSessions.length}</h4>
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                                Upcoming Sessions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#FFFBEB', padding: '0.75rem', borderRadius: '12px', color: '#F59E0B' }}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{user?.program_of_study || 'N/A'}</h4>
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                                Program
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* MAIN GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* GROUPS */}
                <section>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{ margin: 0 }}>My Study Groups</h2>

                        <Link to="/groups" className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {data.myGroups.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <Users size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                            <p className="text-muted">You haven't joined any study groups yet.</p>
                            <Link to="/groups" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                                Find your first group
                            </Link>
                        </div>
                    ) : (
                        <div className="grid-2">
                            {data.myGroups.map(group => (
                                <Link
                                    to={`/groups/${group.id}`}
                                    key={group.id}
                                    className="card"
                                    style={{ display: 'block', color: 'inherit' }}
                                >
                                    <h3 style={{ fontSize: '1.125rem' }}>{group.name}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                        {group.course}
                                    </p>

                                    <div style={{ marginTop: '1.5rem' }}>
                                        <span className="badge">Active Member</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* SESSIONS */}
                <section>
                    <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Sessions</h2>

                    {data.upcomingSessions.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p className="text-muted">No sessions scheduled.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.upcomingSessions.map(session => {

                                const date = session.session_date
                                    ? new Date(session.session_date).toLocaleDateString([], {
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : 'TBA';

                                return (
                                    <div key={session.id} className="glass-card" style={{ padding: '1rem' }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {session.group_name}
                                        </h4>

                                        <p style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: 'var(--primary)'
                                        }}>
                                            {date} @ {session.session_time}
                                        </p>

                                        <a
                                            href={session.location_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-secondary"
                                            style={{
                                                width: '100%',
                                                marginTop: '0.75rem',
                                                fontSize: '0.75rem',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            Join Session
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

            </div>

            {/* RECOMMENDED */}
            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Recommended for You</h2>

                <div className="grid-3">
                    {data.recentGroups.slice(0, 3).map(group => (
                        <div key={group.id} className="glass-card">
                            <h3 style={{ fontSize: '1.125rem' }}>{group.name}</h3>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                {group.course}
                            </p>

                            <div style={{ marginTop: '1.5rem' }}>
                                <Link to={`/groups/${group.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                                    View Group
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Dashboard;