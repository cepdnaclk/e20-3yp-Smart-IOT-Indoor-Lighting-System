




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



// Final code without fetching devices
// -------------------------------------------

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
//               size={32}
//               color={bulb.isSelected ? "#FFFFFF" : "#555"} // White for selected, gray for unselected
//               style={bulb.isSelected ? styles.glowEffect : null} // Apply glow effect if selected
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
//     borderWidth: 2,
//     borderColor: "#FFF", // White outline for emphasis
//   },
//   bulbUnselected: {
//     backgroundColor: "#222222", // Dark gray when unselected
//     borderWidth: 1,
//     borderColor: "#FFD700", // Yellow outline
//   },
//   glowEffect: {
//     textShadowColor: "rgba(255, 255, 255, 0.8)", // White glow
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
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





// with fetchin API
// -----------------------------------------

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Icon from "react-native-vector-icons/Ionicons";
// import axiosClient from "../../../utils/axiosClient";

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [devices, setDevices] = useState([]); // Devices fetched from API
//   const [bulbs, setBulbs] = useState([]); // Bulbs from selected devices
//   const [selectedDevice, setSelectedDevice] = useState("");

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const response = await axiosClient.get("/api/room/devices");
//         if (response.status === 200) {
//           setDevices(response.data); // Expected format: [{ id: "101", mac: "00:11:22..." }]
//         }
//       } catch (error) {
//         console.error("Error fetching devices:", error);
//         Alert.alert("Error", "Failed to fetch devices.");
//       }
//     };
//     fetchDevices();
//   }, []);

//   const handleDeviceSelect = (deviceId) => {
//     setSelectedDevice(deviceId);
//     const selected = devices.find((d) => d.id === deviceId);
//     if (selected && !bulbs.find((b) => b.id === selected.id)) {
//       setBulbs([...bulbs, { id: selected.id, isSelected: true }]);
//     }
//   };

//   const handleToggleBulb = (index) => {
//     setBulbs((prevBulbs) =>
//       prevBulbs.map((bulb, i) =>
//         i === index ? { ...bulb, isSelected: !bulb.isSelected } : bulb
//       )
//     );
//   };

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
//         setSelectedDevice("");
//         setBulbs([]);
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

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         placeholderTextColor="#AAAAAA"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       {/* Dropdown for devices */}
//       <Text style={styles.selectBulbsText}>Add Devices (Bulbs):</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedDevice}
//           onValueChange={handleDeviceSelect}
//           style={styles.picker}
//           dropdownIconColor="#FFD700"
//         >
//           <Picker.Item label="Select a Device" value="" />
//           {devices.map((device) => (
//             <Picker.Item
//               key={device.id}
//               label={`Device ${device.id} - ${device.mac}`}
//               value={device.id}
//             />
//           ))}
//         </Picker>
//       </View>

