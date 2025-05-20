




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

// const SignupScreen = () => {
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSignup = async () => {
//     if (isSubmitting) return;

//     if (!username || !email || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields are required!");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       Alert.alert("Error", "Please enter a valid email address!");
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert("Error", "Password must be at least 6 characters long!");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match!");
//       return;
//     }

//     setIsSubmitting(true);
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
//         router.push("/auth/login");
//       } else {
//         Alert.alert("Error", `Signup failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Signup Error:", error);
//       if (error.response) {
//         const message =
//           error.response.data?.message || error.response.statusText || "Signup failed.";
//         Alert.alert("Signup Failed", message);
//       } else if (error.request) {
//         Alert.alert(
//           "Network Error",
//           "No response from the server. Please check your connection."
//         );
//       } else {
//         Alert.alert("Error", "An unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <Text style={styles.subtitle}>Just some details to get you in!</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         placeholderTextColor="#FFD700"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#FFD700"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#FFD700"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         placeholderTextColor="#FFD700"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity
//         style={[styles.signupButton, isSubmitting && { opacity: 0.6 }]}
//         onPress={handleSignup}
//         disabled={isSubmitting}
//       >
//         <Text style={styles.signupText}>
//           {isSubmitting ? "Signing Up..." : "Sign Up"}
//         </Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>Or</Text>

//       <View style={styles.socialContainer}>
//         <TouchableOpacity
//           style={styles.socialButton}
//           onPress={() => Alert.alert("Google Sign-in", "Coming soon...")}
//         >
//           <Icon name="google" size={24} color="#FFD700" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.socialButton}
//           onPress={() => Alert.alert("Facebook Sign-in", "Coming soon...")}
//         >
//           <Icon name="facebook" size={24} color="#FFD700" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.socialButton}
//           onPress={() => Alert.alert("GitHub Sign-in", "Coming soon...")}
//         >
//           <Icon name="github" size={24} color="#FFD700" />
//         </TouchableOpacity>

//       </View>
//     </View>
//   );
// };

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
//   signupButton: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   signupText: {
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

// export default SignupScreen;





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

const SignupScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validateFields = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format.";
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (isSubmitting) return;
    if (!validateFields()) return;

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const response = await axiosClient.post("/api/auth/register", {
        username,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSuccessMessage("Signup successful! Redirecting...");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setErrorMessage(`Signup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            error.response.statusText ||
            "Signup failed."
        );
      } else if (error.request) {
        setErrorMessage("No response from server. Check your connection.");
      } else {
        setErrorMessage("Unexpected error occurred.");
      }
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

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Just some details to get you in!</Text>

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
        placeholder="Email"
        placeholderTextColor="#FFD700"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {fieldErrors.email && (
        <Text style={styles.inlineError}>{fieldErrors.email}</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#FFD700"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {fieldErrors.confirmPassword && (
        <Text style={styles.inlineError}>{fieldErrors.confirmPassword}</Text>
      )}

      <TouchableOpacity
        style={[styles.signupButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handleSignup}
        disabled={isSubmitting}
      >
        <Text style={styles.signupText}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      {/* ✅ Social Login Buttons with Alert */}
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

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Alert.alert("GitHub Sign-in", "Coming soon...")}
        >
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

export default SignupScreen;
