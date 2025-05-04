
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient"; // Import axios for API requests

// const API_URL = "/mqtt/publish"; // Your MQTT publish API endpoint

// const SmartHomeDashboard = () => {
//   const router = useRouter();

//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 50, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 50, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 50, isOn: true },
//       ],
//     },
//   ]);

//   // Function to send MQTT message only for the changed bulb
//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`, // Adjust topic as needed
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//             },
//           ],
//         }),
//       };

//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   // Handle bulb toggle (turn ON/OFF)
//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0, // Set brightness to 100 when ON, 0 when OFF
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     // Send only the updated bulb details
//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   // Handle brightness change
//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     // Send only the updated brightness details
//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       <ScrollView style={{ padding: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             {/* Room Title + Add Schedule Button */}
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}
//               >
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text
//                   style={{ color: "black", fontWeight: "bold", fontSize: 14 }}
//                 >
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Display temperature & humidity if available */}
//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             {/* Bulb Grid */}
//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   {/* Bulb Icon Toggle */}
//                   <TouchableOpacity
//                     onPress={() => handleToggle(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>

//                   {/* Intensity Slider */}
//                   <Slider
//                     style={{ width: "90%", height: 40 }}
//                     minimumValue={0}
//                     maximumValue={100}
//                     step={1}
//                     minimumTrackTintColor={device.isOn ? "#FFD700" : "gray"}
//                     thumbTintColor="#FFD700"
//                     value={device.value}
//                     onSlidingComplete={(newValue) =>
//                       handleSliderChange(sectionIndex, deviceIndex, newValue)
//                     }
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Add Room Button */}
//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";
// import { useRouter } from "expo-router";
// import moment from "moment";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
//         { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
//         { name: "Bulb 3", id: 7, type: "lamp", value: 20, isOn: true },
//         { name: "Bulb 4", id: 8, type: "lamp", value: 80, isOn: true },
//       ],
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);

