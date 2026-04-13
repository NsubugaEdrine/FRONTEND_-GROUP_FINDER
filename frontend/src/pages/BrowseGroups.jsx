import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BrowseGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
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

  const handleJoinGroup = async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      const res = await api.get('/groups');
      setGroups(res.data || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join group');
    }
  };

  const discoverGroups = groups.filter(g => 
    !g.members?.some(m => m.id === user?.id) && 
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.course_name_code.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (facultyFilter === '' || g.faculty === facultyFilter)
  );

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Browse Study Groups</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Find and join study groups that match your courses.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 3 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search by group name, course code, or course name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <select 
            className="input-field" 
            value={facultyFilter} 
            onChange={(e) => setFacultyFilter(e.target.value)}
          >
            <option value="">All Faculties</option>
            <option value="Computing">Computing</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Arts & Sci">Arts & Sciences</option>
          </select>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{discoverGroups.length} groups found</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {discoverGroups.map(g => (
          <div key={g.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '12px', borderColor: 'var(--border-color)', borderWidth: '1px', borderStyle: 'solid', boxShadow: 'none' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{g.name}</h3>
                <span className={g.isVirtual ? "badge-online" : "badge-inperson"} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                  {g.isVirtual ? <><Globe size={12} /> Online</> : <><MapPin size={12} /> In-Person</>}
                </span>
              </div>
              
              <p style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
                {g.course_name_code} {g.faculty && `— ${g.faculty}`}
              </p>
              
              <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {g.description || 'No description provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Users size={16} /> <span>{g.members?.length || 0}/{g.maxCapacity}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  onClick={() => handleJoinGroup(g.id)}
                >
                  Join Group
                </button>
                <Link 
                  to={`/group/${g.id}`} 
                  style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '6px', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    textDecoration: 'none' 
                  }}
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseGroups;
