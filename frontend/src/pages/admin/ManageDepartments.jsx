import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Trash2 } from 'lucide-react';

const ManageDepartments = () => {
    const [depts, setDepts] = useState([]);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const fetchDepts = async () => {
        try {
            const res = await API.get('/departments');
            setDepts(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchDepts(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/departments', { name, description: desc });
            setName(''); setDesc('');
            fetchDepts();
        } catch (err) { alert('Failed to add department'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/departments/${id}`);
            fetchDepts();
        } catch (err) { alert('Failed to delete'); }
    }

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Hospital Departments</h2>
            
            <div className="grid-3">
                <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>Add Department</h3>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input placeholder="Department Name" value={name} onChange={e => setName(e.target.value)} required />
                        <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ height: '80px' }} />
                        <button type="submit" className="btn-primary">Add</button>
                    </form>
                </div>

                <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Description</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depts.map(d => (
                                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px' }}>{d.name}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>{d.description}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={() => handleDelete(d.id)} style={{ background: 'transparent', color: '#ef4444' }}><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDepartments;
