import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-tkiz.onrender.com';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to every request
    this.instance.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses and errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // If 401, clear token and redirect to login
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.instance.post<ApiResponse<any>>('/auth/login', {
      username,
      password,
    });
    return response.data;
  }

  async logout() {
    this.clearToken();
  }

  // Trade endpoints
  async getTrades(page = 1, per_page = 10) {
    const response = await this.instance.get<ApiResponse<any>>('/trades', {
      params: { page, per_page },
    });
    return response.data;
  }

  async getTrade(id: string) {
    const response = await this.instance.get<ApiResponse<any>>(`/trades/${id}`);
    return response.data;
  }

  async createTrade(data: any) {
    const response = await this.instance.post<ApiResponse<any>>('/trades', data);
    return response.data;
  }

  async updateTrade(id: string, data: any) {
    const response = await this.instance.put<ApiResponse<any>>(`/trades/${id}`, data);
    return response.data;
  }

  async deleteTrade(id: string) {
    const response = await this.instance.delete<ApiResponse<any>>(`/trades/${id}`);
    return response.data;
  }

  // Image upload endpoints
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.instance.post<ApiResponse<{ image_url: string }>>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Analytics endpoints
  async getAnalyticsOverview() {
    const response = await this.instance.get<ApiResponse<any>>('/analytics/overview');
    return response.data;
  }

  async getMonthlyStats(year: number, month: number) {
    const response = await this.instance.get<ApiResponse<any>>('/analytics/monthly', {
      params: { year, month },
    });
    return response.data;
  }

  async getWeeklyStats(year: number, week: number) {
    const response = await this.instance.get<ApiResponse<any>>('/analytics/weekly', {
      params: { year, week },
    });
    return response.data;
  }

  // Settings endpoints
  async getSettings() {
    const response = await this.instance.get<ApiResponse<any>>('/settings');
    return response.data;
  }

  async updateSettings(data: any) {
    const response = await this.instance.put<ApiResponse<any>>('/settings', data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
