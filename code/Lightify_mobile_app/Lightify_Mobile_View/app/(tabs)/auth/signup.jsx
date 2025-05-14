// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useNavigation } from "@react-navigation/native";

// const SignupScreen = () => {
//   const navigation = useNavigation();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = async () => {
//     if (!username || !email || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields are required!");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match!");
//       return;
//     }
//     try {
//       const response = await fetch(
//         //"http://192.168.1.5:8080/api/auth/register",
//         "http://localhost:8080/api/auth/register",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, email, password }),
//         }
//       );

//       const textResponse = await response.text();
//       console.log("Response Status:", response.status);
//       console.log("Raw Response:", textResponse);

//       if (response.ok) {
//         Alert.alert("Success", "Signup successful!");
//         setUsername("");
//         setEmail("");
//         setPassword("");
//         setConfirmPassword("");
//         navigation.navigate("Login");
//       } else {
//         Alert.alert("Error", `Signup failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       Alert.alert("Error", "Failed to connect to the server");
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-900 p-5 justify-center">
//       <Text className="text-3xl font-bold text-white text-center mb-2">
//         Signup
//       </Text>
//       <Text className="text-sm text-gray-400 text-center mb-8">
//         Just some details to get you in.!
//       </Text>

//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Username"
//         placeholderTextColor="#ccc"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Email"
//         placeholderTextColor="#ccc"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Confirm Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity
//         className="bg-indigo-600 py-4 rounded-lg mt-2"
//         onPress={handleSignup}
//       >
//         <Text className="text-white text-center font-bold text-lg">Signup</Text>
//       </TouchableOpacity>

//       <Text className="text-center text-gray-400 text-sm my-6">Or</Text>

//       <View className="flex-row justify-center">
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="github" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SignupScreen;



// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useNavigation } from "@react-navigation/native";
// import axiosClient from "../../../utils/axiosClient";

// const SignupScreen = () => {
//   const navigation = useNavigation();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

// const handleSignup = async () => {
//   if (!username || !email || !password || !confirmPassword) {
//     Alert.alert("Error", "All fields are required!");
//     return;
//   }
//   if (password !== confirmPassword) {
//     Alert.alert("Error", "Passwords do not match!");
//     return;
//   }
//   try {
//     const response = await axiosClient.post("/api/auth/register", {
//       username,
//       email,
//       password,
//     });

//     console.log("Response Status:", response.status);
//     console.log("Response Data:", response.data);

//     if (response.status === 200 || response.status === 201) {
//       Alert.alert("Success", "Signup successful!");
//       setUsername("");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");
//       navigation.navigate("login");
//     } else {
//       Alert.alert("Error", `Signup failed: ${response.statusText}`);
//     }
//   } catch (error) {
//     console.error("Network Error:", error);
//     if (error.response) {
//       Alert.alert(
//         "Error",
//         `Signup failed: ${error.response.data.message || error.response.statusText}`
//       );
//     } else {
//       Alert.alert("Error", "Failed to connect to the server");
//     }
//   }
// };

//   // const handleSignup = async () => {
//   //   if (!username || !email || !password || !confirmPassword) {
//   //     Alert.alert("Error", "All fields are required!");
//   //     return;
//   //   }
//   //   if (password !== confirmPassword) {
//   //     Alert.alert("Error", "Passwords do not match!");
//   //     return;
//   //   }
//   //   try {
//   //     const response = await axios.post(
//   //       "http://localhost:8080/api/auth/register",
//   //       { username, email, password },
//   //       {
//   //         headers: { "Content-Type": "application/json" },
//   //       }
//   //     );

//   //     console.log("Response Status:", response.status);
//   //     console.log("Response Data:", response.data);

//   //     if (response.status === 200 || response.status === 201) {
//   //       Alert.alert("Success", "Signup successful!");
//   //       setUsername("");
//   //       setEmail("");
//   //       setPassword("");
//   //       setConfirmPassword("");
//   //       navigation.navigate("Login");
//   //     } else {
//   //       Alert.alert("Error", `Signup failed: ${response.statusText}`);
//   //     }
//   //   } catch (error) {
//   //     console.error("Network Error:", error);
//   //     if (error.response) {
//   //       Alert.alert(
//   //         "Error",
//   //         `Signup failed: ${error.response.data.message || error.response.statusText}`
//   //       );
//   //     } else {
//   //       Alert.alert("Error", "Failed to connect to the server");
//   //     }
//   //   }
//   // };