//       {/* Selected Bulbs */}
//       <Text style={styles.selectBulbsText}>Selected Bulbs:</Text>
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
//               size={32}
//               color={bulb.isSelected ? "#FFFFFF" : "#555"}
//               style={bulb.isSelected ? styles.glowEffect : null}
//             />
//             <Text style={styles.bulbText}>{bulb.id}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

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
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#222",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     color: "#FFF",
//     fontSize: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   selectBulbsText: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   pickerContainer: {
//     backgroundColor: "#222",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//     marginBottom: 20,
//   },
//   picker: {
//     color: "#FFF",
//     height: 50,
//   },
//   bulbsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
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
//     marginBottom: 10,
//   },
//   bulbSelected: {
//     backgroundColor: "#FFD700",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   bulbUnselected: {
//     backgroundColor: "#222",
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   glowEffect: {
//     textShadowColor: "rgba(255, 255, 255, 0.8)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   bulbText: {
//     color: "#FFF",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   createButton: {
//     backgroundColor: "#FFD700",
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
//     color: "#000",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });



// ----------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { devices } from '../constants/dummyData';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Icon from "react-native-vector-icons/Ionicons";
// import axiosClient from "../../../utils/axiosClient";

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [devices, setDevices] = useState([]);
//   const [bulbs, setBulbs] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState("");

//   // Hardcoded device list
//   useEffect(() => {
//     const hardcodedDevices = [
//       { id: "101", mac: "AA:BB:CC:DD:EE:01" },
//       { id: "102", mac: "AA:BB:CC:DD:EE:02" },
//       { id: "103", mac: "AA:BB:CC:DD:EE:03" },
//       { id: "104", mac: "AA:BB:CC:DD:EE:04" },
//       { id: "105", mac: "AA:BB:CC:DD:EE:05" },
//     ];
//     setDevices(hardcodedDevices);
//   }, []);

//   const handleDeviceSelect = (deviceId) => {
//     setSelectedDevice(deviceId);
//     const selected = devices.find((d) => d.id === deviceId);
//     if (selected && !bulbs.find((b) => b.id === selected.id)) {
//       setBulbs([...bulbs, { id: selected.id, isSelected: true }]);
//     }
//   };

//   const handleToggleBulb = (index) => {
//     setBulbs((prevBulbs) =>
//       prevBulbs.map((bulb, i) =>
//         i === index ? { ...bulb, isSelected: !bulb.isSelected } : bulb
//       )
//     );
//   };

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
//         setSelectedDevice("");
//         setBulbs([]);
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

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         placeholderTextColor="#AAAAAA"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       {/* Dropdown for devices */}
//       <Text style={styles.selectBulbsText}>Add Devices (Bulbs):</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedDevice}
//           onValueChange={handleDeviceSelect}
//           style={styles.picker}
//           dropdownIconColor="#FFD700"
//         >
//           <Picker.Item label="Select a Device" value="" />
//           {devices.map((device) => (
//             <Picker.Item
//               key={device.id}
//               label={`Device ${device.id} - ${device.mac}`}
//               value={device.id}
//             />
//           ))}
//         </Picker>
//       </View>

//       {/* Selected Bulbs */}
//       <Text style={styles.selectBulbsText}>Selected Bulbs:</Text>
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
//               size={32}
//               color={bulb.isSelected ? "#FFFFFF" : "#555"}
//               style={bulb.isSelected ? styles.glowEffect : null}
//             />
//             <Text style={styles.bulbText}>{bulb.id}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

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
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#222",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     color: "#FFF",
//     fontSize: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   selectBulbsText: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   pickerContainer: {
//     backgroundColor: "#222",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//     marginBottom: 20,
//   },
//   picker: {
//     color: "#FFF",
//     height: 50,
//   },
//   bulbsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
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
//     marginBottom: 10,
//   },
//   bulbSelected: {
//     backgroundColor: "#FFD700",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   bulbUnselected: {
//     backgroundColor: "#222",
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   glowEffect: {
//     textShadowColor: "rgba(255, 255, 255, 0.8)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   bulbText: {
//     color: "#FFF",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   createButton: {
//     backgroundColor: "#FFD700",
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
//     color: "#000",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Icon from "react-native-vector-icons/Ionicons";
// import axiosClient from "../../../utils/axiosClient";
// import { devices as dummyDevices } from "@/constants/dummyData"; // rename import to avoid conflict

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [bulbs, setBulbs] = useState([]);
//   const [deviceList, setDeviceList] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState("");

//   useEffect(() => {
//     // Simulate fetching devices
//     const fetchDevices = async () => {
//       setDeviceList(dummyDevices); // using renamed import
//     };

//     fetchDevices();
//   }, []);

//   const handleDeviceSelect = (deviceName) => {
//     setSelectedDevice(deviceName);
//     const selected = deviceList.find((d) => d.deviceName === deviceName);
//     if (selected && !bulbs.find((b) => b.deviceName === selected.deviceName)) {
//       setBulbs([...bulbs, { deviceName: selected.deviceName, isSelected: true }]);
//     }
//   };

//   const handleToggleBulb = (index) => {
//     setBulbs((prevBulbs) =>
//       prevBulbs.map((bulb, i) =>
//         i === index ? { ...bulb, isSelected: !bulb.isSelected } : bulb
//       )
//     );
//   };

//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     const selectedBulbNames = bulbs
//       .filter((bulb) => bulb.isSelected)
//       .map((bulb) => bulb.deviceName);

//     if (selectedBulbNames.length === 0) {
//       Alert.alert("Error", "Please select at least one bulb.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         bulbs: selectedBulbNames,
//       });

//       if (response.status === 201 || response.status === 200) {
//         Alert.alert("Success", `Room "${roomName}" created successfully!`);
//         setRoomName("");
//         setSelectedDevice("");
//         setBulbs([]);
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

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         placeholderTextColor="#AAAAAA"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       {/* Dropdown for devices */}
//       <Text style={styles.selectBulbsText}>Add Devices (Bulbs):</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedDevice}
//           onValueChange={handleDeviceSelect}
//           style={styles.picker}
//           dropdownIconColor="#FFD700"
//         >
//           <Picker.Item label="Select a Device" value="" />
//           {deviceList.map((device) => (
//             <Picker.Item
//               key={device.macAddress}
//               label={`${device.deviceName} - ${device.macAddress}`}
//               value={device.deviceName}
//             />
//           ))}
//         </Picker>
//       </View>

//       {/* Selected Bulbs */}
//       <Text style={styles.selectBulbsText}>Selected Bulbs:</Text>
//       <View style={styles.bulbsContainer}>
//         {bulbs.map((bulb, index) => (
//           <TouchableOpacity
//             key={bulb.deviceName}
//             style={[
//               styles.bulbButton,
//               bulb.isSelected ? styles.bulbSelected : styles.bulbUnselected,
//             ]}
//             onPress={() => handleToggleBulb(index)}
//           >
//             <Icon
//               name="bulb"
//               size={32}
//               color={bulb.isSelected ? "#FFFFFF" : "#555"}
//               style={bulb.isSelected ? styles.glowEffect : null}
//             />
//             <Text style={styles.bulbText}>{bulb.deviceName}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

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
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#222",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     color: "#FFF",
//     fontSize: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   selectBulbsText: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   pickerContainer: {
//     backgroundColor: "#222",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//     marginBottom: 20,
//   },
//   picker: {
//     color: "#FFF",
//     height: 50,
//   },
//   bulbsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
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
//     marginBottom: 10,
//   },
//   bulbSelected: {
//     backgroundColor: "#FFD700",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   bulbUnselected: {
//     backgroundColor: "#222",
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   glowEffect: {
//     textShadowColor: "rgba(255, 255, 255, 0.8)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   bulbText: {
//     color: "#FFF",
//     fontSize: 14,
//     marginTop: 5,
//   },
//   createButton: {
//     backgroundColor: "#FFD700",
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
//     color: "#000",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import axiosClient from "../../../utils/axiosClient";
// import { devices as dummyDevices } from "@/constants/dummyData"; // Update path if needed
// import Svg, { Circle, Text as SvgText, Line } from "react-native-svg";

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [bulbs, setBulbs] = useState([]);
//   const [deviceList, setDeviceList] = useState([]);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       setDeviceList(dummyDevices);
//     };

//     fetchDevices();
//   }, []);

//   const handleAddDevice = (deviceName) => {
//     const device = deviceList.find((d) => d.deviceName === deviceName);
//     if (device && !bulbs.find((b) => b.deviceName === deviceName)) {
//       setBulbs([...bulbs, { deviceName, isSelected: true }]);
//     }
//   };

//   const handleRemoveDevice = (deviceName) => {
//     setBulbs((prevBulbs) => prevBulbs.filter((b) => b.deviceName !== deviceName));
//   };

//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     const selectedBulbNames = bulbs.map((bulb) => bulb.deviceName);

//     if (selectedBulbNames.length === 0) {
//       Alert.alert("Error", "Please select at least one device.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         bulbs: selectedBulbNames,
//       });

//       if (response.status === 201 || response.status === 200) {
//         Alert.alert("Success", `Room "${roomName}" created successfully!`);
//         setRoomName("");
//         setBulbs([]);
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

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         placeholderTextColor="#AAAAAA"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       <Text style={styles.selectBulbsText}>Available Devices:</Text>
//       {deviceList.map((device) => (
//         <View key={device.macAddress} style={styles.deviceRow}>
//           <View>
//             <Text style={styles.deviceText}>{device.deviceName}</Text>
//             <Text style={styles.macText}>{device.macAddress}</Text>
//           </View>
//           <View style={styles.deviceButtons}>
//             <TouchableOpacity
//               style={styles.addBtn}
//               onPress={() => handleAddDevice(device.deviceName)}
//             >
//               <Text style={styles.btnText}>Add</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.removeBtn}
//               onPress={() => handleRemoveDevice(device.deviceName)}
//             >
//               <Text style={styles.btnText}>Remove</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}

//       {/* Graph Visualization */}
//       {bulbs.length > 0 && (
//         <View style={{ alignItems: "center", marginVertical: 30 }}>
//           <Text style={{ color: "#FFF", fontSize: 18, marginBottom: 10 }}>Added Devices Graph</Text>
//           <Svg height="200" width="300" viewBox="0 0 300 200">
//             {bulbs.map((bulb, index) => {
//               const x = 60 + (index % 3) * 90;
//               const y = 60 + Math.floor(index / 3) * 90;
//               return (
//                 <React.Fragment key={index}>
//                   <Circle cx={x} cy={y} r="25" fill="#FFD700" />
//                   <SvgText
//                     fill="#000"
//                     fontSize="12"
//                     x={x}
//                     y={y + 4}
//                     textAnchor="middle"
//                     fontWeight="bold"
//                   >
//                     {bulb.deviceName}
//                   </SvgText>
//                 </React.Fragment>
//               );
//             })}

//             {bulbs.length > 1 &&
//               bulbs.map((_, index) => {
//                 if (index < bulbs.length - 1) {
//                   const x1 = 60 + (index % 3) * 90;
//                   const y1 = 60 + Math.floor(index / 3) * 90;
//                   const x2 = 60 + ((index + 1) % 3) * 90;
//                   const y2 = 60 + Math.floor((index + 1) / 3) * 90;
//                   return (
//                     <Line
//                       key={`line-${index}`}
//                       x1={x1}
//                       y1={y1}
//                       x2={x2}
//                       y2={y2}
//                       stroke="#FFD700"
//                       strokeWidth="2"
//                     />
//                   );
//                 }
//               })}
//           </Svg>
//         </View>
//       )}

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
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#222",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     color: "#FFF",
//     fontSize: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#FFD700",
//   },
//   selectBulbsText: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   deviceRow: {
//     backgroundColor: "#111",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderColor: "#FFD700",
//     borderWidth: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   deviceText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   macText: {
//     color: "#AAA",
//     fontSize: 12,
//   },
//   deviceButtons: {
//     flexDirection: "row",
//   },
//   addBtn: {
//     backgroundColor: "#0F0",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     marginRight: 5,
//   },
//   removeBtn: {
//     backgroundColor: "#F00",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   btnText: {
//     color: "#FFF",
//     fontWeight: "bold",
//   },
//   createButton: {
//     backgroundColor: "#FFD700",
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
//     color: "#000",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosClient from "../../../utils/axiosClient";
import { devices as dummyDevices } from "@/constants/dummyData"; // adjust this path

export default function RoomCreationScreen() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDevices, setAllDevices] = useState([]);
  const [addedDevices, setAddedDevices] = useState([]);

  useEffect(() => {
    setAllDevices(dummyDevices);
  }, []);

  const handleAddDevice = (device) => {
    setAddedDevices((prev) => [...prev, device]);
    setAllDevices((prev) =>
      prev.filter((d) => d.deviceName !== device.deviceName)
    );
  };

  const handleRemoveDevice = (deviceName) => {
    const device = addedDevices.find((d) => d.deviceName === deviceName);
    if (device) {
      setAllDevices((prev) => [...prev, device]);
      setAddedDevices((prev) =>
        prev.filter((d) => d.deviceName !== deviceName)
      );
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a Room Name.");
      return;
    }

    if (addedDevices.length === 0) {
      Alert.alert("Error", "Please add at least one device.");
      return;
    }

    const deviceNames = addedDevices.map((d) => d.deviceName);

    setLoading(true);
    try {
      const response = await axiosClient.post("/api/rooms", {
        room: roomName.trim(),
        bulbs: deviceNames,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", `Room "${roomName}" created successfully!`);
        setRoomName("");
        setAddedDevices([]);
        setAllDevices(dummyDevices);
      } else {
        throw new Error("Failed to create room.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>Create Room</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Room Name"
        placeholderTextColor="#AAAAAA"
        value={roomName}
        onChangeText={setRoomName}
      />

      {/* Available Devices as Cards */}
      <Text style={styles.label}>Available Devices:</Text>
      {allDevices.map((device) => (
        <View key={device.macAddress} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>{device.deviceName}</Text>
            <Text style={styles.macText}>{device.macAddress}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddDevice(device)}
          >
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Added Devices */}
      <Text style={styles.label}>Added Devices:</Text>
      {addedDevices.map((device) => (
        <View key={device.macAddress} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>{device.deviceName}</Text>
            <Text style={styles.macText}>{device.macAddress}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveDevice(device.deviceName)}
          >
            <Text style={styles.btnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  label: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  deviceCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#FFD700",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  macText: {
    color: "#AAA",
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: "#0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeBtn: {
    backgroundColor: "#F00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
