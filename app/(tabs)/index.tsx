import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/authSlice';
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Index() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    auth.signOut().then(()=>{
      dispatch(logout())
      router.replace("/(tabs)/explore")
    }).catch((error)=>{
      Alert.alert("Error",error.message)
    })
    // Optionally, you can also sign out from Firebase here if needed
  };

  console.log("User data from Redux:", user); // ✅ Debugging log
  return (
    <ProtectedRoute>
    <View style={styles.container}>
      <Text style={styles.title}>Page Port</Text>
      {user?.displayName && (
        <Text style={styles.username}>Welcome, {user.displayName}</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  username: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
