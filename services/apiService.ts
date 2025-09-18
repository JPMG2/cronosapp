import axios from 'axios';
import { AuthService } from './authService';

export interface DashboardData {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  stats?: {
    totalProjects?: number;
    activeProjects?: number;
    completedTasks?: number;
  };
}

export class ApiService {
  private static readonly API_BASE_URL = 'http://192.168.0.186:8000';

  // Private method that automatically adds token to all requests
  private static async makeRequest(endpoint: string, options: any = {}) {
    try {
      // Get authorization header (includes token automatically)
      const authHeaders = await AuthService.getAuthHeader();

      const response = await axios.request({
        url: `${this.API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeaders, // This automatically adds: Authorization: "Bearer your-token"
        },
        ...options
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error(`API Error for ${endpoint}:`, error);

      if (error.response?.status === 401) {
        // Token expired or invalid - logout user
        await AuthService.logout();
        return {
          success: false,
          error: 'Session expired. Please login again.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Error connecting to server'
      };
    }
  }

  // Dashboard endpoint - this is your only API call for now
  static async getDashboard(): Promise<{success: boolean, data?: DashboardData, error?: string}> {
    return this.makeRequest('/api/dashboard', {
      method: 'GET'
    });
  }

  // You can easily add more endpoints later:
  // static async getUser() {
  //   return this.makeRequest('/api/user', { method: 'GET' });
  // }

  // static async updateProfile(userData: any) {
  //   return this.makeRequest('/api/user', {
  //     method: 'PUT',
  //     data: userData
  //   });
  // }
}