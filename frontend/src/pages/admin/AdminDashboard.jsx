import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { LayoutDashboard, Users, Building2, BarChart3, LogOut, User, Settings } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import ManageDoctors from './ManageDoctors';
import ManageDepartments from './ManageDepartments';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ paddingBottom: '32px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', 
                        margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Settings color="white" size={40} />
                    </div>
                    <h3 style={{ fontSize: '18px' }}>Admin Panel</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>System Administrator</p>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/admin" className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Overview
                    </Link>
                    <Link to="/admin/analytics" className={`sidebar-link ${location.pathname.includes('analytics') ? 'active' : ''}`}>
                        <BarChart3 size={20} /> Analytics
                    </Link>
                    <Link to="/admin/doctors" className={`sidebar-link ${location.pathname.includes('doctors') ? 'active' : ''}`}>
                        <Users size={20} /> Doctors
                    </Link>
                    <Link to="/admin/departments" className={`sidebar-link ${location.pathname.includes('departments') ? 'active' : ''}`}>
                        <Building2 size={20} /> Departments
                    </Link>
                </nav>

                <button onClick={logout} className="sidebar-link" style={{ background: 'transparent', width: '100%', marginTop: 'auto', color: '#ef4444' }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="main-content">
                <Routes>
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="doctors" element={<ManageDoctors />} />
                    <Route path="departments" element={<ManageDepartments />} />
                    <Route path="/" element={<div className="glass-card" style={{ padding: '40px' }}>
                        <h1>System Administration Hub</h1>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Monitor hospital metrics, manage staff, and oversee operations.</p>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '20px' }}>
                            <Link to="/admin/analytics" className="btn-primary">View Full Analytics</Link>
                            <Link to="/admin/doctors" className="btn-primary" style={{ background: 'var(--glass)' }}>Manage Doctors</Link>
                        </div>
                    </div>} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
