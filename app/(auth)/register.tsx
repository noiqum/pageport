import { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from "../../firebaseConfig";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();

  // Setup Google Auth
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your client ID
    iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace if you have iOS client ID
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace if you have Android client ID
  });

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        };
        
        dispatch(loginSuccess(user));
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isUsernameAvailable) {
      Alert.alert('Error', 'Please choose a valid username');
      return;
    }

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
          editable={!isLoading}
        />
        {isUsernameAvailable && (
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
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Register Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
      // TODO: add google register functionality
      {/* Divider */}
     {/*  <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
 */}
      {/* Google Sign In Button */}
     {/*  <TouchableOpacity 
        style={[styles.googleButton, isLoading && styles.buttonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="gmail" size={24} color="white" />
        <Text style={[styles.buttonText,{marginLeft:4}]}>Continue with Google</Text>
      </TouchableOpacity> */}

      <TouchableOpacity 
        onPress={() => router.push('/(auth)/login')}
        disabled={isLoading}
      >
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
    fontWeight: 'bold',
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  googleIcon: {
    marginRight: 10,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#666',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

async function checkIfUsernameExists(username: string): Promise<boolean> {
  const takenUsernames = ['admin', 'test', 'user'];
  return takenUsernames.includes(username.toLowerCase());
}