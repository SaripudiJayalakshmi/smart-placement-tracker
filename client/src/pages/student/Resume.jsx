import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumeUrl(data.resumeUrl);
    } catch {
      toast.error('Failed to load resume');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF files allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('File must be under 5MB');

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeUrl(data.resumeUrl);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    setDeleting(true);
    try {
      await api.delete('/resume');
      setResumeUrl('');
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Resume</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your resume in PDF format (max 5MB)</p>
      </div>

      <Card>
        {resumeUrl ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <FileText size={32} className="text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Resume uploaded</p>
              <p className="text-sm text-gray-500 mt-1">Your resume is saved and ready</p>
            </div>
            <div className="flex gap-3">
              <a href={resumeUrl.replace('/upload/', '/upload/fl_attachment/')} target="_blank" rel="noopener noreferrer">
                <Button variant="outline"><ExternalLink size={16} /> View Resume</Button>
              </a>
              <Button variant="outline" onClick={() => fileRef.current.click()} loading={uploading}>
                <Upload size={16} /> Replace
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all"
            onClick={() => fileRef.current.click()}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload size={32} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700">Click to upload your resume</p>
              <p className="text-sm text-gray-400 mt-1">PDF only · Max 5MB</p>
            </div>
            {uploading && <p className="text-primary-600 text-sm font-medium">Uploading...</p>}
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
      </Card>

      <Card title="Tips for a great resume">
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            'Keep it to 1 page for fresher positions',
            'Include your CGPA if it is above 7.0',
            'List your top 3-5 technical skills prominently',
            'Add links to your GitHub and LinkedIn',
            'Quantify your achievements where possible',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Resume;

