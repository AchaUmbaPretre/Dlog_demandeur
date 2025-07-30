import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/authSlice';
import { store } from '../redux/store';



function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        if (token) dispatch(setToken(token));
        if (user) dispatch(setUser(JSON.parse(user || '{}')));
      } catch (error) {
        console.error('Erreur de chargement de session', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <StatusBar hidden />
        <Slot />
      </AuthInitializer>
    </Provider>
  );
}