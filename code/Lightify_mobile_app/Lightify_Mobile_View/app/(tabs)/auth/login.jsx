


// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import axiosClient from "../../../utils/axiosClient";

// export default function Login() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const response = await axiosClient.post(
//         "/api/auth/login",
//         { username, password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.status === 200) {
//         Alert.alert("Success", "Login successful!");
//         router.push("/Room/Home_View");
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
//       <Text style={styles.title}>Welcome to Lightify</Text>
//       <Text style={styles.subtitle}>Login to your smart lighting system</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         placeholderTextColor="#FFD700"
//         value={username}
//         onChangeText={setUsername}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#FFD700"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//         <Text style={styles.loginText}>Login</Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>Or login with</Text>

//       <View style={styles.socialContainer}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google" size={24} color="#FFD700" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="facebook" size={24} color="#FFD700" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FFD700",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#FFF",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   input: {
//     backgroundColor: "#1F1F1F",
//     borderColor: "#FFD700",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 15,
//     color: "#FFF",
//     marginBottom: 15,
//   },
//   loginButton: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   loginText: {
//     color: "#000",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   orText: {
//     textAlign: "center",
//     color: "#FFF",
//     fontSize: 14,
//     marginVertical: 25,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   socialButton: {
//     backgroundColor: "#1F1F1F",
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 8,
//   },
// });



import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../../utils/axiosClient";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (errorMessage !== "") {
      const timeout = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage !== "") {
      const timeout = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const validateFields = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!password.trim()) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (isSubmitting) return;
    if (!validateFields()) return;

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const response = await axiosClient.post(
        "/api/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => router.push("/Room/Home_View"), 2000);
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {isSubmitting && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}

      <Text style={styles.title}>Welcome to Lightify</Text>
      <Text style={styles.subtitle}>Login to your smart lighting system</Text>

      {errorMessage !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {successMessage !== "" && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#FFD700"
        value={username}
        onChangeText={setUsername}
      />
      {fieldErrors.username && (
        <Text style={styles.inlineError}>{fieldErrors.username}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFD700"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {fieldErrors.password && (
        <Text style={styles.inlineError}>{fieldErrors.password}</Text>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or login with</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Alert.alert("Google Sign-in", "Coming soon...")}
        >
          <Icon name="google" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Alert.alert("Facebook Sign-in", "Coming soon...")}
        >
          <Icon name="facebook" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  spinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
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
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
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
  errorBox: {
    backgroundColor: "#8B8000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  successBox: {
    backgroundColor: "#2e7d32",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  successText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  inlineError: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
});
