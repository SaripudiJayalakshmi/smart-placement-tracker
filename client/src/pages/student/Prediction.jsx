import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const colorMap = {
  green: { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  yellow: { bar: 'bg-yellow-400', text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  orange: { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  red: { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const Prediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/prediction');
      setPrediction(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const colors = prediction ? colorMap[prediction.color] || colorMap.green : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Placement Prediction</h1>
          <p className="text-gray-500 text-sm mt-1">ML-powered prediction based on your profile</p>
        </div>
        <Button variant="outline" onClick={fetchPrediction} loading={loading}>
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {loading && !prediction ? (
        <Card>
          <div className="flex justify-center items-center py-16 text-gray-400">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p>Analyzing your profile...</p>
            </div>
          </div>
        </Card>
      ) : prediction ? (
        <>
          {/* Main prediction card */}
          <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 text-center`}>
            <div className={`text-6xl font-bold ${colors.text} mb-2`}>
              {prediction.probability}%
            </div>
            <div className={`text-lg font-semibold ${colors.text} mb-1`}>
              {prediction.level} Placement Chance
            </div>
            <p className="text-gray-600 text-sm">{prediction.message}</p>

            {/* Progress bar */}
            <div className="mt-6 bg-white rounded-full h-4 overflow-hidden border border-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${colors.bar}`}
                style={{ width: `${prediction.probability}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Profile breakdown */}
          <Card title="Your Profile Breakdown">
            <div className="space-y-4">
              {[
                { label: 'CGPA', value: prediction.breakdown.cgpa, max: 10, unit: '/ 10' },
                { label: 'Aptitude Score', value: prediction.breakdown.aptitudeScore, max: 100, unit: '/ 100' },
                { label: 'Coding Score', value: prediction.breakdown.codingScore, max: 100, unit: '/ 100' },
                { label: 'Projects', value: prediction.breakdown.projectsCount, max: 5, unit: 'projects' },
                { label: 'Internships', value: prediction.breakdown.internshipsCount, max: 3, unit: 'internships' },
                { label: 'Skills', value: prediction.breakdown.skillsCount, max: 10, unit: 'skills' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-800 font-semibold">{item.value} {item.unit}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card title="How to improve your score">
            <ul className="space-y-2 text-sm text-gray-600">
              {prediction.breakdown.cgpa < 7.5 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Improve your CGPA — aim for 7.5+</li>
              )}
              {prediction.breakdown.aptitudeScore < 70 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Practice aptitude questions daily — target 70+</li>
              )}
              {prediction.breakdown.codingScore < 70 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Solve more coding problems on LeetCode/HackerRank</li>
              )}
              {prediction.breakdown.projectsCount < 2 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Build at least 2 solid projects to showcase</li>
              )}
              {prediction.breakdown.internshipsCount < 1 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Get at least one internship experience</li>
              )}
              {prediction.breakdown.skillsCount < 5 && (
                <li className="flex gap-2"><span className="text-orange-500">→</span> Add more relevant technical skills to your profile</li>
              )}
              {prediction.probability >= 75 && (
                <li className="flex gap-2"><span className="text-green-500">✓</span> Great profile! Keep it up and apply confidently.</li>
              )}
            </ul>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Complete your profile to get a placement prediction</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Prediction;