import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', program_of_study: '', year_of_study: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating account...');
        setLoading(true);
        try {
            await register(formData);
            toast.success('Account created successfully!', { id: toastId });
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to register', { id: toastId });
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Create an Account</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" name="name" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" name="email" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" name="password" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Program of Study</label>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="text" name="program_of_study" placeholder="e.g. BSCS" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Year of Study</label>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="number" name="year_of_study" placeholder="e.g. 2" min="1" max="6" className="form-input" style={{ paddingLeft: '40px' }} required onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
                        <UserPlus size={20} /> {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }} className="text-muted">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
