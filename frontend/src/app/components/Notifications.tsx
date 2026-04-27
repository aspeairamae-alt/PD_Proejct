import { useReports } from '../context/ReportsContext';
import Sidebar from './ui/sidebar';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const { notifications } = useReports();

  return (
    <div className="flex">
      <Sidebar userType="resident" />
      <div className="flex-1 w-full md:ml-64 bg-[#f0f8ff] min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Bell size={32} className="text-[#003366]" />
            <h2 className="text-3xl font-bold text-[#003366]">Notifications</h2>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 italic">No notifications yet.</p>
              </div>
            ) : (
              notifications.slice().reverse().map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-[#003366]"
                >
                  <div className="flex items-start gap-3">
                    <Bell size={20} className="text-[#003366] mt-1" />
                    <p className="text-gray-700">{notification.message}</p>
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
