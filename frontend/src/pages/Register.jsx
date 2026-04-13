import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    program_of_study: '',
    year_of_study: '',
    role: 'STUDENT',
    admin_signup_code: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const canCreateAdmin = user?.role === 'ADMIN';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        role: formData.role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
        admin_signup_code: formData.role === 'ADMIN' ? formData.admin_signup_code : ''
      };
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Create an Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" name="name" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" name="email" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Program</label>
              <input type="text" name="program_of_study" className="input-field" placeholder="e.g. BSCS" value={formData.program_of_study} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Year of Study</label>
              <input type="number" name="year_of_study" className="input-field" min="1" max="5" placeholder="1" value={formData.year_of_study} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Account Type</label>
            <select
              name="role"
              className="input-field"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Admin signup requires an admin signup code or existing admin access.
            </p>
          </div>
          {formData.role === 'ADMIN' && !canCreateAdmin ? (
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Admin Signup Code
              </label>
              <input
                type="password"
                name="admin_signup_code"
                className="input-field"
                placeholder="Enter admin signup code"
                value={formData.admin_signup_code}
                onChange={handleChange}
                required
              />
            </div>
          ) : null}
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" name="password" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
