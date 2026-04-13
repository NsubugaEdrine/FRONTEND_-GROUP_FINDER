import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, MessageSquare, Save, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ groupsJoined: 0, groupsLed: 0, sessionsAttended: 0, postsMade: 0 });
  const [formData, setFormData] = useState({ fullName: '', email: '', program: '', yearOfStudy: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        program: user.program_of_study || '',
        yearOfStudy: user.year_of_study ? `Year ${user.year_of_study}` : ''
      });
    }

    const fetchStats = async () => {
      try {
        const [groupsRes, postsRes] = await Promise.all([
          api.get('/groups'),
          api.get('/posts/user/all').catch(() => ({ data: [] }))
        ]);

        const myGroups = groupsRes.data.filter(g => g.members?.some(m => m.id === user?.id));
        const ledGroups = myGroups.filter(g => g.members?.some(m => m.id === user?.id && m.GroupMember?.role === 'LEADER'));
        
        setStats({
          groupsJoined: myGroups.length,
          groupsLed: ledGroups.length,
          sessionsAttended: myGroups.length * 2 + 1, // Mock logic relative to groups
          postsMade: myGroups.length * 4,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate updating API
    alert('Profile updated successfully!');
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Profile...</div>;

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>
          {user?.name?.split(' ').map(n=>n[0]).join('') || 'U'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ backgroundColor: '#FCD34D', color: '#92400E', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {user?.program_of_study || 'Program Unknown'}
            </span>
            <span style={{ backgroundColor: '#F3F4F6', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
              Year {user?.year_of_study || '?'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Information Form Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Profile Information</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
              <input type="text" name="fullName" className="input-field" value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email</label>
              <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Program</label>
              <input type="text" name="program" className="input-field" value={formData.program} onChange={handleChange} disabled style={{ backgroundColor: '#F3F4F6', color: 'var(--text-muted)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Year of Study</label>
              <input type="text" name="yearOfStudy" className="input-field" value={formData.yearOfStudy} onChange={handleChange} disabled style={{ backgroundColor: '#F3F4F6', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>Save Changes</button>
          </div>
        </form>
      </div>

      {/* Activity Summary Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Activity Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          
          <div style={{ padding: '1.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <BookOpen size={24} color="var(--primary-color)" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.groupsJoined}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Groups Joined</p>
          </div>

          <div style={{ padding: '1.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <Users size={24} color="var(--primary-color)" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.groupsLed}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Groups Led</p>
          </div>

          <div style={{ padding: '1.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <Calendar size={24} color="var(--primary-color)" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.sessionsAttended}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sessions Attended</p>
          </div>

          <div style={{ padding: '1.5rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <MessageSquare size={24} color="var(--primary-color)" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.postsMade}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Posts Made</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
