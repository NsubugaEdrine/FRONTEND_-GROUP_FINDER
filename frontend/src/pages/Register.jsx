import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        program_of_study: '',
        year_of_study: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating account...');
        setLoading(true);

        try {
            await register(formData);
            toast.success('Account created successfully!', { id: toastId });
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to register';
            toast.error(msg, { id: toastId });
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="main-content"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                padding: '2rem 1rem'
            }}
        >
            {/* PROFESSIONAL GLASS CARD */}
            <div
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    padding: '2rem',
                    borderRadius: '18px',
                    backdropFilter: 'blur(16px)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)'
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        marginBottom: '1.8rem',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        letterSpacing: '0.5px'
                    }}
                >
                    Create an Account
                </h2>

                {error && (
                    <div
                        style={{
                            color: 'var(--danger)',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* FULL NAME */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={iconStyle} />
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={iconStyle} />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* PROGRAM + YEAR */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Program</label>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    name="program_of_study"
                                    placeholder="e.g. BSCS"
                                    className="form-input"
                                    style={inputStyle}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label className="form-label">Year</label>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={18} style={iconStyle} />
                                <input
                                    type="number"
                                    name="year_of_study"
                                    placeholder="e.g. 2"
                                    min="1"
                                    max="6"
                                    className="form-input"
                                    style={inputStyle}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.9rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                        disabled={loading}
                    >
                        <UserPlus size={20} />
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '0.8rem'
                        }}
                        className="text-muted"
                    >
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

/* ===== CLEAN STYLE CONSTANTS ===== */
const inputStyle = {
    paddingLeft: '40px',
    height: '42px',
    borderRadius: '10px'
};

const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
};

export default Register;