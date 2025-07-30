import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import api from '../../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        username: email,
        password,
      });

      const token = response.data?.accessToken;
      const { accessToken, ...user } = response.data;

      if (token) {
        dispatch(loginSuccess({ token: accessToken, user }));
        Alert.alert('Succès', 'Connexion réussie !');
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Erreur', 'Le token est manquant dans la réponse.');
      }
    } catch (error: any) {
      console.error('Erreur de connexion :', error);
      const message =
        error?.response?.status === 401
          ? 'Identifiants incorrects.'
          : 'Une erreur est survenue. Veuillez réessayer.';
      Alert.alert('Échec de la connexion', message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bienvenue 👋</Text>
        <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>
            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity
            style={[styles.button, (!email || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  togglePassword: {
    color: '#007bff',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