//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`,
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//             },
//           ],
//         }),
//       };
//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0,
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const openBulbModal = (sectionIndex, deviceIndex) => {
//     const device = devices[sectionIndex].devices[deviceIndex];
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       <ScrollView style={{ padding: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}
//               >
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text
//                   style={{ color: "black", fontWeight: "bold", fontSize: 14 }}
//                 >
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() => openBulbModal(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={
//                         device.isOn ? "lightbulb-on" : "lightbulb-outline"
//                       }
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>

//                   <Slider
//                     style={{ width: "90%", height: 40 }}
//                     minimumValue={0}
//                     maximumValue={100}
//                     step={1}
//                     minimumTrackTintColor={device.isOn ? "#FFD700" : "gray"}
//                     thumbTintColor="#FFD700"
//                     value={device.value}
//                     onSlidingComplete={(newValue) =>
//                       handleSliderChange(sectionIndex, deviceIndex, newValue)
//                     }
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//           }}
//         >
//           <View
//             style={{
//               width: "80%",
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 20,
//               alignItems: "center",
//             }}
//           >
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                   {selectedBulb.name}
//                 </Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>
//                   {selectedBulb.value}%
//                 </Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>
//                   {moment().subtract(37, "minutes").fromNow()}
//                 </Text>

//                 <View
//                   style={{
//                     height: 200,
//                     width: 50,
//                     borderRadius: 25,
//                     backgroundColor: "#ffe7c4",
//                     justifyContent: "flex-end",
//                     overflow: "hidden",
//                     marginBottom: 20,
//                   }}
//                 >
//                   <View
//                     style={{
//                       height: `${selectedBulb.value}%`,
//                       backgroundColor: "#FFA840",
//                       width: "100%",
//                       alignItems: "center",
//                     }}
//                   >
//                     <View
//                       style={{
//                         height: 4,
//                         width: 20,
//                         backgroundColor: "#fff",
//                         marginTop: 5,
//                         borderRadius: 2,
//                       }}
//                     />
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     width: "80%",
//                   }}
//                 >
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         backgroundColor: "#f0f0f0",
//                         padding: 10,
//                         borderRadius: 30,
//                         marginHorizontal: 5,
//                       }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(
//                             selectedBulb.sectionIndex,
//                             selectedBulb.deviceIndex
//                           );
//                           setModalVisible(false);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons
//                         name={btn.icon}
//                         size={24}
//                         color="#000"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{ marginTop: 20 }}
//                 >
//                   <Text style={{ color: "red", fontWeight: "bold" }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";
// import { useRouter } from "expo-router";
// import moment from "moment";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
//         { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
//       ],
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);

//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`,
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//               ...(device.color && { color: device.color }),
//             },
//           ],
//         }),
//       };
//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0,
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const openBulbModal = (sectionIndex, deviceIndex) => {
//     const device = devices[sectionIndex].devices[deviceIndex];
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       <ScrollView style={{ padding: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}
//               >
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text
//                   style={{ color: "black", fontWeight: "bold", fontSize: 14 }}
//                 >
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() => openBulbModal(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={
//                         device.isOn ? "lightbulb-on" : "lightbulb-outline"
//                       }
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//           }}
//         >
//           <View
//             style={{
//               width: "85%",
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 25,
//               alignItems: "center",
//             }}
//           >
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                   {selectedBulb.name}
//                 </Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>
//                   {selectedBulb.value}%
//                 </Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>
//                   {moment().subtract(37, "minutes").fromNow()}
//                 </Text>

//                 {/* Proper Vertical Slider */}
//                 <View
//                   style={{
//                     height: 200,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginVertical: 10,
//                   }}
//                 >
//                   <View
//                     style={{
//                       transform: [{ rotate: "-90deg" }],
//                       width: 200,
//                     }}
//                   >
//                     <Slider
//                       minimumValue={0}
//                       maximumValue={100}
//                       step={1}
//                       value={selectedBulb.value}
//                       minimumTrackTintColor="#FFA840"
//                       maximumTrackTintColor="#ffe7c4"
//                       thumbTintColor="#FFA840"
//                       onValueChange={(newValue) => {
//                         handleSliderChange(
//                           selectedBulb.sectionIndex,
//                           selectedBulb.deviceIndex,
//                           newValue
//                         );
//                         setSelectedBulb({
//                           ...selectedBulb,
//                           value: Math.round(newValue),
//                         });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 {/* Control Buttons */}
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-around",
//                     width: "100%",
//                     marginTop: 20,
//                   }}
//                 >
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         backgroundColor: "#f0f0f0",
//                         padding: 12,
//                         borderRadius: 50,
//                         marginHorizontal: 8,
//                       }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(
//                             selectedBulb.sectionIndex,
//                             selectedBulb.deviceIndex
//                           );
//                           setModalVisible(false);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons
//                         name={btn.icon}
//                         size={24}
//                         color="#000"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{ marginTop: 20 }}
//                 >
//                   <Text style={{ color: "red", fontWeight: "bold" }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";
// import { useRouter } from "expo-router";
// import moment from "moment";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
//         { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
//       ],
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);

//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`,
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//               ...(device.color && { color: device.color }),
//             },
//           ],
//         }),
//       };
//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0,
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const openBulbModal = (sectionIndex, deviceIndex) => {
//     const device = devices[sectionIndex].devices[deviceIndex];
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       <ScrollView style={{ padding: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}
//               >
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text
//                   style={{ color: "black", fontWeight: "bold", fontSize: 14 }}
//                 >
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() => openBulbModal(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={
//                         device.isOn ? "lightbulb-on" : "lightbulb-outline"
//                       }
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//           }}
//         >
//           <View
//             style={{
//               width: "85%",
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 25,
//               alignItems: "center",
//             }}
//           >
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                   {selectedBulb.name}
//                 </Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>
//                   {selectedBulb.value}%
//                 </Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>
//                   {moment().subtract(37, "minutes").fromNow()}
//                 </Text>

//                 {/* Brightness Bar with Real Slider */}
//                 <View
//                   style={{
//                     height: 220,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginVertical: 20,
//                   }}
//                 >
//                   {/* Fill bar */}
//                   <View
//                     style={{
//                       position: "absolute",
//                       height: 200,
//                       width: 70,
//                       backgroundColor: "#ffefdc",
//                       borderRadius: 35,
//                       justifyContent: "flex-end",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <View
//                       style={{
//                         height: `${selectedBulb.value}%`,
//                         backgroundColor: "#FFA840",
//                         width: "100%",
//                         alignItems: "center",
//                         borderTopLeftRadius: 10,
//                         borderTopRightRadius: 10,
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 30,
//                           height: 4,
//                           backgroundColor: "#fff",
//                           borderRadius: 2,
//                           marginTop: 6,
//                         }}
//                       />
//                     </View>
//                   </View>

//                   {/* Real, rotated slider overlay */}
//                   <View
//                     style={{
//                       transform: [{ rotate: "-90deg" }],
//                       position: "absolute",
//                       height: 200,
//                       width: 200,
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Slider
//                       style={{ width: 200, height: 40 }}
//                       minimumValue={0}
//                       maximumValue={100}
//                       step={1}
//                       value={selectedBulb.value}
//                       minimumTrackTintColor="transparent"
//                       maximumTrackTintColor="transparent"
//                       thumbTintColor="transparent"
//                       onValueChange={(newValue) => {
//                         handleSliderChange(
//                           selectedBulb.sectionIndex,
//                           selectedBulb.deviceIndex,
//                           newValue
//                         );
//                         setSelectedBulb({
//                           ...selectedBulb,
//                           value: Math.round(newValue),
//                         });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 {/* Control Buttons */}
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-around",
//                     width: "100%",
//                     marginTop: 10,
//                   }}
//                 >
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         backgroundColor: "#f0f0f0",
//                         padding: 12,
//                         borderRadius: 50,
//                         marginHorizontal: 8,
//                       }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(
//                             selectedBulb.sectionIndex,
//                             selectedBulb.deviceIndex
//                           );
//                           setModalVisible(false);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons
//                         name={btn.icon}
//                         size={24}
//                         color="#000"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{ marginTop: 20 }}
//                 >
//                   <Text style={{ color: "red", fontWeight: "bold" }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";
// import { useRouter } from "expo-router";
// import moment from "moment";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();
//   const [time, setTime] = useState("");
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
//         { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
//       ],
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const formattedTime = now.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       });
//       setTime(formattedTime);
//     };

//     updateClock(); // initial call
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer); // cleanup
//   }, []);

//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`,
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//               ...(device.color && { color: device.color }),
//             },
//           ],
//         }),
//       };
//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0,
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const openBulbModal = (sectionIndex, deviceIndex) => {
//     const device = devices[sectionIndex].devices[deviceIndex];
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       {/* Digital Clock */}
//       <View style={{ padding: 20, paddingTop: 40, alignItems: "center" }}>
//         <Text style={{ color: "#FFD700", fontSize: 24, fontWeight: "bold" }}>
//           {time}
//         </Text>
//       </View>

//       <ScrollView style={{ padding: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: "bold", color: "white" }}
//               >
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text
//                   style={{ color: "black", fontWeight: "bold", fontSize: 14 }}
//                 >
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() => openBulbModal(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={
//                         device.isOn ? "lightbulb-on" : "lightbulb-outline"
//                       }
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Add Room Button */}
//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bulb Control Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//           }}
//         >
//           <View
//             style={{
//               width: "85%",
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 25,
//               alignItems: "center",
//             }}
//           >
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                   {selectedBulb.name}
//                 </Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>
//                   {selectedBulb.value}%
//                 </Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>
//                   {moment().subtract(37, "minutes").fromNow()}
//                 </Text>

//                 {/* Brightness Visual + Slider */}
//                 <View
//                   style={{
//                     height: 220,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginVertical: 20,
//                   }}
//                 >
//                   <View
//                     style={{
//                       position: "absolute",
//                       height: 200,
//                       width: 70,
//                       backgroundColor: "#ffefdc",
//                       borderRadius: 35,
//                       justifyContent: "flex-end",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <View
//                       style={{
//                         height: `${selectedBulb.value}%`,
//                         backgroundColor: "#FFA840",
//                         width: "100%",
//                         alignItems: "center",
//                         borderTopLeftRadius: 10,
//                         borderTopRightRadius: 10,
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 30,
//                           height: 4,
//                           backgroundColor: "#fff",
//                           borderRadius: 2,
//                           marginTop: 6,
//                         }}
//                       />
//                     </View>
//                   </View>

//                   {/* Rotated Slider */}
//                   <View
//                     style={{
//                       transform: [{ rotate: "-90deg" }],
//                       position: "absolute",
//                       height: 200,
//                       width: 200,
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Slider
//                       style={{ width: 200, height: 40 }}
//                       minimumValue={0}
//                       maximumValue={100}
//                       step={1}
//                       value={selectedBulb.value}
//                       minimumTrackTintColor="transparent"
//                       maximumTrackTintColor="transparent"
//                       thumbTintColor="transparent"
//                       onValueChange={(newValue) => {
//                         handleSliderChange(
//                           selectedBulb.sectionIndex,
//                           selectedBulb.deviceIndex,
//                           newValue
//                         );
//                         setSelectedBulb({
//                           ...selectedBulb,
//                           value: Math.round(newValue),
//                         });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 {/* Control Buttons */}
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-around",
//                     width: "100%",
//                     marginTop: 10,
//                   }}
//                 >
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         backgroundColor: "#f0f0f0",
//                         padding: 12,
//                         borderRadius: 50,
//                         marginHorizontal: 8,
//                       }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(
//                             selectedBulb.sectionIndex,
//                             selectedBulb.deviceIndex
//                           );
//                           setModalVisible(false);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons
//                         name={btn.icon}
//                         size={24}
//                         color="#000"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{ marginTop: 20 }}
//                 >
//                   <Text style={{ color: "red", fontWeight: "bold" }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;




// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";
// import { useRouter } from "expo-router";
// import moment from "moment";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();

//   // Digital Clock States
//   const [time, setTime] = useState("");
//   const [day, setDay] = useState("");
//   const [date, setDate] = useState("");

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const formattedTime = now.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       });
//       const formattedDay = now.toLocaleDateString("en-US", { weekday: "long" });
//       const formattedDate = now.toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       });

//       setTime(formattedTime);
//       setDay(formattedDay);
//       setDate(formattedDate);
//     };

//     updateClock(); // initial call
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer); // cleanup
//   }, []);

//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
//         { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
//         { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
//         { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
//       ],
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);

//   const publishMQTTMessage = async (roomName, device) => {
//     try {
//       const payload = {
//         topic: `topic/2`,
//         message: JSON.stringify({
//           roomName: roomName,
//           message: [
//             {
//               bulb_id: device.id,
//               brightness: device.value,
//               ...(device.color && { color: device.color }),
//             },
//           ],
//         }),
//       };
//       await axiosClient.post(API_URL, payload);
//       console.log("MQTT message sent:", payload);
//     } catch (error) {
//       console.error("Error sending MQTT message:", error);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? {
//                       ...device,
//                       isOn: !device.isOn,
//                       value: !device.isOn ? 100 : 0,
//                     }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
//       value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) =>
//       prevDevices.map((section, sIndex) =>
//         sIndex === sectionIndex
//           ? {
//               ...section,
//               devices: section.devices.map((device, dIndex) =>
//                 dIndex === deviceIndex
//                   ? { ...device, value: Math.round(newValue) }
//                   : device
//               ),
//             }
//           : section
//       )
//     );

//     const updatedDevice = {
//       ...devices[sectionIndex].devices[deviceIndex],
//       value: Math.round(newValue),
//     };

//     publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
//   };

//   const openBulbModal = (sectionIndex, deviceIndex) => {
//     const device = devices[sectionIndex].devices[deviceIndex];
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       {/* Beautiful Clock Card */}
//       <View
//         style={{
//           backgroundColor: "#2b2b2b",
//           margin: 20,
//           padding: 20,
//           borderRadius: 15,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 3 },
//           shadowOpacity: 0.3,
//           shadowRadius: 5,
//           elevation: 8,
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>
//           {time}
//         </Text>
//         <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
//         <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
//       </View>

//       <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
//                 {section.section}
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#FFD700",
//                   paddingVertical: 8,
//                   paddingHorizontal: 12,
//                   borderRadius: 6,
//                 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>
//                   + Add Schedule
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 justifyContent: "space-between",
//               }}
//             >
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   style={{
//                     width: "48%",
//                     backgroundColor: "#2D2D2D",
//                     padding: 15,
//                     borderRadius: 10,
//                     alignItems: "center",
//                     marginBottom: 10,
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {device.name}
//                   </Text>

//                   <TouchableOpacity
//                     onPress={() => openBulbModal(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name={
//                         device.isOn ? "lightbulb-on" : "lightbulb-outline"
//                       }
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       style={{ marginBottom: 10 }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#FFD700",
//             padding: 15,
//             borderRadius: 10,
//             alignItems: "center",
//           }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
//             + Add Room
//           </Text>
//         </TouchableOpacity>
//       </View>
//             {/* Bulb Control Modal */}
//             <Modal visible={modalVisible} transparent animationType="slide">
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//           }}
//         >
//           <View
//             style={{
//               width: "85%",
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 25,
//               alignItems: "center",
//             }}
//           >
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                   {selectedBulb.name}
//                 </Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>
//                   {selectedBulb.value}%
//                 </Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>
//                   {moment().subtract(37, "minutes").fromNow()}
//                 </Text>

//                 {/* Brightness Visual + Slider */}
//                 <View
//                   style={{
//                     height: 220,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginVertical: 20,
//                   }}
//                 >
//                   <View
//                     style={{
//                       position: "absolute",
//                       height: 200,
//                       width: 70,
//                       backgroundColor: "#ffefdc",
//                       borderRadius: 35,
//                       justifyContent: "flex-end",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <View
//                       style={{
//                         height: `${selectedBulb.value}%`,
//                         backgroundColor: "#FFA840",
//                         width: "100%",
//                         alignItems: "center",
//                         borderTopLeftRadius: 10,
//                         borderTopRightRadius: 10,
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 30,
//                           height: 4,
//                           backgroundColor: "#fff",
//                           borderRadius: 2,
//                           marginTop: 6,
//                         }}
//                       />
//                     </View>
//                   </View>

//                   {/* Rotated Slider */}
//                   <View
//                     style={{
//                       transform: [{ rotate: "-90deg" }],
//                       position: "absolute",
//                       height: 200,
//                       width: 200,
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Slider
//                       style={{ width: 200, height: 40 }}
//                       minimumValue={0}
//                       maximumValue={100}
//                       step={1}
//                       value={selectedBulb.value}
//                       minimumTrackTintColor="transparent"
//                       maximumTrackTintColor="transparent"
//                       thumbTintColor="transparent"
//                       onValueChange={(newValue) => {
//                         handleSliderChange(
//                           selectedBulb.sectionIndex,
//                           selectedBulb.deviceIndex,
//                           newValue
//                         );
//                         setSelectedBulb({
//                           ...selectedBulb,
//                           value: Math.round(newValue),
//                         });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 {/* Control Buttons */}
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-around",
//                     width: "100%",
//                     marginTop: 10,
//                   }}
//                 >
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{
//                         backgroundColor: "#f0f0f0",
//                         padding: 12,
//                         borderRadius: 50,
//                         marginHorizontal: 8,
//                       }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(
//                             selectedBulb.sectionIndex,
//                             selectedBulb.deviceIndex
//                           );
//                           setModalVisible(false);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons
//                         name={btn.icon}
//                         size={24}
//                         color="#000"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{ marginTop: 20 }}
//                 >
//                   <Text style={{ color: "red", fontWeight: "bold" }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//       {/* Modal Component (unchanged) */}
//       {/* ... keep your existing modal here */}
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;





import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosClient from "../../../utils/axiosClient";
import { useRouter } from "expo-router";
import moment from "moment";

const API_URL = "/mqtt/publish";

const SmartHomeDashboard = () => {
  const router = useRouter();

  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBulb, setSelectedBulb] = useState(null);
  const [showColorOptions, setShowColorOptions] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
      setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const [devices, setDevices] = useState([
    {
      section: "Living Room",
      temperature: 22.8,
      humidity: 57,
      devices: [
        { name: "Bulb 1", id: 1, type: "lamp", value: 70, isOn: true },
        { name: "Bulb 2", id: 2, type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", id: 3, type: "lamp", value: 30, isOn: false },
        { name: "Bulb 4", id: 4, type: "lamp", value: 90, isOn: true },
      ],
    },
    {
      section: "Kitchen",
      devices: [
        { name: "Bulb 1", id: 5, type: "lamp", value: 60, isOn: true },
        { name: "Bulb 2", id: 6, type: "lamp", value: 40, isOn: true },
      ],
    },
  ]);

  const publishMQTTMessage = async (roomName, device) => {
    try {
      const payload = {
        topic: `topic/2`,
        message: JSON.stringify({
          roomName: roomName,
          message: [
            {
              bulb_id: device.id,
              brightness: device.value,
              ...(device.color && { color: device.color }),
            },
          ],
        }),
      };
      await axiosClient.post(API_URL, payload);
      console.log("MQTT message sent:", payload);
    } catch (error) {
      console.error("Error sending MQTT message:", error);
    }
  };

  const handleToggle = (sectionIndex, deviceIndex) => {
    setDevices((prevDevices) =>
      prevDevices.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              devices: section.devices.map((device, dIndex) =>
                dIndex === deviceIndex
                  ? {
                      ...device,
                      isOn: !device.isOn,
                      value: !device.isOn ? 100 : 0,
                    }
                  : device
              ),
            }
          : section
      )
    );

    const updatedDevice = {
      ...devices[sectionIndex].devices[deviceIndex],
      isOn: !devices[sectionIndex].devices[deviceIndex].isOn,
      value: !devices[sectionIndex].devices[deviceIndex].isOn ? 100 : 0,
    };

    publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
  };

  const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
    setDevices((prevDevices) =>
      prevDevices.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              devices: section.devices.map((device, dIndex) =>
                dIndex === deviceIndex
                  ? { ...device, value: Math.round(newValue) }
                  : device
              ),
            }
          : section
      )
    );

    const updatedDevice = {
      ...devices[sectionIndex].devices[deviceIndex],
      value: Math.round(newValue),
    };

    publishMQTTMessage(devices[sectionIndex].section, updatedDevice);
  };

  const openBulbModal = (sectionIndex, deviceIndex) => {
    const device = devices[sectionIndex].devices[deviceIndex];
    setSelectedBulb({ ...device, sectionIndex, deviceIndex, section: devices[sectionIndex].section });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Clock Display */}
      <View style={{ backgroundColor: "#2b2b2b", margin: 20, padding: 20, borderRadius: 15, alignItems: "center" }}>
        <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>{time}</Text>
        <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
        <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
      </View>

      {/* Device Grid */}
      <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
        {devices.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>
              <TouchableOpacity
                style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }}
                onPress={() => router.push("/Room/AddSchedule")}
              >
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
              </TouchableOpacity>
            </View>

            {section.temperature !== undefined && (
              <Text style={{ color: "white", marginBottom: 15 }}>
                🌡️ {section.temperature}°C 💧 {section.humidity}%
              </Text>
            )}

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {section.devices.map((device, deviceIndex) => (
                <View key={deviceIndex} style={{ width: "48%", backgroundColor: "#2D2D2D", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>{device.name}</Text>
                  <TouchableOpacity onPress={() => openBulbModal(sectionIndex, deviceIndex)}>
                    <MaterialCommunityIcons
                      name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
                      size={50}
                      color={device.isOn ? "#FFD700" : "#555"}
                      style={{ marginBottom: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Room Button */}
      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, alignItems: "center" }}
          onPress={() => router.push("/Room/AddRoom")}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
        </TouchableOpacity>
      </View>

      {/* Bulb Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 25, alignItems: "center" }}>
            {selectedBulb && (
              <>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{selectedBulb.name}</Text>
                <Text style={{ fontSize: 24, marginVertical: 10 }}>{selectedBulb.value}%</Text>
                <Text style={{ color: "gray", marginBottom: 20 }}>{moment().subtract(37, "minutes").fromNow()}</Text>

                <View style={{ height: 220, justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
                  <View style={{ position: "absolute", height: 200, width: 70, backgroundColor: "#ffefdc", borderRadius: 35, justifyContent: "flex-end", overflow: "hidden" }}>
                    <View style={{ height: `${selectedBulb.value}%`, backgroundColor: "#FFA840", width: "100%", alignItems: "center", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                      <View style={{ width: 30, height: 4, backgroundColor: "#fff", borderRadius: 2, marginTop: 6 }} />
                    </View>
                  </View>

                  <View style={{ transform: [{ rotate: "-90deg" }], position: "absolute", height: 200, width: 200, justifyContent: "center" }}>
                    <Slider
                      style={{ width: 200, height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={selectedBulb.value}
                      minimumTrackTintColor="transparent"
                      maximumTrackTintColor="transparent"
                      thumbTintColor="transparent"
                      onValueChange={(newValue) => {
                        handleSliderChange(selectedBulb.sectionIndex, selectedBulb.deviceIndex, newValue);
                        setSelectedBulb({ ...selectedBulb, value: Math.round(newValue) });
                      }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
                  {[
                    { icon: "power", action: "toggle" },
                    { icon: "cog", action: "settings" },
                    { icon: "palette", action: "color" },
                    { icon: "white-balance-sunny", action: "warm" },
                  ].map((btn, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ backgroundColor: "#f0f0f0", padding: 12, borderRadius: 50, marginHorizontal: 8 }}
                      onPress={() => {
                        if (btn.action === "toggle") {
                          handleToggle(selectedBulb.sectionIndex, selectedBulb.deviceIndex);
                          setModalVisible(false);
                        } else if (btn.action === "color") {
                          setShowColorOptions((prev) => !prev);
                        }
                      }}
                    >
                      <MaterialCommunityIcons name={btn.icon} size={24} color="#000" />
                    </TouchableOpacity>
                  ))}
                </View>

                {showColorOptions && (
                  <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                    {["red", "green", "blue"].map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, marginHorizontal: 10, borderWidth: 2, borderColor: "#000" }}
                        onPress={() => {
                          const updatedDevice = { ...selectedBulb, color };
                          publishMQTTMessage(selectedBulb.section, updatedDevice);
                          setSelectedBulb(updatedDevice);
                          setShowColorOptions(false);
                        }}
                      />
                    ))}
                  </View>
                )}

                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SmartHomeDashboard;


