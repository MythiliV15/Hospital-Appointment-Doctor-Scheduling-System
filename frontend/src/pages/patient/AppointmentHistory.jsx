import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, Star, MessageSquare } from 'lucide-react';

const AppointmentHistory = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState(null); // stores appointment if modal open
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchAppointments = async () => {
        try {
            const res = await API.get(`/patient/${user.userId}/appointments`);
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user.userId]);

    const handleReview = async () => {
        try {
            await API.post(`/patient/${user.userId}/doctors/${reviewModal.doctor.id}/review`, {
                rating,
                comment
            });
            setReviewModal(null);
            alert('Review submitted! Thank you.');
        } catch (err) {
            alert('Failed to submit review.');
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>My Appointment History</h2>

            {loading ? <p>Loading appointments...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {appointments.map(appt => (
                        <div key={appt.id} className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ background: 'var(--glass)', padding: '16px', borderRadius: '12px', textAlign: 'center', minWidth: '100px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '20px' }}>{new Date(appt.appointmentDate).getDate()}</div>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--primary)' }}>
                                        {new Date(appt.appointmentDate).toLocaleString('default', { month: 'short' })}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>Dr. {appt.doctor.user.firstName} {appt.doctor.user.lastName}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{appt.doctor.specialization}</p>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {appt.startTime.substring(0, 5)} - {appt.endTime.substring(0, 5)}
                                        </span>
                                        <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                {appt.status === 'COMPLETED' && (
                                    <button 
                                        onClick={() => setReviewModal(appt)}
                                        className="btn-primary" 
                                        style={{ background: 'var(--accent)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <Star size={16} /> Rate Doctor
                                    </button>
                                )}
                                <button className="btn-primary" style={{ background: 'var(--glass)', color: 'white', fontSize: '14px' }}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>You haven't booked any appointments yet.</div>}
                </div>
            )}

            {/* Simple Review Modal */}
            {reviewModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Rate Dr. {reviewModal.doctor.user.firstName}</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Rating (1-5)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[1,2,3,4,5].map(nu => (
                                    <Star 
                                        key={nu} 
                                        size={30} 
                                        onClick={() => setRating(nu)}
                                        fill={nu <= rating ? "#f59e0b" : "none"}
                                        color="#f59e0b"
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Comment</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ width: '100%', height: '80px' }}
                                placeholder="Share your experience..."
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleReview} className="btn-primary" style={{ flex: 1 }}>Submit</button>
                            <button onClick={() => setReviewModal(null)} style={{ background: 'transparent', color: 'white' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;
