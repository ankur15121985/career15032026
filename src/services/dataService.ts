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

  // Visitors
  getVisitors: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/admin/visitors');
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (error) {
      console.error("[DataService] Error getting visitors:", error);
      return [];
    }
  },

  saveAppointment: async (appointment: any): Promise<boolean> => {
    try {
      // Save to localStorage
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      const appointments = stored ? JSON.parse(stored) : [];
      const newAppointment = { 
        ...appointment, 
        id: appointment.id || 'appt-' + Date.now(),
        createdAt: appointment.createdAt || new Date().toISOString()
      };
      appointments.push(newAppointment);
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      
      // Try to save to API (optional)
      try {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppointment)
        });
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
  }
};
