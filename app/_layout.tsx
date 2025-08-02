import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider, useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/authSlice';
import { store } from '../redux/store';

const { height } = Dimensions.get('window');

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
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Impossible de charger la session.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/images/logo-gtm.png')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </SafeAreaView>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <AuthInitializer>
            <Slot />
          </AuthInitializer>
        <Toast position="top" topOffset={55} />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height,
  },
});
