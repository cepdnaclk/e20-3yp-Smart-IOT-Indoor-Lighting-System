import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons for bulb icon
import { useRouter } from "expo-router"; // ✅ Use Expo Router for navigation
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
  const router = useRouter(); // ✅ Correct way to navigate in Expo Router

  return (
    <View style={styles.container}>
      {/* Bulb Icon at the Top */}
      <View style={styles.iconContainer}>
        <Ionicons name="bulb-outline" size={80} color="#FFD700" />
      </View>
      
      {/* Top Text Section */}
      <Text style={styles.title}>LIGHTIFY</Text>
      <Text style={styles.subtitle}>Your smart lighting solution</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/login")}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/auth/signup")}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000", // ✅ Black background for a bold look
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700", // ✅ Dark yellow title for a strong contrast
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF", // ✅ White subtitle for readability
    marginBottom: 40,
  },
  signInButton: {
    backgroundColor: "#FFD700", // ✅ Dark yellow button
    paddingVertical: 10,
    width: "60%",
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#000", // ✅ Black text for contrast
    fontSize: 18,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    width: "60%",
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700", // ✅ Dark yellow border
  },
  signUpText: {
    color: "#FFD700", // ✅ Dark yellow text
    fontSize: 18,
    fontWeight: "600",
  },
});

export default WelcomeScreen;