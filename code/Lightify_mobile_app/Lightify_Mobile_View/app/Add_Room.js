// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";

// const RoomCreationScreen = () => {
//   const [macAddress, setMacAddress] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreateRoom = async () => {
//     if (!macAddress.trim() || !roomName.trim()) {
//       Alert.alert("Error", "Please enter both MAC Address and Room Name.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/rooms", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           macAddress: macAddress.trim(),
//           roomName: roomName.trim(),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create room");
//       }

//       Alert.alert("Success", "Room created successfully!");
//       setMacAddress(""); // Clear input fields after success
//       setRoomName("");
//     } catch (error) {
//       Alert.alert("Error", "Failed to create room. Please try again.");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center px-6 bg-gray-100">
//       <Text className="text-2xl font-bold text-center mb-6">Create Room</Text>

//       <TextInput
//         className="w-full h-12 border border-gray-300 rounded-md px-4 bg-white mb-4"
//         placeholder="Enter MAC Address"
//         value={macAddress}
//         onChangeText={setMacAddress}
//         autoCapitalize="none"
//       />

//       <TextInput
//         className="w-full h-12 border border-gray-300 rounded-md px-4 bg-white mb-4"
//         placeholder="Enter Room Name"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       <TouchableOpacity
//         className={`w-full py-3 rounded-md items-center ${loading ? "bg-gray-400" : "bg-blue-500"}`}
//         onPress={handleCreateRoom}
//         disabled={loading}
//       >
//         {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-semibold">Create</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RoomCreationScreen;


// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
// import axiosClient from "../utils/axiosClient"; // <-- Update the path if needed

// const RoomCreationScreen = () => {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreateRoom = async () => {
//     // Basic validation
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // POST request to /api/rooms with the desired JSON structure
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         schedule: [], // or null if you prefer
//       });

//       // Check if response is OK (optional; axios will throw on non-2xx)
//       if (response.status !== 201 && response.status !== 200) {
//         throw new Error("Failed to create room");
//       }

//       Alert.alert("Success", "Room created successfully!");
//       setRoomName(""); // Clear input fields after success
//     } catch (error) {
//       Alert.alert("Error", "Failed to create room. Please try again.");
//       console.error("Error creating room:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center px-6 bg-gray-100">
//       <Text className="text-2xl font-bold text-center mb-6">Create Room</Text>

//       <TextInput
//         className="w-full h-12 border border-gray-300 rounded-md px-4 bg-white mb-4"
//         placeholder="Enter Room Name"
//         value={roomName}
//         onChangeText={setRoomName}
//         autoCapitalize="none"
//       />

//       <TouchableOpacity
//         className={`w-full py-3 rounded-md items-center ${loading ? "bg-gray-400" : "bg-blue-500"}`}
//         onPress={handleCreateRoom}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text className="text-white text-lg font-semibold">Create</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RoomCreationScreen;

