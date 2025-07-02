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
//   const USERNAME = "Tharindu"; 
//   // Replace with your username or fetch dynamically if needed

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

// const handleAddMode = async () => {
//   if (!newModeName.trim()) {
//     Alert.alert("Please enter a mode name");
//     return;
//   }

//   try {
//     // Fetch the latest config from backend
//     const res = await axiosClient.get(
//       `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
//     );
//     const data = res.data;

//     // Append new mode (with empty rules)
//     const newMode = {
//       Mode_Name: newModeName.trim(),
//       Rules: [] // empty rule list for now
//     };

//     const updatedData = {
//       username: USERNAME,
//       roomName: roomName,
//       bulbs: data.bulbs || [],
//       Areas: data.Areas || [],
//       Automation_Modes: [...(data.Automation_Modes || []), newMode]
//     };

//     // Send the new object back to backend
//     await axiosClient.post("/api/rooms/configure", updatedData);

//     // Update UI
//     setModes((prev) => [
//       ...prev,
//       {
//         _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
//         name: newModeName.trim(),
//         active: false
//       }
//     ]);

//     setNewModeName("");
//     setModalVisible(false);
//     Alert.alert("Success", "New mode added!");
//   } catch (err) {
//     console.error("❌ Failed to add mode:", err);
//     Alert.alert("Error", "Could not add new mode. Please try again.");
//   }
// };


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
// import RuleManager from "./RuleManager";

// export default function RoomModesScreen() {
//   const router = useRouter();
//   const { roomName } = useLocalSearchParams(); // Fetch roomName from URL
//   const USERNAME = "Tharindu"; // Hard-coded username

//   const [modes, setModes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newModeName, setNewModeName] = useState("");

//   // Track which mode was tapped so we can render RuleManager below
//   const [selectedMode, setSelectedMode] = useState(null);

//   // Fetch existing modes from backend
//   useEffect(() => {
//     const fetchRoomModes = async () => {
//       try {
//         const res = await axiosClient.get(
//           `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
//         );
//         const data = res.data;
//         if (Array.isArray(data.Automation_Modes)) {
//           const extractedModes = data.Automation_Modes.map((modeObj) => ({
//             _id: modeObj.Mode_Name.toLowerCase().replace(/\s+/g, "_"),
//             name: modeObj.Mode_Name,
//             active: false, // default inactive; you can change logic if needed
//           }));
//           setModes(extractedModes);
//         } else {
//           throw new Error("Invalid Automation_Modes format");
//         }
//       } catch (err) {
//         console.warn("⚠️ Failed to fetch modes, using fallback:", err);
//         // Fallback example modes
//         setModes([
//           { _id: "normal_mode", name: "Normal Mode", active: true },
//           { _id: "night_mode", name: "Night Mode", active: false },
//           { _id: "energy_saver", name: "Energy Saver", active: false },
//         ]);
//       }
//     };

//     if (roomName) {
//       fetchRoomModes();
//     }
//   }, [roomName]);

//   // Toggle the “active” switch for a mode (only one can be active)
//   const toggleModeSwitch = async (index) => {
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
//     // If you want to notify backend of active‐mode change, you can PATCH here
//     // await axiosClient.patch(`/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`, { activeMode: modes[index].name });
//   };

//   // Called when a mode card is tapped
//   const selectModeForRules = (modeName) => {
//     setSelectedMode(modeName);
//   };

//   // Add a brand-new mode
//   const handleAddMode = async () => {
//     if (!newModeName.trim()) {
//       Alert.alert("Please enter a mode name");
//       return;
//     }
//     try {
//       // 1) Fetch current config
//       const res = await axiosClient.get(
//         `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
//       );
//       const data = res.data;

//       // 2) Create new mode object
//       const newMode = {
//         Mode_Name: newModeName.trim(),
//         Rules: [], // start with zero rules
//       };

//       // 3) Build updated payload and send back
//       const updatedData = {
//         username: USERNAME,
//         roomName: roomName,
//         bulbs: data.bulbs || [],
//         Areas: data.Areas || [],
//         Automation_Modes: [...(data.Automation_Modes || []), newMode],
//       };

//       await axiosClient.post("/api/rooms/configure", updatedData);

//       // 4) Update UI list
//       setModes((prev) => [
//         ...prev,
//         {
//           _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
//           name: newModeName.trim(),
//           active: false,
//         },
//       ]);

//       setNewModeName("");
//       setModalVisible(false);
//       Alert.alert("Success", "New mode added!");
//     } catch (err) {
//       console.error("❌ Failed to add mode:", err);
//       Alert.alert("Error", "Could not add new mode. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header with room title and “+” to add mode */}
//       <View style={styles.header}>
//         <Text style={styles.roomTitle}>{roomName || "Room"}</Text>
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
//         </TouchableOpacity>
//       </View>

