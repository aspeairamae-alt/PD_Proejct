import { useState } from 'react'; // Added useState
import { useNavigate, useLocation } from 'react-router';
import { useUser } from '../../context/UserContext';
import { 
  Home, FileText, Bell, LogOut, Info, 
  ClipboardList, Menu, ChevronLeft 
} from 'lucide-react'; // Added Menu and Chevron icons
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

interface SidebarProps {
  userType: 'resident' | 'admin';
}

export default function Sidebar({ userType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true); // State to control visibility
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
    navigate('/');
  };

  const residentLinks = [
    { path: '/resident/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/resident/submit-report', icon: ClipboardList, label: 'Submit Report' },
    { path: '/resident/history', icon: FileText, label: 'View History' },
    { path: '/resident/notifications', icon: Bell, label: 'Notifications' },
    { path: '/about', icon: Info, label: 'About Us' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/about', icon: Info, label: 'About Us' },
  ];

  const links = userType === 'resident' ? residentLinks : adminLinks;

  return (
    <>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#003366] text-white rounded-md shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        w-64 bg-[#003366] text-white h-screen flex flex-col fixed transition-transform duration-300 ease-in-out z-40
      `}>
        <div className="p-6 border-b border-[#004488] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Barangay Poblacion Norte</h2>
            <p className="text-sm text-gray-300 mt-1">Pipe Damage Monitoring System</p>
          </div>
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="hover:bg-[#004488] p-1 rounded">
            <ChevronLeft size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0055aa] text-white'
                        : 'hover:bg-[#004488] text-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#004488]">
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-gray-200"
              >
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Overlay for mobile (Optional) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 md:hidden z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}