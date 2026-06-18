import { useState, useEffect } from 'react';
import { Search, User, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter(s =>
      s.user?.name?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    ));
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data.data);
      setFiltered(data.data);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading students...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Students</h1>
        <p className="text-gray-500 text-sm mt-1">{students.length} students registered</p>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Student', 'Department', 'CGPA', 'Aptitude', 'Coding', 'Skills', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No students found</td></tr>
            ) : (
              filtered.map(student => (
                <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {student.user?.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.user?.name}</p>
                        <p className="text-xs text-gray-400">{student.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.department || '--'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${student.cgpa >= 7.5 ? 'text-green-600' : student.cgpa >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {student.cgpa || '--'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.aptitudeScore || '--'}</td>
                  <td className="px-4 py-3 text-gray-600">{student.codingScore || '--'}</td>
                  <td className="px-4 py-3 text-gray-600">{student.skills?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      student.placementStatus === 'placed' ? 'bg-green-50 text-green-700' :
                      student.placementStatus === 'in_process' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {student.placementStatus?.replace('_', ' ') || 'not applied'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;