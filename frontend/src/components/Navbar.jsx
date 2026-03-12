import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Hospital, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'var(--bg-card)',
            backdropFilter: 'var(--glass-blur)',
            padding: '16px 32px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    background: 'var(--primary)',
                    padding: '8px',
                    borderRadius: '8px'
                }}>
                    <Hospital size={24} color="white" />
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    HMS <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>Smart</span>
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--glass)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UserIcon size={18} />
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: '600' }}>{user.firstName}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '12px' }}>({user.role})</span>
                    </div>
                </div>
                
                <button 
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '8px 16px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        fontWeight: '600'
                    }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
