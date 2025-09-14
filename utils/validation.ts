export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export class ValidationUtils {
  static validateEmail(email: string): ValidationResult {
    if (!email.trim()) {
      return { isValid: false, message: 'Email es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Formato de email inválido' };
    }

    return { isValid: true };
  }

  static validatePassword(password: string): ValidationResult {
    if (!password.trim()) {
      return { isValid: false, message: 'Contraseña es requerida' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Contraseña debe tener al menos 6 caracteres' };
    }

    return { isValid: true };
  }

  static validateLoginForm(email: string, password: string): { 
    isValid: boolean; 
    errors: { email?: string; password?: string } 
  } {
    const emailValidation = this.validateEmail(email);
    const passwordValidation = this.validatePassword(password);

    const errors: { email?: string; password?: string } = {};
    
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }
    
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}