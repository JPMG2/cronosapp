import { useAuth } from '@/contexts/AuthContext';
import { ApiService, DashboardData } from '@/services/apiService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data when component loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getDashboard();

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      Alert.alert('Error', 'Unexpected error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Navigation will automatically handle redirect to login
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido, {user?.name}!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Dashboard!!</Text>
        <Text style={styles.subtitle}>Solo usuarios autenticados pueden ver esto</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.label}>ID: {dashboardData?.user?.id || user?.id}</Text>
            <Text style={styles.label}>Rol: {dashboardData?.user?.role || user?.role}</Text>

            {dashboardData?.message && (
              <Text style={styles.label}>Message: {dashboardData.message}</Text>
            )}

            {dashboardData?.stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Statistics:</Text>
                <Text style={styles.label}>Total Projects: {dashboardData.stats.totalProjects || 0}</Text>
                <Text style={styles.label}>Active Projects: {dashboardData.stats.activeProjects || 0}</Text>
                <Text style={styles.label}>Completed Tasks: {dashboardData.stats.completedTasks || 0}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});