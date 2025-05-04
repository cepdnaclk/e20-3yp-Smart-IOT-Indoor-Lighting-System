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
// import axiosClient from "../../../utils/axiosClient";
// import { devices as dummyDevices } from "@/constants/dummyData"; // adjust this path

// export default function RoomCreationScreen() {
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [allDevices, setAllDevices] = useState([]);
//   const [addedDevices, setAddedDevices] = useState([]);

//   useEffect(() => {
//     setAllDevices(dummyDevices);
//   }, []);

//   const handleAddDevice = (device) => {
//     setAddedDevices((prev) => [...prev, device]);
//     setAllDevices((prev) =>
//       prev.filter((d) => d.deviceId !== device.deviceId)
//     );
//   };

//   const handleRemoveDevice = (deviceId) => {
//     const device = addedDevices.find((d) => d.deviceId === deviceId);
//     if (device) {
//       setAllDevices((prev) => [...prev, device]);
//       setAddedDevices((prev) =>
//         prev.filter((d) => d.deviceId !== deviceId)
//       );
//     }
//   };

//   const handleCreateRoom = async () => {
//     if (!roomName.trim()) {
//       Alert.alert("Error", "Please enter a Room Name.");
//       return;
//     }

//     if (addedDevices.length === 0) {
//       Alert.alert("Error", "Please add at least one device.");
//       return;
//     }

//     const deviceNames = addedDevices.map((d) => d.deviceName);

//     setLoading(true);
//     try {
//       const response = await axiosClient.post("/api/rooms", {
//         room: roomName.trim(),
//         bulbs: deviceNames,
//       });

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert("Success", `Room "${roomName}" created successfully!`);
//         setRoomName("");
//         setAddedDevices([]);
//         setAllDevices(dummyDevices);
//       } else {
//         throw new Error("Failed to create room.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong.");
//       console.error(error);
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

//       {/* Available Devices */}
//       <Text style={styles.label}>Available Devices:</Text>
//       {allDevices.map((device) => (
//         <View key={device.deviceId} style={styles.deviceCard}>
//           <View>
//             <Text style={styles.deviceText}>
//               ID: {device.deviceId} - {device.deviceName}
//             </Text>
//             <Text style={styles.macText}>{device.macAddress}</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.addBtn}
//             onPress={() => handleAddDevice(device)}
//           >
//             <Text style={styles.btnText}>Add</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       {/* Added Devices */}
//       <Text style={styles.label}>Added Devices:</Text>
//       {addedDevices.map((device) => (
//         <View key={device.deviceId} style={styles.deviceCard}>
//           <View>
//             <Text style={styles.deviceText}>
//               ID: {device.deviceId} - {device.deviceName}
//             </Text>
//             <Text style={styles.macText}>{device.macAddress}</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.removeBtn}
//             onPress={() => handleRemoveDevice(device.deviceId)}
//           >
//             <Text style={styles.btnText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

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
//   label: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   deviceCard: {
//     backgroundColor: "#222",
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
//   addBtn: {
//     backgroundColor: "#0F0",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//   },
//   removeBtn: {
//     backgroundColor: "#F00",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
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
//     marginTop: 20,
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
import axiosClient from "../../../utils/axiosClient";
import { devices as dummyDevices } from "@/constants/dummyData"; // Adjust path as necessary

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
      prev.filter((d) => d.deviceId !== device.deviceId)
    );
  };

  const handleRemoveDevice = (deviceId) => {
    const device = addedDevices.find((d) => d.deviceId === deviceId);
    if (device) {
      setAllDevices((prev) => [...prev, device]);
      setAddedDevices((prev) =>
        prev.filter((d) => d.deviceId !== deviceId)
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

    const formattedDevices = addedDevices.map((device) => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceMac: device.macAddress,
      schedules: [],
    }));

    const payload = {
      room: roomName.trim(),
      devices: formattedDevices,
    };

    setLoading(true);
    try {
      const response = await axiosClient.post("/api/rooms", payload);

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

      <Text style={styles.label}>Available Devices:</Text>
      {allDevices.map((device) => (
        <View key={device.deviceId} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>
              ID: {device.deviceId} - {device.deviceName}
            </Text>
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

      <Text style={styles.label}>Added Devices:</Text>
      {addedDevices.map((device) => (
        <View key={device.deviceId} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>
              ID: {device.deviceId} - {device.deviceName}
            </Text>
            <Text style={styles.macText}>{device.macAddress}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveDevice(device.deviceId)}
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
