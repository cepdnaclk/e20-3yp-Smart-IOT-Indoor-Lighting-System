// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const Login = () => {
//   return (
//     <View style={styles.container}>
//       {/* Logo */}
//       {/* <Image
//         source={require('./assets/images/icon.png')} // Replace with your actual image path
//         style={styles.logo}
//       /> */}

//       {/* Title */}
//       <Text style={styles.title}>Welcome to SmartLights</Text>

//       {/* Input Fields */}
//       <TextInput placeholder="Username" style={styles.input} />
//       <TextInput placeholder="Password" style={styles.input} keyboardType="password" />

//       {/* Submit Button */}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>

//       {/* Or login with */}
//       <Text style={styles.orText}>or login with</Text>

//       {/* Social Media Login */}
//       <View style={styles.socialContainer}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: '#FFF',
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//     marginBottom: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   orText: {
//     fontSize: 14,
//     color: '#666',
//     marginVertical: 10,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '50%',
//   },
//   socialButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     elevation: 3,
//   },
// });

// export default Login;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import axiosClient from "../../../utils/axiosClient";
// import { useNavigation } from "@react-navigation/native";

// export default function Login() {
//   const navigation = useNavigation();

//   // Local state for username and password
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   // Function to handle the login process
//   const handleLogin = async () => {
//     try {
//       // Make POST request to /api/auth/login
//       // IMPORTANT: Adjust the base URL for your environment
//       const response = await axiosClient.post(
//         "/api/auth/login",
//         { username, password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // If the request is successful, response.status might be 200
//       if (response.status === 200) {
//         // Navigate to AddRoom screen
//         navigation.navigate("AddRoom");
//       } else {
//         Alert.alert("Login Failed", "Invalid username or password.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       Alert.alert("Login Failed", "Invalid username or password.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Title */}
//       <Text style={styles.title}>Welcome to SmartLights</Text>

//       {/* Username Input */}
//       <TextInput
//         placeholder="Username"
//         style={styles.input}
//         value={username}
//         onChangeText={setUsername}
//       />

//       {/* Password Input (secureTextEntry for hidden input) */}
//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       {/* Login Button */}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>

//       {/* Or login with */}
//       <Text style={styles.orText}>or login with</Text>

//       {/* Social Media Login */}
//       <View style={styles.socialContainer}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: "#FFF",
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 15,
//     borderRadius: 5,
//     marginBottom: 20,
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   orText: {
//     fontSize: 14,
//     color: "#666",
//     marginVertical: 10,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "50%",
//   },
//   socialButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     elevation: 3,
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../../utils/axiosClient";
import { useRouter } from "expo-router"; // ✅ Use Expo Router

export default function Login() {
  const router = useRouter(); // ✅ Expo Router navigation

  // Local state for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Make POST request to /api/auth/login
      const response = await axiosClient.post(
        "/api/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // If login is successful
      if (response.status === 200) {
        Alert.alert("Success", "Login successful!");
        router.push("/Room/Home_View"); // ✅ Navigate using Expo Router
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  return (
    <View className="flex-1 bg-black p-5 justify-center">
      {/* Title */}
      <Text className="text-3xl font-bold text-yellow-400 text-center mb-2">
        Welcome to Lightify
      </Text>

      <Text className="text-sm text-white text-center mb-8">
        Login to your smart lighting system
      </Text>

      {/* Username Input */}
      <TextInput
        className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
        placeholder="Username"
        placeholderTextColor="#FFD700"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
        placeholder="Password"
        placeholderTextColor="#FFD700"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity
        className="bg-yellow-400 py-4 rounded-lg mt-2"
        onPress={handleLogin}
      >
        <Text className="text-black text-center font-bold text-lg">Login</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <Text className="text-center text-white text-sm my-6">Or login with</Text>

      {/* Social Media Login */}
      <View className="flex-row justify-center">
        <TouchableOpacity className="bg-gray-900 w-12 h-12 rounded-full justify-center items-center mx-2">
          <Icon name="google" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-900 w-12 h-12 rounded-full justify-center items-center mx-2">
          <Icon name="facebook" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
