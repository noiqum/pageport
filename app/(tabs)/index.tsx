import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function Index() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("User data from Redux:", user); // ✅ Debugging log
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Port</Text>
      {user?.displayName && (
        <Text style={styles.username}>Welcome, {user.displayName}</Text>
      )}
    </View>
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
});
