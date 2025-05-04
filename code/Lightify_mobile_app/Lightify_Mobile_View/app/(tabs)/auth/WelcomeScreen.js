
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#dfefff', '#89c2ff']} style={styles.container}>
      {/* Bulb Icon at the Top */}
      <View style={styles.iconContainer}>
        <Ionicons name="bulb-outline" size={80} color="#ffcc00" />
      </View>
      
      {/* Greeting Text */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Illuminate your world with smart lighting</Text>
      
      {/* Illustration (Uncomment if images are available) */}
      {/* <Image source={require('../assets/cityscape.png')} style={styles.illustration} />
      <Image source={require('../assets/car.png')} style={styles.car} /> */}
      
      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      
      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0a0a2a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#1a1a3d',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signInText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a3d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpText: {
    color: '#1a1a3d',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;


