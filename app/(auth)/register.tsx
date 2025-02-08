import { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from "../../firebaseConfig"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();

  const checkUsernameAvailability = async () => {
    if (username.trim() === '') {
      setUsernameError('Username is required');
      setIsUsernameAvailable(false);
      return;
    }

    const isTaken = await checkIfUsernameExists(username);
    if (isTaken) {
      setUsernameError('Username is already taken');
      setIsUsernameAvailable(false);
    } else {
      setUsernameError('');
      setIsUsernameAvailable(true);
    }
  };

  const handleRegister = async () => {
    if (!isUsernameAvailable) {
      Alert.alert('Error', 'Please choose a valid username');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: username,
      };
      dispatch(loginSuccess(user));
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Username Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          onBlur={checkUsernameAvailability}
          onSubmitEditing={() => emailInputRef.current?.focus()}
          autoCapitalize="none"
        />
        {isUsernameAvailable && username.length !== 0 && (
          <MaterialIcons 
            name="check-circle" 
            size={20} 
            color="green" 
            style={styles.checkIcon} 
          />
        )}
      </View>
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      {/* Email Input */}
      <TextInput
        ref={emailInputRef}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#ffffff',
    fontSize: 16,
    width: '100%',
  },
  checkIcon: {
    position: 'absolute',
    right: 15,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

async function checkIfUsernameExists(username: string): Promise<boolean> {
  const takenUsernames = ['admin', 'test', 'user'];
  return takenUsernames.includes(username.toLowerCase());
}