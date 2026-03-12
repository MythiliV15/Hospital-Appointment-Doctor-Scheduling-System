import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';

const Booking = () => {
    const { doctorId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [availabilities, setAvailabilities] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await API.get(`/patient/doctors/${doctorId}`);
                setDoctor(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await API.get(`/patient/doctors/${doctorId}/availability?date=${date}`);
                setAvailabilities(res.data.filter(a => !a.isBooked));
            } catch (err) {
                console.error(err);
            }
        };
        if (date) fetchAvailability();
    }, [doctorId, date]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setLoading(true);
        try {
            await API.post(`/patient/appointments/book/${user.userId}`, {
                doctorId: doctorId,
                availabilityId: selectedSlot.id,
                reason: reason
            });
            setMessage('Appointment booked successfully!');
            setTimeout(() => navigate('/patient/history'), 2000);
        } catch (err) {
            setMessage('Error booking appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!doctor) return <div>Loading doctor details...</div>;

    return (
        <div>
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <ChevronLeft size={20} /> Back to Search
            </button>

            <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h2 style={{ marginBottom: '24px' }}>Book Appointment with Dr. {doctor.user.firstName} {doctor.user.lastName}</h2>
                    
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>1. Select Date</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{ paddingLeft: '44px', width: '100%', maxWidth: '300px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>2. Available Time Slots</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                            {availabilities.map(slot => (
                                <button 
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    style={{
                                        padding: '12px',
                                        background: selectedSlot?.id === slot.id ? 'var(--primary)' : 'var(--glass)',
                                        border: `1px solid ${selectedSlot?.id === slot.id ? 'var(--primary)' : 'var(--border)'}`,
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                >
                                    {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                </button>
                            ))}
                            {availabilities.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No slots available for this date.</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>3. Reason for Visit</label>
                        <textarea 
                            placeholder="Briefly describe your symptoms or reason for the visit..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{ width: '100%', height: '100px', resize: 'none' }}
                        ></textarea>
                    </div>

                    {message && <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', background: message.includes('success') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.includes('success') ? '#10b981' : '#ef4444' }}>{message}</div>}

                    <button 
                        className="btn-primary" 
                        disabled={!selectedSlot || loading}
                        onClick={handleBook}
                        style={{ width: '100%', opacity: !selectedSlot ? 0.5 : 1 }}
                    >
                        {loading ? 'Processing...' : 'Confirm Appointment'}
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '16px' }}>Doctor Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                        <p><strong>Department:</strong> {doctor.department.name}</p>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Consultation Fee:</strong> ${doctor.consultationFee}</p>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Important: Please arrive 15 minutes before your scheduled time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
