import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useUser } from '../context/UserContext';
import { 
  Home, FileText, Bell, LogOut, Info, 
  ClipboardList, Menu, ChevronLeft 
} from 'lucide-react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarState must be used within SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  userType: 'resident' | 'admin';
}

export default function Sidebar({ userType }: SidebarProps) {
  const { isOpen, setIsOpen } = useSidebarState();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const handleLogout = () => {
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
          className="fixed top-4 left-4 z-50 p-2 bg-[#003366] text-white rounded-md shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        w-64 bg-[#003366] text-white h-screen flex flex-col fixed top-0 left-0 md:relative transition-transform duration-300 ease-in-out z-40
      `}>
        <div className="p-6 border-b border-[#004488] flex justify-between items-center">
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold">Barangay Poblacion Norte</h2>
            <p className="text-sm text-gray-300 mt-1">Pipe Damage Monitoring System</p>
          </div>
          <div className="md:hidden flex-1">
            <h2 className="text-sm font-semibold">System</h2>
          </div>
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="hover:bg-[#004488] p-1 rounded md:hidden">
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
                    onClick={() => {
                      navigate(link.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0055aa] text-white'
                        : 'hover:bg-[#004488] text-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="hidden md:inline">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#004488]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-gray-200"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 md:hidden z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}