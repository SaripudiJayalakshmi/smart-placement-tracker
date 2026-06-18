import { useState, useEffect } from 'react';
import { Star, MapPin, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/recommendations');
      setRecommendations(data.data);
    } catch {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    if (score >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getBarColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-400';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading recommendations...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Recommendations</h1>
          <p className="text-gray-500 text-sm mt-1">Ranked by how well you match each company</p>
        </div>
        <Button variant="outline" onClick={fetchRecommendations} loading={loading}>
          Refresh
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <Star size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No recommendations yet. Complete your profile first.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={rec.companyId} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{rec.name}</h3>
                    <p className="text-sm text-gray-500">{rec.sector} · {rec.location} · ₹{rec.package} LPA</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(rec.matchScore)}`}>
                    {rec.matchScore}%
                  </span>
                  <p className="text-xs text-gray-400 mt-1">match</p>
                </div>
              </div>

              {/* Match bar */}
              <div className="bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${getBarColor(rec.matchScore)}`}
                  style={{ width: `${rec.matchScore}%` }}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                {rec.eligible
                  ? <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} /> Eligible</span>
                  : <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full"><XCircle size={12} /> Not Eligible</span>
                }
              </div>

              <div className="grid grid-cols-2 gap-3">
                {rec.matchedSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Matched Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.matchedSkills.map(s => (
                        <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ {s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {rec.missingSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.missingSkills.map(s => (
                        <span key={s} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">✗ {s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;