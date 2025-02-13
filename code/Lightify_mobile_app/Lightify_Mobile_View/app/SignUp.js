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
// import { useNavigation } from "@react-navigation/native";

// const SignupScreen = () => {
//   // Navigation hook
//   const navigation = useNavigation();

//   // State for form inputs
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // Signup Function
//   const handleSignup = async () => {
//     // Validation
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
//         "http://192.168.1.5:8080/api/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ username, email, password }),
//         }
//       );

//       console.log("Response Status:", response.status);
//       const textResponse = await response.text();
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
//       console.log(username, password, email);

//       console.log(username, password, email);
//       Alert.alert("Error", "Failed to connect to the server");
//       console.error("Network Error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Signup</Text>
//       <Text style={styles.subtitle}>Just some details to get you in.!</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         placeholderTextColor="#ccc"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#ccc"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         placeholderTextColor="#ccc"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
//         <Text style={styles.signupButtonText}>Signup</Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>Or</Text>

//       <View style={styles.socialContainer}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="github" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // Styles remain the same
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1c1c1c",
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#aaa",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   input: {
//     backgroundColor: "#2c2c2c",
//     borderWidth: 1,
//     borderColor: "#444",
//     borderRadius: 8,
//     color: "#fff",
//     paddingHorizontal: 15,
//     height: 50,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   signupButton: {
//     backgroundColor: "#4A00E0",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   signupButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   orText: {
//     textAlign: "center",
//     color: "#aaa",
//     fontSize: 14,
//     marginVertical: 20,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   socialButton: {
//     backgroundColor: "#2c2c2c",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
// });

// export default SignupScreen;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const navigation = useNavigation();

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
      const response = await fetch(
        "http://192.168.1.5:8080/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const textResponse = await response.text();
      console.log("Response Status:", response.status);
      console.log("Raw Response:", textResponse);

      if (response.ok) {
        Alert.alert("Success", "Signup successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", `Signup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-5 justify-center">
      <Text className="text-3xl font-bold text-white text-center mb-2">
        Signup
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-8">
        Just some details to get you in.!
      </Text>

      <TextInput
        className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="bg-gray-800 border border-gray-700 rounded-lg text-white p-4 mb-4"
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        className="bg-indigo-600 py-4 rounded-lg mt-2"
        onPress={handleSignup}
      >
        <Text className="text-white text-center font-bold text-lg">Signup</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 text-sm my-6">Or</Text>

      <View className="flex-row justify-center">
        <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
          <Icon name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
          <Icon name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-800 w-12 h-12 rounded-full justify-center items-center mx-2">
          <Icon name="github" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;
