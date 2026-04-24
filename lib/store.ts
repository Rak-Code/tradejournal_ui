import { create } from 'zustand';
import { User } from './types';
import { apiClient } from './api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.login(username, password);
      if (response.data) {
        const { token, user } = response.data;
        apiClient.setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await apiClient.logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  setToken: (token: string) => {
    set({ token });
    apiClient.setToken(token);
    localStorage.setItem('authToken', token);
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token });
          apiClient.setToken(token);
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
  },
}));
