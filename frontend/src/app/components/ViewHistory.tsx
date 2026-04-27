import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useReports } from '../context/ReportsContext';
import Sidebar from './ui/sidebar';
import { FileText, Filter } from 'lucide-react';

export default function ViewHistory() {
  const { user } = useUser();
  const { reports } = useReports();
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Ongoing' | 'Fixed'>('all');

  const userReports = reports.filter(r => r.submittedBy === user?.name);
  const filteredReports = filter === 'all'
    ? userReports
    : userReports.filter(r => r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-400 text-black';
      case 'Ongoing':
        return 'bg-blue-600 text-white';
      case 'Fixed':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const formatReportDateTime = (dateTime?: string) => {
    if (!dateTime) return 'No date available';
    const parsed = new Date(dateTime);
    if (Number.isNaN(parsed.getTime())) return dateTime;
    const month = parsed.toLocaleString('en-US', { month: 'long' });
    const day = parsed.getDate().toString().padStart(2, '0');
    const year = parsed.getFullYear();
    const time = parsed.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month} ${day}, ${year} / ${time}`;
  };

  return (
    <div className="flex">
      <Sidebar userType="resident" />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={32} className="text-[#003366]" />
            <h2 className="text-3xl font-bold text-[#003366]">Report History</h2>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-[#003366]" />
              <h4 className="text-lg font-semibold text-gray-800">Filter by Status</h4>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#003366] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Pending'
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('Ongoing')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Ongoing'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter('Fixed')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Fixed'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fixed
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 italic">You have not submitted any reports yet.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">Report #{report.id}</h4>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Description:</span> {report.description}</p>
                    <p className="text-gray-700"><span className="font-semibold">Location:</span> {report.location}</p>
                    <p className="text-gray-500 text-sm"><span className="font-semibold">Date:</span> {formatReportDateTime(report.dateTime)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
