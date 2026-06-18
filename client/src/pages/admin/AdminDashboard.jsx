import { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/companies'),
    ]).then(([sRes, cRes]) => {
      setStudents(sRes.data.data);
      setCompanies(cRes.data.data);
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const placed = students.filter(s => s.placementStatus === 'placed').length;
  const placementRate = students.length > 0 ? ((placed / students.length) * 100).toFixed(1) : 0;

  const avgCGPA = students.length > 0
    ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2)
    : 0;

  const cgpaRanges = [
    { range: '< 6', count: students.filter(s => s.cgpa < 6).length },
    { range: '6-7', count: students.filter(s => s.cgpa >= 6 && s.cgpa < 7).length },
    { range: '7-8', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '8-9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '9-10', count: students.filter(s => s.cgpa >= 9).length },
  ];

  const statusData = [
    { name: 'Not Applied', value: students.filter(s => s.placementStatus === 'not_applied').length },
    { name: 'In Process', value: students.filter(s => s.placementStatus === 'in_process').length },
    { name: 'Placed', value: students.filter(s => s.placementStatus === 'placed').length },
    { name: 'Not Placed', value: students.filter(s => s.placementStatus === 'not_placed').length },
  ].filter(d => d.value > 0);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all placement activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Users size={22} className="text-blue-600" />, label: 'Total Students', value: students.length, color: 'bg-blue-50' },
          { icon: <Building2 size={22} className="text-green-600" />, label: 'Companies', value: companies.length, color: 'bg-green-50' },
          { icon: <Award size={22} className="text-purple-600" />, label: 'Placed', value: placed, color: 'bg-purple-50' },
          { icon: <TrendingUp size={22} className="text-orange-600" />, label: 'Placement Rate', value: `${placementRate}%`, color: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-lg ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CGPA Distribution */}
        <Card title="CGPA Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cgpaRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Placement Status */}
        <Card title="Placement Status">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No placement data yet
            </div>
          )}
        </Card>
      </div>

      {/* Quick stats */}
      <Card title="Quick Statistics">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-gray-800">{avgCGPA}</p>
            <p className="text-sm text-gray-500 mt-1">Avg CGPA</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-gray-800">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.aptitudeScore || 0), 0) / students.length) : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Aptitude</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-gray-800">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.codingScore || 0), 0) / students.length) : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Coding</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-gray-800">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.skills?.length || 0), 0) / students.length) : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Skills</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;