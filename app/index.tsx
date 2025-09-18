import { useAuth } from '@/contexts/AuthContext';
import { ValidationUtils } from '@/utils/validation';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(protected)/dashboard');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    const validation = ValidationUtils.validateLoginForm(email, password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const response = await login({ email, password, device_name: 'mobile' });
      
      if (response.success) {
        Alert.alert('Éxito', response.message);
        
        // Navigate to dashboard
        router.replace('/(protected)/dashboard');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Image
              source={require('@/assets/images/logoc.png')}
              style={styles.logoImage}
            />
          </View>
        </View>
        <Text style={styles.sloganText}>Gestionamos el tiempo.</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Iniciando sesión...' : 'Inicio'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidó contraseña?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: '#e6f0ff', // azul suave que combina con fondo
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para iOS
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    // Sombra para Android
    elevation: 8,
    // Borde sutil
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sloganText: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
});