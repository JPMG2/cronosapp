import { useAuth } from '@/contexts/AuthContext';
import { ValidationUtils } from '@/utils/validation';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(protected)/dashboard');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setErrors({});
    const validation = ValidationUtils.validateLoginForm(email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const response = await login({ email, password, device_name: 'mobile' });

      if (response.success) {
        Alert.alert('Éxito', response.message);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
          <Text style={styles.sloganText}>Gestionamos el tiempo</Text>
        </View>

        <View style={[styles.formContainer, { width: screenWidth * 0.9 }]}>
          <TextInput
            style={[
                styles.input,
                errors.email ? styles.inputError : (focusedInput === 'email' && styles.inputFocused),
           ]}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[
                styles.input,
                errors.password ? styles.inputError : (focusedInput === 'password' && styles.inputFocused),
           ]}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbebfcff',
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
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sloganText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },
  input: {
    height: screenWidth < 360 ? 45 : 50,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: screenWidth < 360 ? 14 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: '#f16565ff',
    borderWidth: 2,
  },
  errorText: {
    color: '#f16565ff',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    height: screenWidth < 360 ? 45 : 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  inputFocused: Platform.select({
    ios: {
      borderColor: '#60a5fa',
      borderWidth: 2,
      backgroundColor: 'rgba(96, 165, 250, 0.05)',
      shadowColor: '#60a5fa',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    android: {
      borderColor: '#60a5fa',
      borderWidth: 2,
      backgroundColor: 'rgba(96, 165, 250, 0.05)',
      borderStyle: 'solid',
      elevation: 0,
    },
  }),
});
