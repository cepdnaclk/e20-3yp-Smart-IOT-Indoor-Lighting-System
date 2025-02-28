




// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons"; // Icon for bulbs
// import axiosClient from "../../../utils/axiosClient"; 

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Predefined bulbs with IDs
//   const [bulbs, setBulbs] = useState([
//     { id: "101", isSelected: false },
//     { id: "102", isSelected: false },
//     { id: "103", isSelected: false },
//     { id: "104", isSelected: false },
//   ]);

//   // Toggle bulb selection
//   const handleToggleBulb = (index) => {
//     setBulbs((prevBulbs) =>
//       prevBulbs.map((bulb, i) =>
//         i === index ? { ...bulb, isSelected: !bulb.isSelected } : bulb
//       )
//     );
//   };

//   // Create room API call
//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     const selectedBulbIds = bulbs
//       .filter((bulb) => bulb.isSelected)
//       .map((bulb) => bulb.id);

//     if (selectedBulbIds.length === 0) {
//       Alert.alert("Error", "Please select at least one bulb.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         bulbs: selectedBulbIds,
//       });

//       if (response.status === 201 || response.status === 200) {
//         Alert.alert("Success", `Room "${roomName}" created successfully!`);
//         setRoomName("");
//         setBulbs(bulbs.map((bulb) => ({ ...bulb, isSelected: false }))); // Reset bulb selection
//       } else {
//         throw new Error("Failed to create room");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to create room. Please try again.");
//       console.error("Error creating room:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------------------
//   // Render UI
//   // -----------------------------------
//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       {/* Room Name Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         placeholderTextColor="#AAAAAA"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       {/* Select Bulbs */}
//       <Text style={styles.selectBulbsText}>Select Bulbs:</Text>
//       <View style={styles.bulbsContainer}>
//         {bulbs.map((bulb, index) => (
//           <TouchableOpacity
//             key={bulb.id}
//             style={[
//               styles.bulbButton,
//               bulb.isSelected ? styles.bulbSelected : styles.bulbUnselected,
//             ]}
//             onPress={() => handleToggleBulb(index)}
//           >
//             <Icon
//               name="bulb"
//               size={28}
//               color={bulb.isSelected ? "#FFD700" : "#555"}
//             />
//             <Text style={styles.bulbText}>{bulb.id}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Create Button */}
//       <TouchableOpacity
//         style={[styles.createButton, loading && { backgroundColor: "#A68B00" }]}
//         onPress={handleCreateRoom}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#000" />
//         ) : (
//           <Text style={styles.createButtonText}>Create Room</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// // -----------------------------------
// // Styles
// // -----------------------------------
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000", // Black background
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     justifyContent: "center",
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700", // Dark yellow text
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#222222", // Dark gray input field
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     color: "#FFFFFF", // White text
//     fontSize: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#FFD700", // Dark yellow border
//   },
//   selectBulbsText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   bulbsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 20,
//   },
//   bulbButton: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 15,
//     borderRadius: 10,
//     width: 80,
//     height: 80,
//   },
//   bulbSelected: {
//     backgroundColor: "#FFD700", // Bright yellow when selected
//   },
//   bulbUnselected: {
//     backgroundColor: "#222222", // Dark gray when unselected
//   },
//   bulbText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   createButton: {
//     backgroundColor: "#FFD700", // Dark yellow button
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#FFD700",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//   },
//   createButtonText: {
//     color: "#000000", // Black text
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Icon for bulbs
import axiosClient from "../../../utils/axiosClient"; 

export default function RoomCreationScreen() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Predefined bulbs with IDs
  const [bulbs, setBulbs] = useState([
    { id: "101", isSelected: false },
    { id: "102", isSelected: false },
    { id: "103", isSelected: false },
    { id: "104", isSelected: false },
  ]);

  // Toggle bulb selection
  const handleToggleBulb = (index) => {
    setBulbs((prevBulbs) =>
      prevBulbs.map((bulb, i) =>
        i === index ? { ...bulb, isSelected: !bulb.isSelected } : bulb
      )
    );
  };

  // Create room API call
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a Room Name.");
      return;
    }

    const selectedBulbIds = bulbs
      .filter((bulb) => bulb.isSelected)
      .map((bulb) => bulb.id);

    if (selectedBulbIds.length === 0) {
      Alert.alert("Error", "Please select at least one bulb.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/api/rooms", {
        room: roomName.trim(),
        bulbs: selectedBulbIds,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", `Room "${roomName}" created successfully!`);
        setRoomName("");
        setBulbs(bulbs.map((bulb) => ({ ...bulb, isSelected: false }))); // Reset bulb selection
      } else {
        throw new Error("Failed to create room");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create room. Please try again.");
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Render UI
  // -----------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Create Room</Text>

      {/* Room Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Room Name"
        placeholderTextColor="#AAAAAA"
        value={roomName}
        onChangeText={setRoomName}
      />

      {/* Select Bulbs */}
      <Text style={styles.selectBulbsText}>Select Bulbs:</Text>
      <View style={styles.bulbsContainer}>
        {bulbs.map((bulb, index) => (
          <TouchableOpacity
            key={bulb.id}
            style={[
              styles.bulbButton,
              bulb.isSelected ? styles.bulbSelected : styles.bulbUnselected,
            ]}
            onPress={() => handleToggleBulb(index)}
          >
            <Icon
              name="bulb"
              size={32}
              color={bulb.isSelected ? "#FFFFFF" : "#555"} // White for selected, gray for unselected
              style={bulb.isSelected ? styles.glowEffect : null} // Apply glow effect if selected
            />
            <Text style={styles.bulbText}>{bulb.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, loading && { backgroundColor: "#A68B00" }]}
        onPress={handleCreateRoom}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.createButtonText}>Create Room</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// -----------------------------------
// Styles
// -----------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Black background
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700", // Dark yellow text
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#222222", // Dark gray input field
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF", // White text
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700", // Dark yellow border
  },
  selectBulbsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bulbsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  bulbButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    width: 80,
    height: 80,
  },
  bulbSelected: {
    backgroundColor: "#FFD700", // Bright yellow when selected
    borderWidth: 2,
    borderColor: "#FFF", // White outline for emphasis
  },
  bulbUnselected: {
    backgroundColor: "#222222", // Dark gray when unselected
    borderWidth: 1,
    borderColor: "#FFD700", // Yellow outline
  },
  glowEffect: {
    textShadowColor: "rgba(255, 255, 255, 0.8)", // White glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bulbText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 5,
  },
  createButton: {
    backgroundColor: "#FFD700", // Dark yellow button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  createButtonText: {
    color: "#000000", // Black text
    fontSize: 18,
    fontWeight: "bold",
  },
});

