import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, LogOut, User, LayoutDashboard, ListTodo } from 'lucide-react';
import DoctorSchedule from './DoctorSchedule';
import ManageAvailability from './ManageAvailability';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ paddingBottom: '32px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--secondary)', 
                        margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <User color="white" size={40} />
                    </div>
                    <h3 style={{ fontSize: '18px' }}>Dr. {user.firstName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Practitioner</p>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/doctor" className={`sidebar-link ${location.pathname === '/doctor' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard Overview
                    </Link>
                    <Link to="/doctor/appointments" className={`sidebar-link ${location.pathname.includes('appointments') ? 'active' : ''}`}>
                        <ListTodo size={20} /> My Appointments
                    </Link>
                    <Link to="/doctor/availability" className={`sidebar-link ${location.pathname.includes('availability') ? 'active' : ''}`}>
                        <Clock size={20} /> Slot Management
                    </Link>
                </nav>

                <button onClick={logout} className="sidebar-link" style={{ background: 'transparent', width: '100%', marginTop: 'auto', color: '#ef4444' }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="main-content">
                <Routes>
                    <Route path="appointments" element={<DoctorSchedule />} />
                    <Route path="availability" element={<ManageAvailability />} />
                    <Route path="/" element={<div className="glass-card" style={{ padding: '40px' }}>
                        <h1>Hello, Dr. {user.firstName}!</h1>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>You have appointments scheduled for today. Check your daily schedule.</p>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '20px' }}>
                            <Link to="/doctor/appointments" className="btn-primary" style={{ background: 'var(--primary)' }}>View Appointments</Link>
                            <Link to="/doctor/availability" className="btn-primary" style={{ background: 'var(--glass)' }}>Update Availability</Link>
                        </div>
                    </div>} />
                </Routes>
            </main>
        </div>
    );
};

export default DoctorDashboard;
