import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Search, Calendar, History, Star, LogOut, User, Menu } from 'lucide-react';
import DoctorSearch from './DoctorSearch';
import Booking from './Booking';
import AppointmentHistory from './AppointmentHistory';

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ paddingBottom: '32px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', 
                        margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <User color="white" size={40} />
                    </div>
                    <h3 style={{ fontSize: '18px' }}>{user.firstName} {user.lastName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Patient</p>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/patient/search" className={`sidebar-link ${location.pathname.includes('search') ? 'active' : ''}`}>
                        <Search size={20} /> Search Doctors
                    </Link>
                    <Link to="/patient/history" className={`sidebar-link ${location.pathname.includes('history') ? 'active' : ''}`}>
                        <History size={20} /> My Appointments
                    </Link>
                </nav>

                <button onClick={logout} className="sidebar-link" style={{ background: 'transparent', width: '100%', marginTop: 'auto', color: '#ef4444' }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="main-content">
                <Routes>
                    <Route path="search" element={<DoctorSearch />} />
                    <Route path="book/:doctorId" element={<Booking />} />
                    <Route path="history" element={<AppointmentHistory />} />
                    <Route path="/" element={<div className="glass-card" style={{ padding: '40px' }}>
                        <h1>Welcome to Smart Hospital, {user.firstName}!</h1>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Search for top doctors and book your appointments with ease.</p>
                        <div style={{ marginTop: '32px' }}>
                            <Link to="/patient/search" className="btn-primary">Find a Doctor</Link>
                        </div>
                    </div>} />
                </Routes>
            </main>
        </div>
    );
};

export default PatientDashboard;
