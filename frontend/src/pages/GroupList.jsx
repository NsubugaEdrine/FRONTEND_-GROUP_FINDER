import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Search, Plus, Users, BookOpen, ArrowRight } from 'lucide-react';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchGroups = async (query = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/groups?search=${query}`);
            setGroups(res.data);
        } catch (error) {
            console.error("Failed to fetch groups", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGroups(search);
    };

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Explore Study Groups</h1>
                <Link to="/groups/create" className="btn btn-primary">
                    <Plus size={18} /> Create New Group
                </Link>
            </div>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Search by course name, group title, or topic..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '48px', height: '52px' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 2rem' }}>Search Groups</button>
            </form>

            {loading ? <div className="spinner"></div> : (
                <div className="grid-3">
                    {groups.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }} className="card">
                            <Users size={48} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                            <p className="text-muted">No groups found matching your search.</p>
                        </div>
                    ) : groups.map(group => (
                        <div key={group.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                    <BookOpen size={16} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.course}</span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{group.name}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}>{group.description?.substring(0, 100)}...</p>
                            </div>
                            
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <Users size={16} />
                                    <span>{group.member_count} Members</span>
                                </div>
                                <Link to={`/groups/${group.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                                    Details <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupList;
