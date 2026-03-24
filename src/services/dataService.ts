import { CAREERS as DEFAULT_CAREERS } from '../data/careers';

const CAREERS_KEY = 'career_sirji_careers';
const APPOINTMENTS_KEY = 'career_sirji_appointments';

export const dataService = {
  // Careers
  getCareers: async (): Promise<any[]> => {
    try {
      // Try to get from localStorage first
      const stored = localStorage.getItem(CAREERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Fallback to API (if it works)
      try {
        const res = await fetch('/api/careers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem(CAREERS_KEY, JSON.stringify(data));
            return data;
          }
        }
      } catch (e) {
        console.warn("[DataService] API fetch failed, using defaults");
      }
      
      // Final fallback to bundled data
      return DEFAULT_CAREERS;
    } catch (error) {
      console.error("[DataService] Error getting careers:", error);
      return DEFAULT_CAREERS;
    }
  },

  saveCareers: async (careers: any[]): Promise<boolean> => {
    try {
      // Save to localStorage
      localStorage.setItem(CAREERS_KEY, JSON.stringify(careers));
      
      // Try to save to API (optional)
      try {
        await fetch('/api/careers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(careers)
        });
      } catch (e) {
        console.warn("[DataService] API save failed, but saved to local storage");
      }
      
      return true;
    } catch (error) {
      console.error("[DataService] Error saving careers:", error);
      return false;
    }
  },

  // Appointments
  getAppointments: async (): Promise<any[]> => {
    try {
      // Try to get from localStorage first
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      const localAppts = stored ? JSON.parse(stored) : [];
      
      // Try to get from API and merge (if it works)
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const apiAppts = await res.json();
          if (Array.isArray(apiAppts)) {
            // Merge and remove duplicates by ID
            const merged = [...localAppts, ...apiAppts];
            const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(unique));
            return unique;
          }
        }
      } catch (e) {
        console.warn("[DataService] API fetch failed, using local storage");
      }
      
      return localAppts;
    } catch (error) {
      console.error("[DataService] Error getting appointments:", error);
      return [];
    }
  },

  saveAppointment: async (appointment: any): Promise<boolean> => {
    try {
      // Generate ID on client to keep local storage consistent
      const id = appointment.id || 'appt-' + Date.now();
      const createdAt = appointment.createdAt || new Date().toISOString();
      const newAppointment = { ...appointment, id, createdAt };
      
      // Save to localStorage
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push(newAppointment);
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      
      // Try to save to API (optional)
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppointment)
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.appointment) {
            // Update local storage with the server's version (which has the IP)
            const latestStored = localStorage.getItem(APPOINTMENTS_KEY);
            const latestAppts = latestStored ? JSON.parse(latestStored) : [];
            const updatedAppts = latestAppts.map((a: any) => a.id === id ? data.appointment : a);
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppts));
          }
        }
      } catch (e) {
        console.warn("[DataService] API save failed, but saved to local storage");
      }
      
      return true;
    } catch (error) {
      console.error("[DataService] Error saving appointment:", error);
      return false;
    }
  },

  deleteAppointment: async (id: string): Promise<boolean> => {
    try {
      // Delete from localStorage
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      if (stored) {
        const appointments = JSON.parse(stored);
        const filtered = appointments.filter((a: any) => a.id !== id);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
      }
      
      // Try to delete from API (optional)
      try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.warn("[DataService] API delete failed, but deleted from local storage");
      }
      
      return true;
    } catch (error) {
      console.error("[DataService] Error deleting appointment:", error);
      return false;
    }
  },

  sendResultsEmail: async (data: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (error) {
      console.error("[DataService] Error sending results email:", error);
      return false;
    }
  },

  getVisitors: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/visitors');
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (error) {
      console.error("[DataService] Error getting visitors:", error);
      return [];
    }
  },

  trackVisit: async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/track-visit', { method: 'POST' });
      return res.ok;
    } catch (error) {
      console.error("[DataService] Error tracking visit:", error);
      return false;
    }
  },

  uploadAsset: async (type: 'logo' | 'favicon', file: File): Promise<boolean> => {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      const res = await fetch('/api/upload-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data: base64,
          mimeType: file.type
        })
      });
      return res.ok;
    } catch (error) {
      console.error("[DataService] Error uploading asset:", error);
      return false;
    }
  }
};
