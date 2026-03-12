import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/admin/analytics');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Loading analytics...</p>;

    const appointmentData = {
        labels: stats.appointmentsPerDoctor.map(d => `Dr. ${d.doctor}`),
        datasets: [{
            label: 'Total Appointments',
            data: stats.appointmentsPerDoctor.map(d => d.count),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'var(--primary)',
            borderWidth: 1
        }]
    };

    const revenueData = {
        labels: stats.revenuePerDepartment.map(d => d.department),
        datasets: [{
            label: 'Revenue by Department',
            data: stats.revenuePerDepartment.map(d => d.revenue),
            backgroundColor: [
                'rgba(99, 102, 241, 0.6)',
                'rgba(236, 72, 153, 0.6)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(16, 185, 129, 0.6)'
            ],
            borderWidth: 0
        }]
    };

    const dailyData = {
        labels: stats.dailyStats.map(d => d.date),
        datasets: [{
            label: 'Daily Appointments',
            data: stats.dailyStats.map(d => d.count),
            fill: true,
            borderColor: 'var(--secondary)',
            tension: 0.4,
            backgroundColor: 'rgba(236, 72, 153, 0.1)'
        }]
    };

    return (
        <div>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Hospital Analytics</h2>

            <div className="grid-3" style={{ marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Patients</h4>
                    <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalPatients}</div>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Doctors</h4>
                    <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalDoctors}</div>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Appointments</h4>
                    <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalAppointments}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Appointments per Doctor</h3>
                    <Bar data={appointmentData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Revenue per Department</h3>
                    <Pie data={revenueData} options={{ responsive: true }} />
                </div>
                <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Appointment Trends</h3>
                    <Line data={dailyData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
