import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        setLoading(true);

        try {
            await login(credentials.email, credentials.password);
            toast.success('Welcome back!', { id: toastId });
            navigate('/');
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to login';
            toast.error(message, { id: toastId });
            setError(message);
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
                padding: '20px'
            }}
        >
            <div className="glass-card">
                <h2 className="glass-title">Welcome Back</h2>
                <p className="glass-subtitle">
                    Sign in to continue to Study Group Finder
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        <LogIn size={20} />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="register-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="register-link">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>

            {/* Component-Specific Styling */}
            <style jsx>{`
                .glass-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 2.5rem;
                    border-radius: 18px;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease-in-out;
                }

                .glass-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
                }

                .glass-title {
                    text-align: center;
                    margin-bottom: 0.5rem;
                    color: var(--primary);
                    font-weight: 600;
                }

                .glass-subtitle {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }

                .error-message {
                    background: rgba(255, 0, 0, 0.1);
                    color: var(--danger);
                    padding: 0.6rem;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-label {
                    display: block;
                    margin-bottom: 0.4rem;
                    font-weight: 500;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .form-input {
                    width: 100%;
                    height: 44px;
                    padding-left: 40px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text);
                    outline: none;
                    transition: all 0.3s ease;
                }

                .form-input::placeholder {
                    color: var(--text-muted);
                }

                .form-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
                }

                .login-btn {
                    width: 100%;
                    margin-top: 1.2rem;
                    padding: 0.75rem;
                    border-radius: 10px;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }

                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .register-text {
                    text-align: center;
                    margin-top: 1rem;
                    color: var(--text-muted);
                }

                .register-link {
                    color: var(--primary);
                    font-weight: 500;
                    text-decoration: none;
                }

                .register-link:hover {
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .glass-card {
                        padding: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;