import { create } from 'zustand';

interface AuthState {
  token: string | null;
  studentId: string | null;
  role: string | null;
  userId: number | null;
  login: (token: string, studentId: string, role: string, userId: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  studentId: typeof window !== 'undefined' ? localStorage.getItem('studentId') : null,
  role: typeof window !== 'undefined' ? localStorage.getItem('role') : null,
  userId: typeof window !== 'undefined' ? Number(localStorage.getItem('userId')) || null : null,
  
  login: (token, studentId, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('studentId', studentId);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId.toString());
    set({ token, studentId, role, userId });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    set({ token: null, studentId: null, role: null, userId: null });
  },
}));
