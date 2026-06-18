import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/companies')])
      .then(([s, c]) => {
        setStudents(s.data.data);
        setCompanies(c.data.data);
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const cgpaData = [
    { range: 'Below 6', count: students.filter(s => s.cgpa < 6).length },
    { range: '6.0 - 6.9', count: students.filter(s => s.cgpa >= 6 && s.cgpa < 7).length },
    { range: '7.0 - 7.9', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '8.0 - 8.9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '9.0+', count: students.filter(s => s.cgpa >= 9).length },
  ];

  const scoreData = [
    {
      metric: 'CGPA (×10)',
      avg: students.length ? +(students.reduce((s, x) => s + (x.cgpa || 0), 0) / students.length * 10).toFixed(1) : 0,
    },
    {
      metric: 'Aptitude',
      avg: students.length ? +(students.reduce((s, x) => s + (x.aptitudeScore || 0), 0) / students.length).toFixed(1) : 0,
    },
    {
      metric: 'Coding',
      avg: students.length ? +(students.reduce((s, x) => s + (x.codingScore || 0), 0) / students.length).toFixed(1) : 0,
    },
  ];

  const skillFrequency = {};
  students.forEach(s => s.skills?.forEach(skill => {
    skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
  }));
  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  const packageData = companies
    .sort((a, b) => b.package - a.package)
    .map(c => ({ name: c.name, package: c.package }));

  const statusData = [
    { name: 'Not Applied', value: students.filter(s => s.placementStatus === 'not_applied').length },
    { name: 'In Process', value: students.filter(s => s.placementStatus === 'in_process').length },
    { name: 'Placed', value: students.filter(s => s.placementStatus === 'placed').length },
    { name: 'Not Placed', value: students.filter(s => s.placementStatus === 'not_placed').length },
  ].filter(d => d.value > 0);

  const radarData = [
    { subject: 'CGPA', A: students.length ? +(students.reduce((s, x) => s + (x.cgpa || 0), 0) / students.length * 10).toFixed(0) : 0, fullMark: 100 },
    { subject: 'Aptitude', A: students.length ? +(students.reduce((s, x) => s + (x.aptitudeScore || 0), 0) / students.length).toFixed(0) : 0, fullMark: 100 },
    { subject: 'Coding', A: students.length ? +(students.reduce((s, x) => s + (x.codingScore || 0), 0) / students.length).toFixed(0) : 0, fullMark: 100 },
    { subject: 'Projects', A: students.length ? +(students.reduce((s, x) => s + (x.projects?.length || 0), 0) / students.length * 20).toFixed(0) : 0, fullMark: 100 },
    { subject: 'Skills', A: students.length ? +(students.reduce((s, x) => s + (x.skills?.length || 0), 0) / students.length * 10).toFixed(0) : 0, fullMark: 100 },
  ];

  if (loading) return <div className="text-center py-20 text-gray-500">Loading analytics...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Detailed placement insights and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="CGPA Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Average Scores">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#22c55e" radius={[4,4,0,0]} name="Average" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Skills Among Students">
          {topSkills.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topSkills} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0,4,4,0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No skill data yet</div>
          )}
        </Card>

        <Card title="Company Package Comparison (LPA)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={packageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₹${v} LPA`, 'Package']} />
              <Bar dataKey="package" fill="#f59e0b" radius={[4,4,0,0]} name="Package" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Student Readiness Radar">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Avg Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Placement Status Breakdown">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No status data yet</div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Analytics;