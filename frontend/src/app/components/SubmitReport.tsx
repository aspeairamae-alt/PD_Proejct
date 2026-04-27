import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useReports } from '../context/ReportsContext';
import Sidebar from './ui/sidebar';
import { ClipboardList, Upload } from 'lucide-react';

const LOCATION_OPTIONS = [
  'Purok 1, Santa Rosa, Clarin, Bohol',
  'Purok 2, San Roque, Clarin, Bohol',
  'Purok 3, Uwak, Clarin, Bohol',
  'Purok 4, Tulay, Clarin, Bohol',
];

export default function SubmitReport() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addReport } = useReports();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f8ff]">
        <p className="text-lg text-gray-600">Please log in to submit a report.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addReport({
        description,
        location,
        submittedBy: user.name,
        photo: photo ? await fileToBase64(photo) : null,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/resident/dashboard');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to submit report. Please try again.';
      setError(errorMessage);
      console.error('Submit report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex">
      <Sidebar userType="resident" />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList size={32} className="text-[#003366]" />
            <h2 className="text-3xl font-bold text-[#003366]">Submit Pipe Damage Report</h2>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Report submitted successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the pipe damage in detail..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] disabled:bg-gray-100"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] disabled:bg-gray-100"
              >
                <option value="">Select a location</option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto((e.target as HTMLInputElement).files?.[0] || null)}
                  disabled={loading}
                  className="w-full"
                />
                {photo && <p className="text-sm text-green-600 mt-2">✓ {photo.name}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#003366] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#004488] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/resident/dashboard')}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
