// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import axiosClient from "../../../utils/axiosClient";

// export default function RoomModesScreen() {
//   const router = useRouter();
//   const { roomName } = useLocalSearchParams(); // ✅ Fetch roomName from URL
//   const [modes, setModes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newModeName, setNewModeName] = useState("");
//   const USERNAME = "Tharindu"; // Replace with your username or fetch dynamically if needed

// useEffect(() => {
//   const fetchRoomModes = async () => {
//     try {
//       const res = await axiosClient.get(
//         `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
//       );
//       const data = res.data;

//       if (Array.isArray(data.Automation_Modes)) {
//         const extractedModes = data.Automation_Modes.map((mode, idx) => ({
//           _id: mode.Mode_Name.toLowerCase().replace(/\s+/g, "_"),
//           name: mode.Mode_Name,
//           active: idx === 0, // You can default the first one as active
//         }));

//         setModes(extractedModes);
//       } else {
//         throw new Error("Invalid Automation_Modes format");
//       }
//     } catch (err) {
//       console.warn("⚠️ Failed to fetch modes, using fallback:", err);
//       setModes([
//         { _id: "m1", name: "Normal Mode", active: true },
//         { _id: "m2", name: "Night Mode", active: false },
//         { _id: "m3", name: "Energy Saver", active: false },
//       ]);
//     }
//   };

//   if (roomName) {
//     fetchRoomModes();
//   }
// }, [roomName]);


//   const toggleMode = async (index) => {
//     const isActive = modes[index].active;
//     const anotherActive = modes.some((m, i) => i !== index && m.active);

//     if (!isActive && anotherActive) {
//       Alert.alert("Only one mode can be active at a time.");
//       return;
//     }

//     const updated = modes.map((m, i) =>
//       i === index ? { ...m, active: !isActive } : m
//     );
//     setModes(updated);

//     // Optional: Send to backend if needed
//     // await axiosClient.patch(`/api/modes/${modes[index]._id}`, { active: !isActive });
//   };

//   const handleAddMode = async () => {
//     if (!newModeName.trim()) {
//       Alert.alert("Please enter a mode name");
//       return;
//     }

//     const newMode = {
//       _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
//       name: newModeName.trim(),
//       active: false,
//     };

