import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Search, MapPin, Award, Star } from 'lucide-react';

const DoctorSearch = () => {
    const [doctors, setDoctors] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchDoctors = async (searchQuery = '') => {
        setLoading(true);
        try {
            const res = await API.get(`/patient/doctors/search?query=${searchQuery}`);
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors(query);
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Find a Doctor</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by name, specialization, or department..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ paddingLeft: '44px', width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Search</button>
                </form>
            </div>

            {loading ? <div style={{ textAlign: 'center' }}>Loading doctors...</div> : (
                <div className="grid-3">
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="glass-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '60px', height: '60px', borderRadius: '12px', 
                                    background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Award color="white" size={30} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px' }}>Dr. {doctor.user.firstName} {doctor.user.lastName}</h4>
                                    <p style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '500' }}>{doctor.specialization}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                        <span style={{ fontSize: '14px' }}>{doctor.averageRating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <MapPin size={16} /> {doctor.department.name}
                                </p>
                                <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
                            </div>

                            <Link to={`/patient/book/${doctor.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '14px' }}>
                                Book Appointment
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {doctors.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '40px' }}>No doctors found.</div>}
        </div>
    );
};

export default DoctorSearch;
