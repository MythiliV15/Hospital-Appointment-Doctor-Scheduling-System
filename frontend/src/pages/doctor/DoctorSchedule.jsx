import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, User, Info } from 'lucide-react';

const DoctorSchedule = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            // Assume we can get doctorId from somewhere or we need to fetch doctor profile first
            // For now, let's assume we use a specialized endpoint for the logged-in doctor
            const res = await API.get(`/doctor/${user.userId}/appointments`); 
            // Note: In real app, user.userId is the User ID. The mapping might need the Doctor ID.
            // I'll adjust the backend to handle user id to doctor id mapping or just use a generic endpoint.
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/doctor/appointments/${id}/status?status=${status}`);
            fetchAppointments();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Patient Appointments</h2>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {appointments.map(appt => (
                        <div key={appt.id} className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '50px', height: '50px', borderRadius: '50%', background: 'var(--glass)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px' }}>{appt.patient.firstName} {appt.patient.lastName}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                        {appt.appointmentDate} | {appt.startTime.substring(0, 5)} - {appt.endTime.substring(0, 5)}
                                    </p>
                                    <p style={{ fontSize: '13px', marginTop: '4px' }}><strong>Reason:</strong> {appt.reason}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                                    {appt.status}
                                </span>
                                
                                {appt.status === 'PENDING' && (
                                    <>
                                        <button onClick={() => updateStatus(appt.id, 'CONFIRMED')} style={{ background: 'transparent', color: '#10b981' }} title="Confirm">
                                            <CheckCircle size={28} />
                                        </button>
                                        <button onClick={() => updateStatus(appt.id, 'REJECTED')} style={{ background: 'transparent', color: '#ef4444' }} title="Reject">
                                            <XCircle size={28} />
                                        </button>
                                    </>
                                )}

                                {appt.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => updateStatus(appt.id, 'COMPLETED')} 
                                        className="btn-primary" 
                                        style={{ fontSize: '13px', padding: '8px 16px' }}
                                    >
                                        Mark Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>No appointment requests.</div>}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;
