import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Calendar, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({ topic: '', date: '', time: '', location: '' });
  const [newPost, setNewPost] = useState('');

  const loadData = async () => {
    try {
      const [groupRes, sessionsRes, postsRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/sessions/group/${id}`),
        api.get(`/posts/group/${id}`)
      ]);
      setGroup(groupRes.data);
      setSessions(sessionsRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/sessions/group/${id}`, sessionForm);
      setShowSessionModal(false);
      loadData();
    } catch(err) {
      alert('Failed to schedule session');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await api.post(`/posts/group/${id}`, { content: newPost });
      setNewPost('');
      loadData();
    } catch(err) {
      alert('Failed to post message');
    }
  };
  
  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/groups/${id}/members/${userId}`);
      loadData();
    } catch(err) {
      alert('Failed to remove member. Are you the leader?');
    }
  };

  const handleAssignLeader = async (userId) => {
    try {
      await api.put(`/groups/${id}/leader/${userId}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign group leader');
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Group...</div>;
  if (!group) return <div className="container" style={{ padding: '2rem' }}>Group not found.</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <header className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{group.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{group.course_name_code} • {group.members?.length || 0} Members</p>
          <p style={{ marginTop: '0.5rem' }}>{group.description}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Sessions & Members Panel */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Sessions Panel */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary-color)" /> Study Sessions
            </h2>
            {sessions.map(s => (
              <div key={s.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600' }}>{s.topic || s.description}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.date} at {s.time}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>📍 {s.location}</p>
              </div>
            ))}
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowSessionModal(true)}>
              Schedule Session
            </button>
          </div>

          {/* Members Panel */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary-color)" /> Manage Members
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {group.members?.map(m => (
                 <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                 <span>
                   {m.name} {m.id === user?.id ? '(You)' : ''}
                   {m.GroupMember?.role === 'LEADER' ? ' - Leader' : ''}
                 </span>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   {user?.role === 'ADMIN' && m.GroupMember?.role !== 'LEADER' && (
                     <button
                       onClick={() => handleAssignLeader(m.id)}
                       style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: '500' }}
                     >
                       Make Leader
                     </button>
                   )}
                   {m.id !== user?.id && (
                     <button onClick={() => handleRemoveMember(m.id)} style={{ color: 'var(--danger-color)', fontSize: '0.75rem', fontWeight: '500' }}>
                       Remove
                     </button>
                   )}
                 </div>
               </div>
              ))}
            </div>
          </div>

        </section>

        {/* Discussion Panel */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--primary-color)" /> Discussion Board
          </h2>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
            {posts.filter(p => !p.parentId).map(post => (
              <div key={post.id} style={{ backgroundColor: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{post.author?.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '0.875rem' }}>{post.content}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '500' }}>Reply</button>
                </div>
                
                {/* Nested Replies */}
                {posts.filter(reply => reply.parentId === post.id).map(reply => (
                  <div key={reply.id} style={{ marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{reply.author?.name}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <form onSubmit={handlePost} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Type a message..." 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>

      {/* Schedule Session Modal */}
      {showSessionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Schedule Session</h2>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Topic</label>
                <input type="text" className="input-field" required value={sessionForm.topic} onChange={e => setSessionForm({...sessionForm, topic: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Date</label>
                  <input type="date" className="input-field" required value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Time</label>
                  <input type="time" className="input-field" required value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Location / Link</label>
                <input type="text" className="input-field" required value={sessionForm.location} onChange={e => setSessionForm({...sessionForm, location: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowSessionModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
