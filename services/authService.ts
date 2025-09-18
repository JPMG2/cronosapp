import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  password: string;
  device_name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id?: string;
    email: string;
    name: string;
    role?: string;
  };
  token?: string; // JWT token for database auth
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export class AuthService {
  private static readonly API_BASE_URL = 'http://192.168.0.186:8000'
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'userData';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/api/login`, {
        ...credentials,
          device_name: 'mobile'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = response.data;

        if (data.token) {

        await this.storeToken(data.token);
        if (data.user) {
          await this.storeUser(data.user);
        }

        return {
          success: true,
          message: data.message || 'Login exitoso',
          user: data.user,
          token: data.token
        };
      }

      return {
        success: false,
        message: data.message || 'Credenciales inválidas'
      };
    } catch (error: any) {
      
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Error de conexión con el servidor'
        };
      } else {
        // Other error
        return {
          success: false,
          message: 'Error inesperado'
        };
      }
    }
  }

  static async logout(): Promise<void> {
    try {
      // Optional: Call logout endpoint on Laravel API
      const token = await this.getToken();
      if (token) {
        try {
          await axios.post(`${this.API_BASE_URL}/api/logout`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
        } catch (error) {
          console.log('Logout API call failed, but clearing local data anyway');
        }
      }

      // Clear stored data
      await this.clearToken();
      await this.clearUser();
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Token management methods
  static async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  static async clearToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  // User data management methods
  static async storeUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
     
      throw error;
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  static async clearUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // Authentication state methods
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  static async validateToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;

      const response = await axios.get(`${this.API_BASE_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      await this.clearToken();
      await this.clearUser();
      return false;
    }
  }

  // Helper method to get authorization header
  static async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    const token = await this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}