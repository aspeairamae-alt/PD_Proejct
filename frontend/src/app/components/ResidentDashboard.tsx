import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { useReports } from '../context/ReportsContext';
import Sidebar from './ui/sidebar';
import { ClipboardList, FileText, Bell, Activity } from 'lucide-react';

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { reports, notifications } = useReports();

  const userReports = user
    ? reports.filter(
        (r) => r.residentId === user.id || r.submittedBy === user.name
      )
    : [];

  const latestReport = [...userReports]
    .sort((a, b) => {
      const aTime = a.dateTime ? Date.parse(a.dateTime) : a.id;
      const bTime = b.dateTime ? Date.parse(b.dateTime) : b.id;
      return bTime - aTime;
    })[0];

  return (
    <div className="flex">
      <Sidebar userType="resident" />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#003366] mb-2">Welcome, {user?.name}</h3>
            <p className="text-gray-600">{user?.address}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => navigate('/resident/submit-report')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#003366] p-3 rounded-lg">
                  <ClipboardList size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Submit Report</h4>
              </div>
              <button className="w-full bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-[#004488] transition-colors">
                Create New Report
              </button>
            </div>

            <div
              onClick={() => navigate('/resident/history')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">View History</h4>
              </div>
              <p className="text-3xl font-bold text-[#003366]">{userReports.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Reports</p>
            </div>

            <div
              onClick={() => navigate('/resident/notifications')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <Bell size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
              </div>
              <p className="text-3xl font-bold text-[#003366]">{notifications.length}</p>
              <p className="text-sm text-gray-500 mt-1">New Updates</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={24} className="text-[#003366]" />
              <h4 className="text-xl font-semibold text-gray-800">Recent Activity</h4>
            </div>
            {latestReport ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Latest report:</strong> {latestReport.description}</p>
                <p className="text-sm text-gray-500 mt-2">Status: <span className="font-medium">{latestReport.status}</span></p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No reports yet. Submit your first report.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
