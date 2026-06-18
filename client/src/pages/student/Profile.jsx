import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    department: '', batch: '', cgpa: '', aptitudeScore: '', codingScore: '', skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', link: '' });
  const [newInternship, setNewInternship] = useState({ company: '', role: '', duration: '', description: '' });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showInternshipForm, setShowInternshipForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/students/me');
      const s = data.data;
      setProfile({
        department: s.department || '',
        batch: s.batch || '',
        cgpa: s.cgpa || '',
        aptitudeScore: s.aptitudeScore || '',
        codingScore: s.codingScore || '',
        skills: s.skills || [],
      });
      setProjects(s.projects || []);
      setInternships(s.internships || []);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/students/me', profile);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (profile.skills.includes(skillInput.trim())) return toast.error('Skill already added');
    setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleAddProject = async () => {
    if (!newProject.title) return toast.error('Project title is required');
    try {
      const { data } = await api.post('/students/me/projects', newProject);
      setProjects(data.data.projects);
      setNewProject({ title: '', description: '', techStack: '', link: '' });
      setShowProjectForm(false);
      toast.success('Project added!');
    } catch {
      toast.error('Failed to add project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const { data } = await api.delete(`/students/me/projects/${id}`);
      setProjects(data.data.projects);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleAddInternship = async () => {
    if (!newInternship.company) return toast.error('Company name is required');
    try {
      const { data } = await api.post('/students/me/internships', newInternship);
      setInternships(data.data.internships);
      setNewInternship({ company: '', role: '', duration: '', description: '' });
      setShowInternshipForm(false);
      toast.success('Internship added!');
    } catch {
      toast.error('Failed to add internship');
    }
  };

  const handleDeleteInternship = async (id) => {
    try {
      const { data } = await api.delete(`/students/me/internships/${id}`);
      setInternships(data.data.internships);
      toast.success('Internship deleted');
    } catch {
      toast.error('Failed to delete internship');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Keep your academic info up to date</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} /> Save Profile
        </Button>
      </div>

      {/* Academic Info */}
      <Card title="Academic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Department" placeholder="e.g. Computer Science" value={profile.department} onChange={e => setProfile({ ...profile, department: e.target.value })} />
          <Input label="Batch / Year" placeholder="e.g. 2024" value={profile.batch} onChange={e => setProfile({ ...profile, batch: e.target.value })} />
          <Input label="CGPA (out of 10)" type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5" value={profile.cgpa} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} />
          <Input label="Aptitude Score (out of 100)" type="number" min="0" max="100" placeholder="e.g. 75" value={profile.aptitudeScore} onChange={e => setProfile({ ...profile, aptitudeScore: e.target.value })} />
          <Input label="Coding Score (out of 100)" type="number" min="0" max="100" placeholder="e.g. 80" value={profile.codingScore} onChange={e => setProfile({ ...profile, codingScore: e.target.value })} />
        </div>
      </Card>

      {/* Skills */}
      <Card title="Skills">
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add a skill (e.g. Python, React)"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} variant="outline"><Plus size={16} /> Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.length === 0 && <p className="text-gray-400 text-sm">No skills added yet</p>}
          {profile.skills.map(skill => (
            <span key={skill} className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500"><Trash2 size={12} /></button>
            </span>
          ))}
        </div>
      </Card>

      {/* Projects */}
      <Card title="Projects">
        {projects.map(p => (
          <div key={p._id} className="flex justify-between items-start border border-gray-100 rounded-lg p-4 mb-3">
            <div>
              <p className="font-semibold text-gray-800">{p.title}</p>
              <p className="text-sm text-gray-500">{p.techStack}</p>
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
            </div>
            <button onClick={() => handleDeleteProject(p._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        {showProjectForm ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 mt-3">
            <Input placeholder="Project title *" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
            <Input placeholder="Tech stack (e.g. React, Node.js)" value={newProject.techStack} onChange={e => setNewProject({ ...newProject, techStack: e.target.value })} />
            <Input placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
            <Input placeholder="Link (optional)" value={newProject.link} onChange={e => setNewProject({ ...newProject, link: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={handleAddProject}>Add Project</Button>
              <Button variant="secondary" onClick={() => setShowProjectForm(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowProjectForm(true)} className="mt-2"><Plus size={16} /> Add Project</Button>
        )}
      </Card>

      {/* Internships */}
      <Card title="Internships">
        {internships.map(i => (
          <div key={i._id} className="flex justify-between items-start border border-gray-100 rounded-lg p-4 mb-3">
            <div>
              <p className="font-semibold text-gray-800">{i.company}</p>
              <p className="text-sm text-gray-500">{i.role} · {i.duration}</p>
              <p className="text-sm text-gray-600 mt-1">{i.description}</p>
            </div>
            <button onClick={() => handleDeleteInternship(i._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        {showInternshipForm ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 mt-3">
            <Input placeholder="Company name *" value={newInternship.company} onChange={e => setNewInternship({ ...newInternship, company: e.target.value })} />
            <Input placeholder="Role (e.g. Frontend Intern)" value={newInternship.role} onChange={e => setNewInternship({ ...newInternship, role: e.target.value })} />
            <Input placeholder="Duration (e.g. 2 months)" value={newInternship.duration} onChange={e => setNewInternship({ ...newInternship, duration: e.target.value })} />
            <Input placeholder="Description" value={newInternship.description} onChange={e => setNewInternship({ ...newInternship, description: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={handleAddInternship}>Add Internship</Button>
              <Button variant="secondary" onClick={() => setShowInternshipForm(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowInternshipForm(true)} className="mt-2"><Plus size={16} /> Add Internship</Button>
        )}
      </Card>
    </div>
  );
};

export default Profile;
