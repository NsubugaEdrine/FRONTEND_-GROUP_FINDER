import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusCircle, BookOpen, MapPin, AlignLeft, X } from 'lucide-react';

const CreateGroup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', course: '', description: '', meeting_location: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tId = toast.loading('Creating group...');
        setLoading(true);
        try {
            const res = await api.post('/groups', formData);
            toast.success('Group created successfully!', { id: tId });
            navigate(`/groups/${res.data.groupId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create group', { id: tId });
            setError(err.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Create a Study Group</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Group Name</label>
                        <div style={{ position: 'relative' }}>
                            <PlusCircle size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" name="name" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Course / Subject</label>
                        <div style={{ position: 'relative' }}>
                            <BookOpen size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" name="course" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Meeting Location</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" name="meeting_location" className="form-input" style={{ paddingLeft: '40px' }} placeholder="e.g. Library Room 2 or Zoom Link" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description / Focus</label>
                        <div style={{ position: 'relative' }}>
                            <AlignLeft size={18} style={{ position: 'absolute', left: '12px', top: '1.25rem', color: 'var(--text-muted)' }} />
                            <textarea name="description" className="form-input" style={{ paddingLeft: '40px' }} rows="4" onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/groups')}>
                            <X size={18} /> Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            <PlusCircle size={18} /> {loading ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroup;
