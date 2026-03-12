import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" />;
    return <Navigate to="/patient" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/admin/*" element={
                            <ProtectedRoute role="ADMIN">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/doctor/*" element={
                            <ProtectedRoute role="DOCTOR">
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/patient/*" element={
                            <ProtectedRoute role="PATIENT">
                                <PatientDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<HomeRedirect />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
