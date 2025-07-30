import { logout } from '@/redux/authSlice';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface User {
  nom: string;
  email: string;
}

const Profil = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(async () => {
      dispatch(logout());
      await AsyncStorage.multiRemove(['token', 'user']);
      router.replace('/login');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="user-circle" size={80} color="#555" style={styles.icon} />
      <Text style={styles.name}>{user?.nom || 'Utilisateur inconnu'}</Text>
      <Text style={styles.email}>{user?.email || 'Aucun e-mail'}</Text>

      <Pressable style={styles.logoutBtn} onPress={handleLogout} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.btnContent}>
            <AntDesign name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  icon: {
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  logoutBtn: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
