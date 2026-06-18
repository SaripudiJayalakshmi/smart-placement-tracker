import { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CheckRow = ({ label, passed, actual, required }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <div className="flex items-center gap-2">
      {passed
        ? <CheckCircle size={15} className="text-green-500" />
        : <XCircle size={15} className="text-red-400" />}
      <span className="text-gray-600">{label}</span>
    </div>
    <span className={`font-medium ${passed ? 'text-green-600' : 'text-red-500'}`}>
      {actual} / {required} required
    </span>
  </div>
);

const CompanyCard = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  const { company, eligible, checks, skillCheck } = result;

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm ${eligible ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{company.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eligible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {eligible ? '✓ Eligible' : '✗ Not Eligible'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{company.sector} · {company.location} · ₹{company.package} LPA</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 mt-1">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-1">
          <CheckRow label="CGPA" passed={checks.cgpa.passed} actual={checks.cgpa.actual} required={checks.cgpa.required} />
          <CheckRow label="Aptitude Score" passed={checks.aptitude.passed} actual={checks.aptitude.actual} required={checks.aptitude.required} />
          <CheckRow label="Coding Score" passed={checks.coding.passed} actual={checks.coding.actual} required={checks.coding.required} />

          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm mb-2">
              {skillCheck.passed
                ? <CheckCircle size={15} className="text-green-500" />
                : <XCircle size={15} className="text-red-400" />}
              <span className="text-gray-600">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-1 ml-6">
              {skillCheck.required.map(skill => {
                const matched = skillCheck.matched.includes(skill);
                return (
                  <span key={skill} className={`text-xs px-2 py-0.5 rounded-full ${matched ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {matched ? '✓' : '✗'} {skill}
                  </span>
                );
              })}
              {skillCheck.required.length === 0 && <span className="text-xs text-gray-400">No specific skills required</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Eligibility = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/eligibility/check');
      setResult(data);
      toast.success('Eligibility checked!');
    } catch {
      toast.error('Failed to check eligibility. Make sure your profile is complete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Eligibility Checker</h1>
        <p className="text-gray-500 text-sm mt-1">Check which companies you qualify for based on your profile</p>
      </div>

      {!result ? (
        <Card>
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
              <ShieldCheck size={32} className="text-primary-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-lg">Check Your Eligibility</p>
              <p className="text-gray-500 text-sm mt-1">We'll compare your profile against all available companies</p>
            </div>
            <Button onClick={checkEligibility} loading={loading} className="px-8">
              Check Now
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Companies', value: result.summary.total, color: 'bg-blue-50 text-blue-700' },
              { label: 'Eligible', value: result.summary.eligible, color: 'bg-green-50 text-green-700' },
              { label: 'Not Eligible', value: result.summary.notEligible, color: 'bg-red-50 text-red-600' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={checkEligibility} loading={loading}>Recheck</Button>
          </div>

          {/* Eligible Companies */}
          {result.data.eligible.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle size={20} /> Eligible Companies ({result.data.eligible.length})
              </h2>
              <div className="space-y-3">
                {result.data.eligible.map(r => <CompanyCard key={r.company._id} result={r} />)}
              </div>
            </div>
          )}

          {/* Not Eligible Companies */}
          {result.data.notEligible.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
                <XCircle size={20} /> Not Eligible ({result.data.notEligible.length})
              </h2>
              <div className="space-y-3">
                {result.data.notEligible.map(r => <CompanyCard key={r.company._id} result={r} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Eligibility;