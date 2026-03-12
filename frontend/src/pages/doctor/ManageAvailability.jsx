import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';

const ManageAvailability = () => {
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({
        availableDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00'
    });

    const fetchSlots = async () => {
        try {
            // Fetch using current logged in user's ID
            const res = await API.get(`/doctor/availability?userId=${user.userId}`);
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/doctor/availability', {
                ...formData,
                doctorId: user.userId, // Map correctly in backend
                isBooked: false
            });
            fetchSlots();
        } catch (err) {
            alert('Error adding slot');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/doctor/availability/${id}`);
            fetchSlots();
        } catch (err) {
            alert('Error deleting slot');
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Manage Your Availability</h2>

            <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>Add New Slot</h3>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Date</label>
                            <input 
                                type="date" 
                                value={formData.availableDate}
                                onChange={(e) => setFormData({...formData, availableDate: e.target.value})}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Start</label>
                                <input 
                                    type="time" 
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>End</label>
                                <input 
                                    type="time" 
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Plus size={20} /> Add Slot
                        </button>
                    </form>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Your Scheduled Slots</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Date</th>
                                    <th style={{ padding: '12px' }}>Time Range</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slots.map(slot => (
                                    <tr key={slot.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px' }}>{slot.availableDate}</td>
                                        <td style={{ padding: '12px' }}>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ 
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                                                background: slot.isBooked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                color: slot.isBooked ? '#ef4444' : '#10b981'
                                            }}>
                                                {slot.isBooked ? 'Booked' : 'Available'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button 
                                                disabled={slot.isBooked}
                                                onClick={() => handleDelete(slot.id)}
                                                style={{ background: 'transparent', color: slot.isBooked ? 'var(--text-muted)' : '#ef4444' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {slots.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No slots added yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAvailability;
