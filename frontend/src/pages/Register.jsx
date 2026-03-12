import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'PATIENT' // Default to patient
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email might already exist.');
        }
    };

    return (
        <div className="register-container" style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        background: 'var(--secondary)', 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <UserPlus color="white" size={32} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join our smart hospital system</p>
                </div>

                {error && <div style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <input 
                                type="text" 
                                placeholder="First Name" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input 
                                type="text" 
                                placeholder="Last Name" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ width: '100%' }}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ width: '100%' }}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        style={{ width: '100%' }}
                        required
                    />
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                        Create Account
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
