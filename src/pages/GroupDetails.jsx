import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Info, Users, Calendar, MessageSquare, LogOut, UserPlus, Trash2, Edit3, Save, X } from 'lucide-react';

const GroupDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    
    // Forms state
    const [newPost, setNewPost] = useState('');
    const [sessionForm, setSessionForm] = useState({ session_date: '', session_time: '', location_link: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', course: '', description: '', meeting_location: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [gRes, sRes, pRes] = await Promise.all([
                api.get(`/groups/${id}`),
                api.get(`/groups/${id}/sessions`),
                api.get(`/groups/${id}/posts`)
            ]);
            setGroup(gRes.data);
            setSessions(sRes.data);
            setPosts(pRes.data);
            setEditForm({
                name: gRes.data.name,
                course: gRes.data.course,
                description: gRes.data.description,
                meeting_location: gRes.data.meeting_location
            });
        } catch (error) {
            console.error("Failed to load group details", error);
            if(error.response?.status === 404) navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const isMember = group?.members?.some(m => m.id === user?.id);
    const isLeader = group?.creator_id === user?.id;

    const handleJoin = async () => {
        const tId = toast.loading('Joining group...');
        try {
            await api.post(`/groups/${id}/join`);
            toast.success('You are now a member!', { id: tId });
            fetchGroupData();
        } catch(e) { toast.error(e.response?.data?.message || 'Error joining', { id: tId }); }
    };
 
    const handleLeave = async () => {
        if(!window.confirm("Are you sure you want to leave this group?")) return;
        const tId = toast.loading('Leaving group...');
        try {
            await api.post(`/groups/${id}/leave`);
            toast.success('You have left the group', { id: tId });
            navigate('/dashboard');
        } catch(e) { toast.error(e.response?.data?.message || 'Error leaving', { id: tId }); }
    };
 
    const handleRemoveMember = async (userId) => {
        if(!window.confirm("Remove this member?")) return;
        const tId = toast.loading('Removing member...');
        try {
            await api.delete(`/groups/${id}/members/${userId}`);
            toast.success('Member removed', { id: tId });
            fetchGroupData();
        } catch(e) { toast.error(e.response?.data?.message || 'Error removing', { id: tId }); }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/groups/${id}/posts`, { content: newPost });
            setNewPost('');
            toast.success('Post shared');
            fetchGroupData();
        } catch(e) { toast.error('Error posting'); }
        finally { setSubmitting(false); }
    };
 
    const handleCreateSession = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/groups/${id}/sessions`, sessionForm);
            setSessionForm({ session_date: '', session_time: '', location_link: '', description: '' });
            toast.success('Session scheduled');
            fetchGroupData();
            setActiveTab('sessions');
        } catch(e) { toast.error('Error creating session'); }
        finally { setSubmitting(false); }
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/groups/${id}`, editForm);
            toast.success('Group settings updated');
            setIsEditing(false);
            fetchGroupData();
        } catch(e) { toast.error('Error updating group'); }
        finally { setSubmitting(false); }
    };

    if (loading) return <div className="spinner"></div>;
    if (!group) return <div>Group not found</div>;

    return (
        <div className="main-content">
            <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(to right, #4F46E5, #8B5CF6)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ color: 'white' }}>{group.name}</h1>
                        <p style={{ opacity: 0.9 }}>{group.course}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isLeader && (
                            <button onClick={() => setIsEditing(!isEditing)} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                {isEditing ? <X size={18} /> : <Edit3 size={18} />} {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        )}
                        {isMember ? (
                            <button onClick={handleLeave} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                <LogOut size={18} /> Leave
                            </button>
                        ) : (
                            <button onClick={handleJoin} className="btn" style={{ background: 'white', color: 'var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <UserPlus size={18} /> Join Group
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                {[
                    { id: 'info', label: 'Info', icon: <Info size={16} /> },
                    { id: 'members', label: `Members (${group.members.length})`, icon: <Users size={16} /> },
                    { id: 'sessions', label: 'Sessions', icon: <Calendar size={16} /> },
                    { id: 'posts', label: 'Posts', icon: <MessageSquare size={16} /> }
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            {isEditing && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Edit Group Settings</h3>
                    <form onSubmit={handleUpdateGroup}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Group Name</label>
                                <input className="form-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Course</label>
                                <input className="form-input" value={editForm.course} onChange={e => setEditForm({...editForm, course: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meeting Location</label>
                            <input className="form-input" value={editForm.meeting_location} onChange={e => setEditForm({...editForm, meeting_location: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" rows="4" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Save size={18} /> {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'info' && (
                <div className="card">
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>About this Group</h3>
                    <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.6' }}>{group.description}</p>
                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '1rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>LOCATION</p>
                            <p style={{ fontWeight: 600 }}>{group.meeting_location || 'Not specified'}</p>
                        </div>
                        <div className="glass-card" style={{ padding: '1rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>CREATED ON</p>
                            <p style={{ fontWeight: 600 }}>{new Date(group.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'members' && (
                <div className="card">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {group.members.map(m => (
                            <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <strong>{m.name}</strong> 
                                    {m.id === group.creator_id && <span className="badge" style={{ marginLeft: '0.5rem' }}>Leader</span>}
                                </div>
                                {isLeader && m.id !== user.id && (
                                    <button onClick={() => handleRemoveMember(m.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                                        <Trash2 size={14} /> Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'sessions' && (
                <div>
                    {isLeader && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Schedule New Session</h3>
                            <form onSubmit={handleCreateSession} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="date" className="form-input" required value={sessionForm.session_date} onChange={e => setSessionForm({...sessionForm, session_date: e.target.value})} />
                                <input type="time" className="form-input" required value={sessionForm.session_time} onChange={e => setSessionForm({...sessionForm, session_time: e.target.value})} />
                                <input type="text" className="form-input" placeholder="Location or Link" style={{ gridColumn: 'span 2' }} value={sessionForm.location_link} onChange={e => setSessionForm({...sessionForm, location_link: e.target.value})} />
                                <input type="text" className="form-input" placeholder="Topic / Description" style={{ gridColumn: 'span 2' }} value={sessionForm.description} onChange={e => setSessionForm({...sessionForm, description: e.target.value})} />
                                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Schedule</button>
                            </form>
                        </div>
                    )}
                    <div className="grid-2">
                        {sessions.length === 0 ? <p className="text-muted">No sessions scheduled.</p> : sessions.map(s => (
                            <div key={s.id} className="card">
                                <h3>{new Date(s.session_date).toLocaleDateString()} at {s.session_time}</h3>
                                <p style={{ margin: '0.5rem 0' }}>{s.description}</p>
                                <p className="text-muted">Location: {s.location_link}</p>
                                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Scheduled by {s.creator_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'posts' && (
                <div>
                    {isMember ? (
                        <form onSubmit={handlePost} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Share something with the group..." 
                                style={{ flex: 1 }} 
                                required 
                                value={newPost}
                                onChange={e => setNewPost(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    ) : (
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>You must join the group to view and add posts.</p>
                    )}

                    {isMember && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {posts.length === 0 ? <p className="text-muted">No posts yet. Be the first to start a conversation!</p> : posts.map(p => (
                                <div key={p.id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                                                {p.author_name[0]}
                                            </div>
                                            <strong>{p.author_name}</strong>
                                        </div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(p.created_at).toLocaleString()}</span>
                                    </div>
                                    <p style={{ lineHeight: '1.5' }}>{p.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