//   return (
//     <View className="flex-1 bg-gray-900 p-5 justify-center">
//       <Text className="text-3xl font-bold text-white text-center mb-2">
//         Signup
//       </Text>
//       <Text className="text-sm text-gray-400 text-center mb-8">
//         Just some details to get you in.!
//       </Text>

//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Username"
//         placeholderTextColor="#ccc"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Email"
//         placeholderTextColor="#ccc"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
//         placeholder="Confirm Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity
//         className="bg-indigo-600 py-4 rounded-lg mt-2"
//         onPress={handleSignup}
//       >
//         <Text className="text-white text-center font-bold text-lg">Signup</Text>
//       </TouchableOpacity>

//       <Text className="text-center text-gray-400 text-sm my-6">Or</Text>

//       <View className="flex-row justify-center">
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="github" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SignupScreen;


// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useRouter } from "expo-router"; // ✅ Use Expo Router for navigation
// import axiosClient from "../../../utils/axiosClient";

// const SignupScreen = () => {
//   const router = useRouter(); // ✅ Expo Router navigation

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = async () => {
//     if (!username || !email || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields are required!");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match!");
//       return;
//     }
//     try {
//       const response = await axiosClient.post("/api/auth/register", {
//         username,
//         email,
//         password,
//       });

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert("Success", "Signup successful!");
//         setUsername("");
//         setEmail("");
//         setPassword("");
//         setConfirmPassword("");
//         router.push("/auth/login"); // ✅ Navigate using Expo Router
//       } else {
//         Alert.alert("Error", `Signup failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       if (error.response) {
//         Alert.alert(
//           "Error",
//           `Signup failed: ${error.response.data.message || error.response.statusText}`
//         );
//       } else {
//         Alert.alert("Error", "Failed to connect to the server");
//       }
//     }
//   };

//   return (
//     <View className="flex-1 bg-black p-5 justify-center">
//       {/* Title */}
//       <Text className="text-3xl font-bold text-yellow-400 text-center mb-2">
//         Sign Up
//       </Text>
//       <Text className="text-sm text-white text-center mb-8">
//         Just some details to get you in!
//       </Text>

//       {/* Input Fields */}
//       <TextInput
//         className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
//         placeholder="Username"
//         placeholderTextColor="#FFD700"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
//         placeholder="Email"
//         placeholderTextColor="#FFD700"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
//         placeholder="Password"
//         placeholderTextColor="#FFD700"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         className="bg-gray-900 border border-yellow-400 rounded-lg text-white p-4 mb-4"
//         placeholder="Confirm Password"
//         placeholderTextColor="#FFD700"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       {/* Signup Button */}
//       <TouchableOpacity
//         className="bg-yellow-400 py-4 rounded-lg mt-2"
//         onPress={handleSignup}
//       >
//         <Text className="text-black text-center font-bold text-lg">Sign Up</Text>
//       </TouchableOpacity>

//       {/* OR Divider */}
//       <Text className="text-center text-white text-sm my-6">Or</Text>

//       {/* Social Media Login */}
//       <View className="flex-row justify-center">
//         <TouchableOpacity className="bg-gray-900 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="google" size={24} color="#FFD700" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-900 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="facebook" size={24} color="#FFD700" />
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-gray-900 w-12 h-12 rounded-full justify-center items-center mx-2">
//           <Icon name="github" size={24} color="#FFD700" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SignupScreen;


import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../../utils/axiosClient";

const SignupScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    try {
      const response = await axiosClient.post("/api/auth/register", {
        username,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Signup successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.push("/auth/login");
      } else {
        Alert.alert("Error", `Signup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      if (error.response) {
        Alert.alert(
          "Error",
          `Signup failed: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        Alert.alert("Error", "Failed to connect to the server");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Just some details to get you in!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#FFD700"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#FFD700"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFD700"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#FFD700"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="google" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="github" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1F1F1F",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    color: "#FFF",
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  signupText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  orText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 14,
    marginVertical: 25,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    backgroundColor: "#1F1F1F",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
});

export default SignupScreen;
