import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ValidationUtils } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

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
        // Context automatically handles user state
        console.log('User logged in successfully');
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
        <View style={styles.logoPlaceholder}>
            <Image
                source={require('@/assets/images/logoc.png')}
                style={{ width: 150, height: 150 }}
            />
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
          <Text style={styles.forgotPasswordText}>Olvido contraseña?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
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
  },
  sloganText: {
    fontSize: 22,
    color: '#546793',
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginTop: 25,
    textAlign: 'center',
  },
});