//     setModes((prev) => [...prev, newMode]);
//     setNewModeName("");
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.roomTitle}>{roomName || "Room"}</Text>
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.modeList}>
//         {modes.map((mode, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.modeCard}
//             onPress={() =>
//               router.push({
//                 pathname: "Room/RadarDataReceiver",
//                 params: { roomName, mode: mode.name },
//               })
//             }
//           >
//             <Text style={styles.modeText}>{mode.name}</Text>
//             <Switch
//               value={mode.active}
//               onValueChange={() => toggleMode(index)}
//               trackColor={{ false: "#444", true: "#FFD70055" }}
//               thumbColor={mode.active ? "#FFD700" : "#888"}
//             />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add New Mode</Text>
//             <TextInput
//               placeholder="Enter mode name"
//               style={styles.input}
//               value={newModeName}
//               onChangeText={setNewModeName}
//               placeholderTextColor="#AAA"
//             />
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.modalBtn} onPress={handleAddMode}>
//                 <Text style={styles.modalBtnText}>Add</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: "#777" }]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.modalBtnText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   roomTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFD700",
//   },
//   modeList: {
//     paddingBottom: 20,
//   },
//   modeCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderColor: "#FFD700",
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: "#111",
//   },
//   modeText: {
//     fontSize: 18,
//     color: "#FFD700",
//     fontWeight: "600",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: "bold",
//     color: "#FFD700",
//   },
//   input: {
//     width: "100%",
//     borderColor: "#FFD700",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 15,
//     color: "#FFF",
//     backgroundColor: "#222",
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   modalBtn: {
//     flex: 1,
//     backgroundColor: "#FFD700",
//     padding: 10,
//     borderRadius: 6,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   modalBtnText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });



import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosClient from "../../../utils/axiosClient";

export default function RoomModesScreen() {
  const router = useRouter();
  const { roomName } = useLocalSearchParams(); // ✅ Fetch roomName from URL
  const [modes, setModes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModeName, setNewModeName] = useState("");
  const USERNAME = "Tharindu"; 
  // Replace with your username or fetch dynamically if needed

useEffect(() => {
  const fetchRoomModes = async () => {
    try {
      const res = await axiosClient.get(
        `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
      );
      const data = res.data;

      if (Array.isArray(data.Automation_Modes)) {
        const extractedModes = data.Automation_Modes.map((mode, idx) => ({
          _id: mode.Mode_Name.toLowerCase().replace(/\s+/g, "_"),
          name: mode.Mode_Name,
          active: idx === 0, // You can default the first one as active
        }));

        setModes(extractedModes);
      } else {
        throw new Error("Invalid Automation_Modes format");
      }
    } catch (err) {
      console.warn("⚠️ Failed to fetch modes, using fallback:", err);
      setModes([
        { _id: "m1", name: "Normal Mode", active: true },
        { _id: "m2", name: "Night Mode", active: false },
        { _id: "m3", name: "Energy Saver", active: false },
      ]);
    }
  };

  if (roomName) {
    fetchRoomModes();
  }
}, [roomName]);


  const toggleMode = async (index) => {
    const isActive = modes[index].active;
    const anotherActive = modes.some((m, i) => i !== index && m.active);

    if (!isActive && anotherActive) {
      Alert.alert("Only one mode can be active at a time.");
      return;
    }

    const updated = modes.map((m, i) =>
      i === index ? { ...m, active: !isActive } : m
    );
    setModes(updated);

    // Optional: Send to backend if needed
    // await axiosClient.patch(`/api/modes/${modes[index]._id}`, { active: !isActive });
  };

const handleAddMode = async () => {
  if (!newModeName.trim()) {
    Alert.alert("Please enter a mode name");
    return;
  }

  try {
    // Fetch the latest config from backend
    const res = await axiosClient.get(
      `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
    );
    const data = res.data;

    // Append new mode (with empty rules)
    const newMode = {
      Mode_Name: newModeName.trim(),
      Rules: [] // empty rule list for now
    };

    const updatedData = {
      username: USERNAME,
      roomName: roomName,
      bulbs: data.bulbs || [],
      Areas: data.Areas || [],
      Automation_Modes: [...(data.Automation_Modes || []), newMode]
    };

    // Send the new object back to backend
    await axiosClient.post("/api/rooms/configure", updatedData);

    // Update UI
    setModes((prev) => [
      ...prev,
      {
        _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
        name: newModeName.trim(),
        active: false
      }
    ]);

    setNewModeName("");
    setModalVisible(false);
    Alert.alert("Success", "New mode added!");
  } catch (err) {
    console.error("❌ Failed to add mode:", err);
    Alert.alert("Error", "Could not add new mode. Please try again.");
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName || "Room"}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.modeList}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={styles.modeCard}
            onPress={() =>
              router.push({
                pathname: "Room/RadarDataReceiver",
                params: { roomName, mode: mode.name },
              })
            }
          >
            <Text style={styles.modeText}>{mode.name}</Text>
            <Switch
              value={mode.active}
              onValueChange={() => toggleMode(index)}
              trackColor={{ false: "#444", true: "#FFD70055" }}
              thumbColor={mode.active ? "#FFD700" : "#888"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Mode</Text>
            <TextInput
              placeholder="Enter mode name"
              style={styles.input}
              value={newModeName}
              onChangeText={setNewModeName}
              placeholderTextColor="#AAA"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddMode}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#777" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  modeList: {
    paddingBottom: 20,
  },
  modeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#FFD700",
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#111",
  },
  modeText: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#FFD700",
  },
  input: {
    width: "100%",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#FFF",
    backgroundColor: "#222",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#000",
    fontWeight: "bold",
  },
});



