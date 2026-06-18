import { useState, useEffect } from 'react';
import { GraduationCap, Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.get('/students/me').then(({ data }) => setStudent(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Track your placement readiness below</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<GraduationCap size={22} className="text-blue-600" />} label="CGPA" value={student?.cgpa || '--'} color="bg-blue-50" />
        <StatCard icon={<TrendingUp size={22} className="text-green-600" />} label="Aptitude Score" value={student?.aptitudeScore || '--'} color="bg-green-50" />
        <StatCard icon={<ShieldCheck size={22} className="text-purple-600" />} label="Coding Score" value={student?.codingScore || '--'} color="bg-purple-50" />
        <StatCard icon={<Building2 size={22} className="text-orange-600" />} label="Skills" value={student?.skills?.length || '--'} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Placement Prediction">
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <TrendingUp size={40} className="mb-3 text-gray-300" />
            <p className="text-sm">Complete your profile to see your placement prediction</p>
            <Link to="/profile" className="mt-3 text-primary-600 text-sm font-medium hover:underline">Go to Profile →</Link>
          </div>
        </Card>
        <Card title="Your Skills">
          <div className="flex flex-wrap gap-2 py-2">
            {student?.skills?.length > 0
              ? student.skills.map(s => (
                  <span key={s} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">{s}</span>
                ))
              : <p className="text-gray-400 text-sm">No skills added yet. <Link to="/profile" className="text-primary-600 hover:underline">Add skills →</Link></p>
            }
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
