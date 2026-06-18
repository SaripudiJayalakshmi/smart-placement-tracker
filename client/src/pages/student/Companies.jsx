import { useState, useEffect } from 'react';
import { Building2, MapPin, DollarSign, GraduationCap, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    ));
  }, [search, companies]);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data.data);
      setFiltered(data.data);
    } catch {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading companies...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <p className="text-gray-500 text-sm mt-1">{companies.length} companies available for placement</p>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Search by company name, sector or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No companies found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(company => (
            <div key={company._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{company.name}</h3>
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{company.sector}</span>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold text-lg">₹{company.package} LPA</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{company.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap size={14} className="text-gray-400" />
                  Min CGPA: <span className="font-medium">{company.minCGPA}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={14} className="text-gray-400" />
                  Aptitude: {company.minAptitudeScore}+ | Coding: {company.minCodingScore}+
                </div>
              </div>

              {company.requiredSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {company.requiredSkills.map(skill => (
                      <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {company.openRoles.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Open Roles</p>
                  <p className="text-sm text-gray-700">{company.openRoles.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;