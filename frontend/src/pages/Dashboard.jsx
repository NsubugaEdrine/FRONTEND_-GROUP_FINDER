import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const myGroups = groups.filter(g => g.members?.some(m => m.id === user?.id));
  const discoverGroups = groups.filter(g => 
    !myGroups.includes(g) && 
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.course_name_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Dashboard</h1>
        <Link to="/create-group" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={18} /> New Group
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Your Groups Section */}
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary-color)" /> My Study Groups
          </h2>
          {myGroups.length === 0 ? <p style={{color: 'var(--text-muted)'}}>You haven't joined any groups yet.</p> : null}
          {myGroups.map(g => (
            <Link key={g.id} to={`/group/${g.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontWeight: '600' }}>{g.name} ({g.course_name_code})</h3>
                  <span className={g.isVirtual ? "badge-online" : "badge-inperson"}>
                    {g.isVirtual ? "Online" : "In-Person"}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0' }}>{g.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>{g.members?.length || 0} / {g.maxCapacity} Members</span>
                  {g.faculty && <span>{g.faculty}</span>}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Upcoming Sessions Section */}
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--primary-color)" /> Upcoming Sessions
          </h2>
          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '60px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Apr</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>15</div>
            </div>
            <div>
              <h3 style={{ fontWeight: '600' }}>Data Structures Review</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Library Room 3, 2:00 PM</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
