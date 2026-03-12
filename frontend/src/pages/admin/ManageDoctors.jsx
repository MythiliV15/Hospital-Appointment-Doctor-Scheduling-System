import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Trash2, UserPlus } from 'lucide-react';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [depts, setDepts] = useState([]);
    const [formData, setFormData] = useState({
        email: '', password: 'doctor123', firstName: '', lastName: '', phoneNumber: '',
        departmentId: '', specialization: '', qualification: '', fee: 50
    });

    const fetchData = async () => {
        try {
            const [docRes, deptRes] = await Promise.all([
                API.get('/patient/doctors/search?query='),
                API.get('/departments')
            ]);
            setDoctors(docRes.data);
            setDepts(deptRes.data);
            if (deptRes.data.length > 0 && !formData.departmentId) {
                setFormData(prev => ({...prev, departmentId: deptRes.data[0].id}));
            }
        } catch (err) { 
            console.error("Error fetching data:", err); 
            // If one fails, try to fetch departments separately as a fallback
            try {
                const deptRes = await API.get('/departments');
                setDepts(deptRes.data);
            } catch (deptErr) {
                console.error("Fallback dept fetch failed:", deptErr);
            }
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/admin/doctors?departmentId=${formData.departmentId}&specialization=${formData.specialization}&qualification=${formData.qualification}&fee=${formData.fee}&bio=${encodeURIComponent(formData.bio || '')}`, {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                role: 'DOCTOR'
            });
            alert('Doctor added successfully!');
            fetchData();
        } catch (err) { alert('Failed to add doctor'); }
    };

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Manage Staff</h2>
            
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><UserPlus size={20}/> Add New Doctor</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    <input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input placeholder="Phone" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
                    <input type="password" placeholder="Login Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} required>
                        <option value="">Select Department</option>
                        {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
                    <input placeholder="Qualification" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} required />
                    <input placeholder="Fee" type="number" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} required />
                    <textarea placeholder="Doctor Biography" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ gridColumn: 'span 2', height: '40px' }} />
                    <button type="submit" className="btn-primary">Add Doctor</button>
                </form>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Department</th>
                            <th style={{ padding: '12px' }}>Specialization</th>
                            <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(d => (
                            <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px' }}>Dr. {d.user.firstName} {d.user.lastName}</td>
                                <td style={{ padding: '12px' }}>{d.department.name}</td>
                                <td style={{ padding: '12px' }}>{d.specialization}</td>
                                <td style={{ padding: '12px' }}>
                                    <button style={{ background: 'transparent', color: '#ef4444' }}><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDoctors;
