export interface LoginCredentials {
  email: string;
  password: string;
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

export class AuthService {
  private static readonly VALID_CREDENTIALS = {
    email: 'admin@admin.com',
    password: '123456'
  };

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Replace this with actual database API call
      // const response = await fetch('YOUR_API_ENDPOINT/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();

      // Simulate API call delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { email, password } = credentials;

      // TEMPORARY: Remove this when connecting to database
      if (email === this.VALID_CREDENTIALS.email && password === this.VALID_CREDENTIALS.password) {
        return {
          success: true,
          message: 'Login exitoso',
          user: {
            id: '1',
            email: email,
            name: 'Administrador',
            role: 'admin'
          },
          token: 'mock-jwt-token-123' // In real app, this comes from your API
        };
      }

      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    } catch (error) {
      console.error('AuthService login error:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  static async logout(): Promise<void> {
    // Here you would clear tokens, etc.
    console.log('Usuario deslogueado');
  }
}