//       {/* List of existing modes */}
//       <ScrollView contentContainerStyle={styles.modeList}>
//         {modes.map((mode, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.modeCard}
//             onPress={() => {
//               // 1) Show RuleManager below with this mode
//               selectModeForRules(mode.name);
//               // 2) Also navigate to RadarDataReceiver with same params
//               router.push({
//                 pathname: "Room/RadarDataReceiver",
//                 params: { roomName, mode: mode.name },
//               });
//             }}
//           >
//             <Text style={styles.modeText}>{mode.name}</Text>
//             <Switch
//               value={mode.active}
//               onValueChange={() => toggleModeSwitch(index)}
//               trackColor={{ false: "#444", true: "#FFD70055" }}
//               thumbColor={mode.active ? "#FFD700" : "#888"}
//             />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* If a mode was tapped, render RuleManager for it */}
//       {selectedMode && (
//         <RuleManager
//           shapes={[]} // <-- Replace [] with your actual shapes array if available
//           bulbsList={["b1", "b2", "b3", "b4"]}
//           mode={selectedMode}
//           username={USERNAME}
//         />
//       )}

//       {/* Modal to add a new mode */}
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
import RuleManager from "./RuleManager";

export default function RoomModesScreen() {
  const router = useRouter();
  const { roomName } = useLocalSearchParams(); // Fetch roomName from URL
  const USERNAME = "Tharindu"; // Hard-coded username

  const [modes, setModes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModeName, setNewModeName] = useState("");

  // Track which mode was tapped so we can render RuleManager below
  const [selectedMode, setSelectedMode] = useState(null);

  // Fetch existing modes from backend
  useEffect(() => {
    const fetchRoomModes = async () => {
      try {
        const res = await axiosClient.get(
          `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
        );
        const data = res.data;
        if (Array.isArray(data.Automation_Modes)) {
          const extractedModes = data.Automation_Modes.map((modeObj) => ({
            _id: modeObj.Mode_Name.toLowerCase().replace(/\s+/g, "_"),
            name: modeObj.Mode_Name,
            active: false, // default inactive; you can change logic if needed
          }));
          setModes(extractedModes);
        } else {
          throw new Error("Invalid Automation_Modes format");
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch modes, using fallback:", err);
        // Fallback example modes
        setModes([
          { _id: "normal_mode", name: "Normal Mode", active: true },
          { _id: "night_mode", name: "Night Mode", active: false },
          { _id: "energy_saver", name: "Energy Saver", active: false },
        ]);
      }
    };

    if (roomName) {
      fetchRoomModes();
    }
  }, [roomName]);

  // Toggle the “active” switch for a mode (only one can be active)
  // RoomModesScreen.js (excerpt)

  const toggleModeSwitch = async (index) => {
    const modeName = modes[index].name;
    const isActive = modes[index].active;
    const anotherActive = modes.some((m, i) => i !== index && m.active);

    if (!isActive && anotherActive) {
      Alert.alert("Only one mode can be active at a time.");
      return;
    }

    // 1) update local UI
    const updated = modes.map((m, i) =>
      i === index ? { ...m, active: !isActive } : { ...m, active: false }
    );
    setModes(updated);

    // 2) if we're turning this one ON, fire the MQTT‐publish API
    if (!isActive) {
      try {
        const url = `/api/rooms/publishMqtt` +
          `?username=${encodeURIComponent(USERNAME)}` +
          `&roomName=${encodeURIComponent(roomName)}` +
          `&modeName=${encodeURIComponent(modeName)}`;

        await axiosClient.post(url);
        Alert.alert("Success", `${modeName} published to MQTT`);
      } catch (err) {
        console.error("❌ MQTT publish failed", err);
        Alert.alert("Error", `Could not publish ${modeName}`);
      }
    }
  };


  // Called when a mode card is tapped
  const selectModeForRules = (modeName) => {
    setSelectedMode(modeName);
  };

  // Add a brand-new mode
  const handleAddMode = async () => {
    if (!newModeName.trim()) {
      Alert.alert("Please enter a mode name");
      return;
    }
    try {
      // 1) Fetch current config
      const res = await axiosClient.get(
        `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
      );
      const data = res.data;

      // 2) Create new mode object
      const newMode = {
        Mode_Name: newModeName.trim(),
        Rules: [], // start with zero rules
      };

      // 3) Build updated payload and send back
      const updatedData = {
        username: USERNAME,
        roomName: roomName,
        bulbs: data.bulbs || [],
        Areas: data.Areas || [],
        Automation_Modes: [...(data.Automation_Modes || []), newMode],
      };

      await axiosClient.post("/api/rooms/configure", updatedData);

      // 4) Update UI list
      setModes((prev) => [
        ...prev,
        {
          _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
          name: newModeName.trim(),
          active: false,
        },
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
      {/* Header with room title and “+” to add mode */}
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName || "Room"}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* List of existing modes */}
      <ScrollView contentContainerStyle={styles.modeList}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={styles.modeCard}
            onPress={() => {
              // 1) Show RuleManager below with this mode
              selectModeForRules(mode.name);
              // 2) Also navigate to RadarDataReceiver with same params
              router.push({
                pathname: "Room/RadarDataReceiver",
                params: { roomName, mode: mode.name },
              });
            }}
          >
            <Text style={styles.modeText}>{mode.name}</Text>
            <Switch
              value={mode.active}
              onValueChange={() => toggleModeSwitch(index)}
              trackColor={{ false: "#444", true: "#FFD70055" }}
              thumbColor={mode.active ? "#FFD700" : "#888"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* If a mode was tapped, render RuleManager for it */}
      {selectedMode && (
        <RuleManager
          shapes={[]} // <-- Replace [] with your actual shapes array if available
          bulbsList={["b1", "b2", "b3", "b4"]}
          mode={selectedMode}
          username={USERNAME}
        />
      )}

      {/* Modal to add a new mode */}
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
