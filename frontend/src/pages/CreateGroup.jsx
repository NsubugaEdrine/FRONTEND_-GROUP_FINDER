import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

const CreateGroup = () => {
  const [formData, setFormData] = useState({ 
    name: '', course_name_code: '', description: '', location: '',
    faculty: '', maxCapacity: 20, isVirtual: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups', formData);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to create group');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create a New Study Group</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Group Name</label>
            <input type="text" name="name" className="input-field" placeholder="e.g. Late Night Coders" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Course</label>
              <input type="text" name="course_name_code" className="input-field" placeholder="e.g. CSC1202" value={formData.course_name_code} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Faculty</label>
              <select name="faculty" className="input-field" value={formData.faculty} onChange={handleChange} required>
                <option value="">Select Faculty...</option>
                <option value="Computing">Computing</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts & Sci">Arts & Sciences</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Description (Goals, topics)</label>
            <textarea name="description" className="input-field" rows="4" placeholder="What will this group focus on?" value={formData.description} onChange={handleChange}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Meeting Location / Base Link</label>
              <input type="text" name="location" className="input-field" placeholder="e.g. Library Room 3 or Zoom Link" value={formData.location} onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Max Capacity</label>
              <input type="number" name="maxCapacity" className="input-field" min="2" max="100" value={formData.maxCapacity} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isVirtual" id="virtualCheck" checked={formData.isVirtual} onChange={handleChange} />
            <label htmlFor="virtualCheck" style={{ fontSize: '0.875rem', fontWeight: '500' }}>This is an Online/Virtual Group</label>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Cancel</Link>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
