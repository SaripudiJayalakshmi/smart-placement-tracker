import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const emptyForm = {
  name: '', description: '', sector: '', location: '', website: '',
  package: '', minCGPA: '', minAptitudeScore: '', minCodingScore: '',
  requiredSkills: '', openRoles: '',
};

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data.data);
    } catch {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.package || !form.minCGPA) return toast.error('Name, package and min CGPA are required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        package: Number(form.package),
        minCGPA: Number(form.minCGPA),
        minAptitudeScore: Number(form.minAptitudeScore || 0),
        minCodingScore: Number(form.minCodingScore || 0),
        requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
        openRoles: form.openRoles ? form.openRoles.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editId) {
        await api.put(`/companies/${editId}`, payload);
        toast.success('Company updated!');
      } else {
        await api.post('/companies', payload);
        toast.success('Company added!');
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (company) => {
    setForm({
      name: company.name,
      description: company.description,
      sector: company.sector,
      location: company.location,
      website: company.website,
      package: company.package,
      minCGPA: company.minCGPA,
      minAptitudeScore: company.minAptitudeScore,
      minCodingScore: company.minCodingScore,
      requiredSkills: company.requiredSkills.join(', '),
      openRoles: company.openRoles.join(', '),
    });
    setEditId(company._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await api.delete(`/companies/${id}`);
      toast.success('Company deleted');
      fetchCompanies();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Companies</h1>
          <p className="text-gray-500 text-sm mt-1">{companies.length} companies listed</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>
          <Plus size={16} /> Add Company
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">{editId ? 'Edit Company' : 'Add New Company'}</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amazon" />
            <Input label="Sector" name="sector" value={form.sector} onChange={handleChange} placeholder="e.g. Tech" />
            <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" />
            <Input label="Package (LPA) *" name="package" type="number" value={form.package} onChange={handleChange} placeholder="e.g. 12" />
            <Input label="Min CGPA *" name="minCGPA" type="number" step="0.1" value={form.minCGPA} onChange={handleChange} placeholder="e.g. 7.0" />
            <Input label="Min Aptitude Score" name="minAptitudeScore" type="number" value={form.minAptitudeScore} onChange={handleChange} placeholder="e.g. 60" />
            <Input label="Min Coding Score" name="minCodingScore" type="number" value={form.minCodingScore} onChange={handleChange} placeholder="e.g. 60" />
            <Input label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
            <div className="sm:col-span-2">
              <Input label="Required Skills (comma separated)" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. Java, Python, React" />
            </div>
            <div className="sm:col-span-2">
              <Input label="Open Roles (comma separated)" name="openRoles" value={form.openRoles} onChange={handleChange} placeholder="e.g. Software Engineer, Data Analyst" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Brief company description"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} loading={saving}>
              <Check size={16} /> {editId ? 'Update' : 'Add'} Company
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {companies.map(company => (
          <div key={company._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{company.name}</h3>
                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{company.sector}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{company.location} · ₹{company.package} LPA · Min CGPA: {company.minCGPA}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {company.requiredSkills.map(s => (
                  <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => handleEdit(company)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(company._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCompanies;