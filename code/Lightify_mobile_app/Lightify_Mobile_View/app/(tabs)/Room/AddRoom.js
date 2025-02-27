

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import axiosClient from "../../utils/axiosClient"; 

// export default function RoomCreationScreen() {
//   // 1) Start with some hard-coded rooms
//   const [rooms, setRooms] = useState(["Living Room", "Bedroom", "Kitchen"]);
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // -------------------------
//   // 2) Fetch all rooms (GET /api/rooms)
//   // -------------------------
//   const fetchRooms = async () => {
//     try {
//       const response = await axiosClient.get("/api/rooms");
//       // Suppose the server returns an array of strings, e.g. ["Living Room", "Bedroom", ...]
//       setRooms(response.data);
//     } catch (error) {
//       console.error("Error fetching rooms:", error);
//       // If it fails, we keep our hard-coded default rooms
//     }
//   };

//   // Fetch rooms once the component mounts
//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   // -------------------------
//   // 3) Create a new room (POST /api/rooms)
//   // -------------------------
//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         schedule: [], // or any default schedule
//       });

//       if (response.status === 201 || response.status === 200) {
//         Alert.alert("Success", `Room "${roomName}" created successfully!`);
//         setRoomName("");
//         fetchRooms(); // Refresh from the server
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

//   // -------------------------
//   // 4) Update a room (PUT /api/rooms/:roomName)
//   // -------------------------
//   const handleUpdateRoom = async (oldName) => {
//     // Simple example: rename the room by appending "_updated"
//     const newName = oldName + "_updated";

//     try {
//       await axiosClient.put(`/api/rooms/${oldName}`, {
//         room: newName,
//         schedule: [], // or the existing schedule
//       });
//       Alert.alert("Success", `Room "${oldName}" updated to "${newName}"`);
//       fetchRooms();
//     } catch (error) {
//       Alert.alert("Error", "Failed to update room.");
//       console.error("Error updating room:", error);
//     }
//   };

//   // -------------------------
//   // 5) Delete a room (DELETE /api/rooms/:roomName)
//   // -------------------------
//   const handleDeleteRoom = async (name) => {
//     try {
//       await axiosClient.delete(`/api/rooms/${name}`);
//       Alert.alert("Success", `Room "${name}" deleted.`);
//       fetchRooms();
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete room.");
//       console.error("Error deleting room:", error);
//     }
//   };

//   // -------------------------
//   // 6) Render UI
//   // -------------------------
//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>Create Room</Text>

//       {/* Room name input + Create button */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Room Name"
//         value={roomName}
//         onChangeText={setRoomName}
//       />

//       <TouchableOpacity
//         style={[styles.createButton, loading && { backgroundColor: "#999" }]}
//         onPress={handleCreateRoom}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.createButtonText}>Create</Text>
//         )}
//       </TouchableOpacity>

//       {/* List Title */}
//       <Text style={styles.listTitle}>Existing Rooms</Text>

//       {/* Scrollable "Table" */}
//       <ScrollView style={{ width: "100%" }}>
//         {rooms.map((room, index) => {
//           // If your server returns an array of strings, 'room' is a string.
//           // If it returns objects, adjust how you extract the name (e.g. room.name).
//           const rName = typeof room === "string" ? room : room.room;

//           return (
//             <View key={index} style={styles.tableRow}>
//               <Text style={styles.roomName}>{rName}</Text>

//               {/* Update Button */}
//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: "#4caf50" }]}
//                 onPress={() => handleUpdateRoom(rName)}
//               >
//                 <Text style={styles.actionButtonText}>Update</Text>
//               </TouchableOpacity>

//               {/* Delete Button */}
//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: "#f44336" }]}
//                 onPress={() => handleDeleteRoom(rName)}
//               >
//                 <Text style={styles.actionButtonText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// }

// // -------------------------
// // Styles
// // -------------------------
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1f1f1",
//     paddingHorizontal: 16,
//     paddingTop: 40,
//   },
//   screenTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },
//   createButton: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   createButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   listTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   tableRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginBottom: 8,
//     padding: 10,
//     borderRadius: 6,
//   },
//   roomName: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   actionButton: {
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginLeft: 6,
//   },
//   actionButtonText: {
//     color: "#fff",
//     fontWeight: "600",
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
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For bulb icons
import axiosClient from "../../../utils/axiosClient"; 

export default function RoomCreationScreen() {
  // Start with some hard-coded rooms
  const [rooms, setRooms] = useState(["Living Room", "Bedroom", "Kitchen"]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Hard-coded bulbs (IDs + intensities)
  // In a real app, you'd fetch these from the server per room.
  const dummyBulbs = [
    { bulbId: "101", intensity: 50 },
    { bulbId: "102", intensity: 70 },
    { bulbId: "103", intensity: 0 },
    { bulbId: "104", intensity: 100 },
  ];

  // -----------------------------------
  // Fetch all rooms (GET /api/rooms)
  // -----------------------------------
  const fetchRooms = async () => {
    try {
      const response = await axiosClient.get("/api/rooms");
      // Suppose the server returns an array of strings like ["Living Room", "Bedroom", ...]
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // If the server call fails, we keep our hard-coded defaults
    }
  };

  // Fetch rooms once on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // -----------------------------------
  // Create a new room (POST /api/rooms)
  // -----------------------------------
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a Room Name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/api/rooms", {
        room: roomName.trim(),
        schedule: [], // or any default schedule
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", `Room "${roomName}" created successfully!`);
        setRoomName("");
        fetchRooms(); // refresh from server
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

      {/* Room name input + Create button */}
      <TextInput
        style={styles.input}
        placeholder="Enter Room Name"
        value={roomName}
        onChangeText={setRoomName}
      />
      <TouchableOpacity
        style={[styles.createButton, loading && { backgroundColor: "#999" }]}
        onPress={handleCreateRoom}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Create</Text>
        )}
      </TouchableOpacity>

      {/* List Title */}
      <Text style={styles.listTitle}>Existing Rooms</Text>

      {/* Scrollable list of rooms */}
      <ScrollView style={{ width: "100%" }}>
        {rooms.map((room, index) => {
          // If your server returns an array of strings, 'room' is the string.
          // If it returns objects, adjust how you extract the name (e.g. room.room).
          const rName = typeof room === "string" ? room : room.room;

          return (
            <View key={index} style={styles.tableRow}>
              {/* The room name */}
              <Text style={styles.roomName}>{rName}</Text>

              {/* Bulbs row */}
              <View style={styles.bulbsContainer}>
                {dummyBulbs.map((bulb, idx) => (
                  <View key={idx} style={styles.bulbWrapper}>
                    <Icon
                      name="bulb"
                      size={24}
                      // If intensity > 0 => bulb is ON (yellow), else OFF (gray)
                      color={bulb.intensity > 0 ? "yellow" : "gray"}
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.bulbText}>
                      {bulb.bulbId}: {bulb.intensity}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// -----------------------------------
// Styles
// -----------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableRow: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  bulbsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bulbWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  bulbText: {
    fontSize: 14,
  },
});
