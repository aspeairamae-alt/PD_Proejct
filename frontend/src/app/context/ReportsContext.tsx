import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { API_BASE } from '../config/api';

export interface Report {
  id: number;
  description: string;
  location: string;
  status: 'Pending' | 'Ongoing' | 'Fixed';
  submittedBy: string;
  residentId?: number | null;
  dateTime?: string;
  photo?: string | null;
}

interface Notification {
  id: number;
  message: string;
  reportId?: number;
  dateSent?: string;
}

interface ReportsContextType {
  reports: Report[];
  notifications: Notification[];
  addReport: (report: Omit<Report, 'id' | 'status'> & { photo?: string | null }) => Promise<void>;
  updateReportStatus: (id: number, status: Report['status']) => Promise<void>;
  refreshReports: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  const mapReport = (row: any): Report => ({
    id: row.Report_ID,
    description: row.Description,
    location: row.Location,
    status: row.Current_Status,
    submittedBy: row.Reporter_Name,
    residentId: row.Resident_ID,
    dateTime: row.DateTime,
    photo: row.Photo,
  });

  const mapNotification = (row: any): Notification => ({
    id: row.Status_Notif_ID,
    message: row.Message,
    reportId: row.Report_ID,
    dateSent: row.Date_Sent,
  });

  const refreshReports = async () => {
    try {
      const query = user?.role === 'resident' ? `?residentId=${user.id}` : '';
      const response = await fetch(`${API_BASE}/api/reports${query}`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to load reports', data);
        return;
      }
      setReports(Array.isArray(data) ? data.map(mapReport) : []);
    } catch (error) {
      console.error('Error refreshing reports:', error);
    }
  };

  const refreshNotifications = async () => {
    if (!user || user.role !== 'resident') {
      setNotifications([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/notifications/resident/${user.id}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to load notifications', data);
        return;
      }
      setNotifications(Array.isArray(data) ? data.map(mapNotification) : []);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  };

  useEffect(() => {
    refreshReports();
    refreshNotifications();
  }, [user]);

  const addReport = async (report: Omit<Report, 'id' | 'status'> & { photo?: string | null }) => {
    if (!user) {
      throw new Error('User must be logged in to submit reports.');
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      console.log('Submitting report with token:', token ? 'present' : 'missing');
      
      const payload = {
        description: report.description,
        location: report.location,
        reporterName: user.name,
        residentId: user.role === 'resident' ? user.id : undefined,
        photo: report.photo || null,
      };
      console.log('Report payload:', payload);

      const response = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      await refreshReports();
    } catch (error) {
      console.error('Add report error:', error);
      throw error;
    }
  };

  const updateReportStatus = async (id: number, status: Report['status']) => {
    try {
      const response = await fetch(`${API_BASE}/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update report status');
      }

      await refreshReports();
      await refreshNotifications();
    } catch (error) {
      console.error('Update report status error:', error);
      throw error;
    }
  };

  return (
    <ReportsContext.Provider
      value={{ reports, notifications, addReport, updateReportStatus, refreshReports, refreshNotifications }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
