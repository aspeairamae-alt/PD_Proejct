import { RouterProvider } from 'react-router';
import { UserProvider } from './context/UserContext';
import { ReportsProvider } from './context/ReportsContext';
import { SidebarProvider } from './components/sidebar';
import { router } from './routes';

export default function App() {
  return (
    <UserProvider>
      <ReportsProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </ReportsProvider>
    </UserProvider>
  );
}