import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useReports } from '../context/ReportsContext';
import Sidebar from './ui/sidebar';
import { Filter } from 'lucide-react';

type ReportStatus = 'Pending' | 'Ongoing' | 'Fixed';

export default function AdminDashboard() {
  const { user } = useUser();
  const { reports, updateReportStatus } = useReports();
  const [filter, setFilter] = useState<'all' | ReportStatus>('all');

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.status === filter);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-400 text-black';
      case 'Ongoing':
        return 'bg-blue-600 text-white';
      case 'Fixed':
        return 'bg-green-600 text-white';
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

  const handleStatusUpdate = (reportId: number, newStatus: ReportStatus) => {
    updateReportStatus(reportId, newStatus);
  };

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const ongoingCount = reports.filter(r => r.status === 'Ongoing').length;
  const fixedCount = reports.filter(r => r.status === 'Fixed').length;

  return (
    <div className="flex">
      <Sidebar userType="admin" />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#003366] mb-2">Welcome, {user?.name}</h3>
            <p className="text-gray-600">Waterwork Office – Manage pipe damage reports from residents</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Total Reports</h4>
              <p className="text-3xl font-bold text-[#003366]">{reports.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Pending</h4>
              <p className="text-3xl font-bold text-yellow-700">{pendingCount}</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Ongoing</h4>
              <p className="text-3xl font-bold text-blue-700">{ongoingCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow-md p-6 border-2 border-green-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Fixed</h4>
              <p className="text-3xl font-bold text-green-700">{fixedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Filter size={24} className="text-[#003366]" />
              <h4 className="text-xl font-semibold text-gray-800">Filter Reports</h4>
            </div>

            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-[#003366] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Reports
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'Pending'
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('Ongoing')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'Ongoing'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter('Fixed')}
                className={`px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'Fixed'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fixed
              </button>
            </div>

            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500 italic">No reports found.</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">Report #{report.id}</h4>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700"><span className="font-semibold">Submitted by:</span> {report.submittedBy}</p>
                      <p className="text-gray-700"><span className="font-semibold">Description:</span> {report.description}</p>
                      <p className="text-gray-700"><span className="font-semibold">Location:</span> {report.location}</p>
                      <p className="text-gray-500 text-sm"><span className="font-semibold">Date:</span> {formatReportDateTime(report.dateTime)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-300">
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'Pending')}
                        className="bg-yellow-400 text-black py-2 px-5 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                      >
                        Set Pending
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'Ongoing')}
                        className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Set Ongoing
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'Fixed')}
                        className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Set Fixed
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
