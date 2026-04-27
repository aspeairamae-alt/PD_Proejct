import { createBrowserRouter } from 'react-router';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import ResidentDashboard from './components/ResidentDashboard';
import ViewHistory from './components/ViewHistory';
import Notifications from './components/Notifications';
import SubmitReport from './components/SubmitReport';
import AdminDashboard from './components/AdminDashboard';
import About from './components/aboutus';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/admin-login',
    Component: AdminLogin,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/about',
    Component: About,
  },
  {
    path: '/resident/dashboard',
    Component: ResidentDashboard,
  },
  {
    path: '/resident/history',
    Component: ViewHistory,
  },
  {
    path: '/resident/notifications',
    Component: Notifications,
  },
  {
    path: '/resident/submit-report',
    Component: SubmitReport,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
]);
