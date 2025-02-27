// import { View, Text, StyleSheet, Button } from "react-native";
// import { useRouter } from "expo-router";

// export default function HomeScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* Title */}
//       <Text style={styles.title}>Welcome to Lightify</Text>
//       <Text style={styles.subtitle}>Your smart IoT lighting solution.</Text>

//       {/* Navigation Buttons */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Go to Explore"
//           onPress={() => router.push("/explore")}
//         />
//         <View style={styles.buttonSpacing}>
//           <Button
//             title="Go to Login"
//             onPress={() => router.push("/auth/login")}
//           />
//         </View>
//         {/* <View style={styles.buttonSpacing}>
//           <Button
//             title="Add Light"
//             onPress={() => router.push("/AddLight")}
//           />
//         </View> */}
//         <View style={styles.buttonSpacing}>
//           <Button
//             title="Sign Up"
//             onPress={() => router.push("/auth/signup")}
//           />
//         </View>
//         {/* <View style={styles.buttonSpacing}>
//           <Button
//             title="Add Room"
//             onPress={() => router.push("/Room/AddRoom")}
//           />
//         </View> */}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "gray",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonSpacing: {
//     marginTop: 10,
//     width: "100%",
//   },
// });


// import { View, Text, StyleSheet, Button } from "react-native";
// // Expo Router's navigation hook
// import { useRouter } from "expo-router";

// export default function HomeScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Lightify</Text>
//       <Text style={styles.subtitle}>Your smart IoT lighting solution.</Text>

//       <View style={styles.buttonContainer}>
//         {/* Navigate to /explore */}
//         <Button
//           title="Go to Explore"
//           onPress={() => router.push("/explore")}
//         />

//         <View style={styles.buttonSpacing}>
//           {/* Navigate to /auth/login */}
//           <Button
//             title="Go to Login"
//             onPress={() => router.push("/auth/login")}
//           />
//         </View>

//         <View style={styles.buttonSpacing}>
//           {/* Navigate to /auth/signup */}
//           <Button
//             title="Sign Up"
//             onPress={() => router.push("/auth/signup")}
//           />
//         </View>
//         <View style={styles.buttonSpacing}>
//           {/* Navigate to /Room/AddRoom */}
//           <Button
//             title="Add Room"
//             onPress={() => router.push("/Room/AddRoom")}
//           />
//         </View>
//         <View style={styles.buttonSpacing}>
//           {/* Navigate to /Room/AddRoom */}
//           <Button
//             title="Add Schedule"
//             onPress={() => router.push("/Room/AddSchedule")}
//           />
//         </View>
//         <View style={styles.buttonSpacing}>
//           {/* Navigate to /Room/AddRoom */}
//           <Button
//             title="Home View"
//             onPress={() => router.push("/Room/Home_View")}
//           />
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "gray",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonSpacing: {
//     marginTop: 10,
//     width: "100%",
//   },
// });




// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router"; // ✅ Use Expo Router for navigation

// const WelcomeScreen = () => {
//   const router = useRouter(); // ✅ Correct way to navigate in Expo Router

//   return (
//     <View style={styles.container}>
//       {/* Top Text Section */}
//       <Text style={styles.title}>HELLO</Text>
//       <Text style={styles.subtitle}>Your smart IoT lighting solution</Text>

//       {/* Buttons */}
//       <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/login")}>
//         <Text style={styles.signInText}>Sign In</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/auth/signup")}>
//         <Text style={styles.signUpText}>Sign Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#F5F5F5", // ✅ Light background for a clean look
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#1a1a3d",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 40,
//   },
//   signInButton: {
//     backgroundColor: "#1a1a3d",
//     paddingVertical: 15,
//     width: "80%",
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   signInText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   signUpButton: {
//     backgroundColor: "white",
//     paddingVertical: 15,
//     width: "80%",
//     borderRadius: 25,
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#1a1a3d",
//   },
//   signUpText: {
//     color: "#1a1a3d",
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });

// export default WelcomeScreen;


import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // ✅ Use Expo Router for navigation

const WelcomeScreen = () => {
  const router = useRouter(); // ✅ Correct way to navigate in Expo Router

  return (
    <View style={styles.container}>
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
    marginBottom: 15,
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
