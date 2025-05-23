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
//   const [day, setDay] = useState("");
//   const [date, setDate] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);
//   const [showColorOptions, setShowColorOptions] = useState(false);

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
//       setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
//       setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
//     };
//     updateClock();
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer);
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
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex, section: devices[sectionIndex].section });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       {/* Header with Plus Button */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 }}>
//         <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>Dashboard</Text>
//         <TouchableOpacity
//           onPress={() => router.push("/Room/RadarDataReceiver")}
//           style={{
//             backgroundColor: "#FFD700",
//             width: 40,
//             height: 40,
//             borderRadius: 20,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Text style={{ fontSize: 24, color: "#000", fontWeight: "bold" }}>+</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Clock Display */}
//       <View style={{ backgroundColor: "#2b2b2b", margin: 20, padding: 20, borderRadius: 15, alignItems: "center" }}>
//         <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>{time}</Text>
//         <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
//         <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
//       </View>

//       {/* Device Grid */}
//       <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>
//               <TouchableOpacity
//                 style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
//               {section.devices.map((device, deviceIndex) => (
//                 <View key={deviceIndex} style={{ width: "48%", backgroundColor: "#2D2D2D", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 }}>
//                   <Text style={{ color: "white", fontWeight: "bold" }}>{device.name}</Text>
//                   <TouchableOpacity onPress={() => openBulbModal(sectionIndex, deviceIndex)}>
//                     <MaterialCommunityIcons
//                       name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
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

//       {/* Add Room Button at Bottom */}
//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, alignItems: "center" }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bulb Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
//           <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 25, alignItems: "center" }}>
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>{selectedBulb.name}</Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>{selectedBulb.value}%</Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>{moment().subtract(37, "minutes").fromNow()}</Text>

//                 <View style={{ height: 220, justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
//                   <View style={{ position: "absolute", height: 200, width: 70, backgroundColor: "#ffefdc", borderRadius: 35, justifyContent: "flex-end", overflow: "hidden" }}>
//                     <View style={{ height: `${selectedBulb.value}%`, backgroundColor: "#FFA840", width: "100%", alignItems: "center", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
//                       <View style={{ width: 30, height: 4, backgroundColor: "#fff", borderRadius: 2, marginTop: 6 }} />
//                     </View>
//                   </View>

//                   <View style={{ transform: [{ rotate: "-90deg" }], position: "absolute", height: 200, width: 200, justifyContent: "center" }}>
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
//                         handleSliderChange(selectedBulb.sectionIndex, selectedBulb.deviceIndex, newValue);
//                         setSelectedBulb({ ...selectedBulb, value: Math.round(newValue) });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{ backgroundColor: "#f0f0f0", padding: 12, borderRadius: 50, marginHorizontal: 8 }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(selectedBulb.sectionIndex, selectedBulb.deviceIndex);
//                           setModalVisible(false);
//                         } else if (btn.action === "color") {
//                           setShowColorOptions((prev) => !prev);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons name={btn.icon} size={24} color="#000" />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 {showColorOptions && (
//                   <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
//                     {["red", "green", "blue"].map((color) => (
//                       <TouchableOpacity
//                         key={color}
//                         style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, marginHorizontal: 10, borderWidth: 2, borderColor: "#000" }}
//                         onPress={() => {
//                           const updatedDevice = { ...selectedBulb, color };
//                           publishMQTTMessage(selectedBulb.section, updatedDevice);
//                           setSelectedBulb(updatedDevice);
//                           setShowColorOptions(false);
//                         }}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
//                   <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
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







// import Slider from "@react-native-community/slider";
// import { useRouter } from "expo-router";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import {
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";

// const API_URL = "/mqtt/publish";

// const SmartHomeDashboard = () => {
//   const router = useRouter();

//   const [time, setTime] = useState("");
//   const [day, setDay] = useState("");
//   const [date, setDate] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);
//   const [showColorOptions, setShowColorOptions] = useState(false);

//   useEffect(() => {
//   const updateClock = () => {
//     const now = new Date();
//     setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
//     setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
//     setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
//   };

//   // Turn off all bulbs on initial login
//   const turnOffAllBulbs = () => {
//     setDevices((prevDevices) => {
//       return prevDevices.map((section) => ({
//         ...section,
//         devices: section.devices.map((device) => {
//           const updatedDevice = { ...device, isOn: false, value: 0 };
//           publishMQTTMessage(section.section, updatedDevice); // MQTT call
//           return updatedDevice;
//         }),
//       }));
//     });
//   };

//   updateClock();
//   const timer = setInterval(updateClock, 1000);

//   // Turn off bulbs on component mount
//   turnOffAllBulbs();

//   return () => clearInterval(timer);
// }, []);

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
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex, section: devices[sectionIndex].section });
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       {/* Header with Plus Button */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 }}>
//         <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>Dashboard</Text>
//         <TouchableOpacity
//           onPress={() => router.push("/Room/RadarDataReceiver")}
//           style={{
//             backgroundColor: "#FFD700",
//             width: 40,
//             height: 40,
//             borderRadius: 20,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Text style={{ fontSize: 24, color: "#000", fontWeight: "bold" }}>+</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Clock Display */}
//       <View style={{ backgroundColor: "#2b2b2b", margin: 20, padding: 20, borderRadius: 15, alignItems: "center" }}>
//         <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>{time}</Text>
//         <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
//         <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
//       </View>

//       {/* Device Grid */}
//       <ScrollView style={{ paddingHorizontal: 20, marginBottom: 80 }}>
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20 }}>
//             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>
//               <TouchableOpacity
//                 style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }}
//                 onPress={() => router.push("/Room/AddSchedule")}
//               >
//                 <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
//               </TouchableOpacity>
//             </View>

//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}

//             <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
//               {section.devices.map((device, deviceIndex) => (
//                 <View key={deviceIndex} style={{ width: "48%", backgroundColor: "#2D2D2D", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 }}>
//                   <Text style={{ color: "white", fontWeight: "bold" }}>{device.name}</Text>
//                   <TouchableOpacity onPress={() => openBulbModal(sectionIndex, deviceIndex)}>
//                     <MaterialCommunityIcons
//                       name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
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

//       {/* Add Room Button at Bottom */}
//       <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
//         <TouchableOpacity
//           style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, alignItems: "center" }}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bulb Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
//           <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 25, alignItems: "center" }}>
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>{selectedBulb.name}</Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>{selectedBulb.value}%</Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>{moment().subtract(37, "minutes").fromNow()}</Text>

//                 <View style={{ height: 220, justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
//                   <View style={{ position: "absolute", height: 200, width: 70, backgroundColor: "#ffefdc", borderRadius: 35, justifyContent: "flex-end", overflow: "hidden" }}>
//                     <View style={{ height: `${selectedBulb.value}%`, backgroundColor: "#FFA840", width: "100%", alignItems: "center", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
//                       <View style={{ width: 30, height: 4, backgroundColor: "#fff", borderRadius: 2, marginTop: 6 }} />
//                     </View>
//                   </View>

//                   <View style={{ transform: [{ rotate: "-90deg" }], position: "absolute", height: 200, width: 200, justifyContent: "center" }}>
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
//                         handleSliderChange(selectedBulb.sectionIndex, selectedBulb.deviceIndex, newValue);
//                         setSelectedBulb({ ...selectedBulb, value: Math.round(newValue) });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{ backgroundColor: "#f0f0f0", padding: 12, borderRadius: 50, marginHorizontal: 8 }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(selectedBulb.sectionIndex, selectedBulb.deviceIndex);
//                           setModalVisible(false);
//                         } else if (btn.action === "color") {
//                           setShowColorOptions((prev) => !prev);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons name={btn.icon} size={24} color="#000" />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 {showColorOptions && (
//                   <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
//                     {["red", "green", "blue"].map((color) => (
//                       <TouchableOpacity
//                         key={color}
//                         style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, marginHorizontal: 10, borderWidth: 2, borderColor: "#000" }}
//                         onPress={() => {
//                           const updatedDevice = { ...selectedBulb, color };
//                           publishMQTTMessage(selectedBulb.section, updatedDevice);
//                           setSelectedBulb(updatedDevice);
//                           setShowColorOptions(false);
//                         }}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
//                   <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
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











// import { Ionicons } from '@expo/vector-icons';
// import Slider from "@react-native-community/slider";
// import { useRouter } from "expo-router";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import {
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import axiosClient from "../../../utils/axiosClient";

// const API_URL = "/mqtt/publish";
// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 20,
//     paddingBottom: 10,
//     backgroundColor: "#000", // or transparent if inside scroll area
//   },
//   bulbIcon: {
//     marginRight: 10,
//     shadowColor: "#FFD700",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   logoText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FFD700",
//     letterSpacing: 2,
//     fontStyle: "italic",
//   },
// });


// const SmartHomeDashboard = () => {
//   const router = useRouter();

//   const [time, setTime] = useState("");
//   const [day, setDay] = useState("");
//   const [date, setDate] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBulb, setSelectedBulb] = useState(null);
//   const [showColorOptions, setShowColorOptions] = useState(false);

//   useEffect(() => {
//   const updateClock = () => {
//     const now = new Date();
//     setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
//     setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
//     setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
//   };

//   // Turn off all bulbs on initial login
//   const turnOffAllBulbs = () => {
//     setDevices((prevDevices) => {
//       return prevDevices.map((section) => ({
//         ...section,
//         devices: section.devices.map((device) => {
//           const updatedDevice = { ...device, isOn: false, value: 0 };
//           publishMQTTMessage(section.section, updatedDevice); // MQTT call
//           return updatedDevice;
//         }),
//       }));
//     });
//   };

//   updateClock();
//   const timer = setInterval(updateClock, 1000);

//   // Turn off bulbs on component mount
//   turnOffAllBulbs();

//   return () => clearInterval(timer);
// }, []);

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
//     setSelectedBulb({ ...device, sectionIndex, deviceIndex, section: devices[sectionIndex].section });
//     setModalVisible(true);
//   };

//   return (
// <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//     <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

//       <View style={styles.headerContainer}>
//         <Ionicons name="bulb-outline" size={40} color="#FFD700" style={styles.bulbIcon} />
//         <Text style={styles.logoText}>LIGHTIFY</Text>
//       </View>


//       {/* Clock */}
//       <View style={{ backgroundColor: "#2b2b2b", margin: 20, padding: 20, borderRadius: 15, alignItems: "center" }}>
//         <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>{time}</Text>
//         <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
//         <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
//       </View>

//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            
//             {/* Section Header with Calibrate and Add Schedule buttons */}
//             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>

//               <View style={{ flexDirection: "row" }}>
//                 {/* Calibrate Button */}
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: "#FFA500",
//                     paddingVertical: 8,
//                     paddingHorizontal: 12,
//                     borderRadius: 6,
//                     marginRight: 10,
//                   }}
//                   onPress={() => router.push("/Room/RadarDataReceiver")}
//                 >
//                   <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>Calibrate</Text>
//                 </TouchableOpacity>

//                 {/* Add Schedule Button */}
//                 <TouchableOpacity
//                   style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }}
//                   onPress={() => router.push("/Room/AddSchedule")}
//                 >
//                   <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Temperature and Humidity (optional) */}
//             {section.temperature !== undefined && (
//               <Text style={{ color: "white", marginBottom: 15 }}>
//                 🌡️ {section.temperature}°C 💧 {section.humidity ?? '--'}%
//               </Text>
//             )}

//             {/* Devices Grid */}
//             <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
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
//                   <Text style={{ color: "white", fontWeight: "bold" }}>{device.name}</Text>
//                   <TouchableOpacity onPress={() => openBulbModal(sectionIndex, deviceIndex)}>
//                     <MaterialCommunityIcons
//                       name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
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


//       {/* ✅ Add Room Button - now inside scrollable area */}
//       <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
//         <TouchableOpacity
//           style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, alignItems: "center" }}
//           onPress={() => router.push("/Room/AddRoomHome")}
//         >
//           <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
//         </TouchableOpacity>
//       </View>

//     </ScrollView>

//       {/* Bulb Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
//           <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 25, alignItems: "center" }}>
//             {selectedBulb && (
//               <>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>{selectedBulb.name}</Text>
//                 <Text style={{ fontSize: 24, marginVertical: 10 }}>{selectedBulb.value}%</Text>
//                 <Text style={{ color: "gray", marginBottom: 20 }}>{moment().subtract(37, "minutes").fromNow()}</Text>

//                 <View style={{ height: 220, justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
//                   <View style={{ position: "absolute", height: 200, width: 70, backgroundColor: "#ffefdc", borderRadius: 35, justifyContent: "flex-end", overflow: "hidden" }}>
//                     <View style={{ height: `${selectedBulb.value}%`, backgroundColor: "#FFA840", width: "100%", alignItems: "center", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
//                       <View style={{ width: 30, height: 4, backgroundColor: "#fff", borderRadius: 2, marginTop: 6 }} />
//                     </View>
//                   </View>

//                   <View style={{ transform: [{ rotate: "-90deg" }], position: "absolute", height: 200, width: 200, justifyContent: "center" }}>
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
//                         handleSliderChange(selectedBulb.sectionIndex, selectedBulb.deviceIndex, newValue);
//                         setSelectedBulb({ ...selectedBulb, value: Math.round(newValue) });
//                       }}
//                     />
//                   </View>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
//                   {[
//                     { icon: "power", action: "toggle" },
//                     { icon: "cog", action: "settings" },
//                     { icon: "palette", action: "color" },
//                     { icon: "white-balance-sunny", action: "warm" },
//                   ].map((btn, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={{ backgroundColor: "#f0f0f0", padding: 12, borderRadius: 50, marginHorizontal: 8 }}
//                       onPress={() => {
//                         if (btn.action === "toggle") {
//                           handleToggle(selectedBulb.sectionIndex, selectedBulb.deviceIndex);
//                           setModalVisible(false);
//                         } else if (btn.action === "color") {
//                           setShowColorOptions((prev) => !prev);
//                         }
//                       }}
//                     >
//                       <MaterialCommunityIcons name={btn.icon} size={24} color="#000" />
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 {showColorOptions && (
//                   <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
//                     {["red", "green", "blue"].map((color) => (
//                       <TouchableOpacity
//                         key={color}
//                         style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, marginHorizontal: 10, borderWidth: 2, borderColor: "#000" }}
//                         onPress={() => {
//                           const updatedDevice = { ...selectedBulb, color };
//                           publishMQTTMessage(selectedBulb.section, updatedDevice);
//                           setSelectedBulb(updatedDevice);
//                           setShowColorOptions(false);
//                         }}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
//                   <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
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





import { Ionicons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosClient from "../../../utils/axiosClient";

const API_URL = "/mqtt/publish";
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#000", // or transparent if inside scroll area
  },
  bulbIcon: {
    marginRight: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
    fontStyle: "italic",
  },
});


const SmartHomeDashboard = () => {
  const router = useRouter();

  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBulb, setSelectedBulb] = useState(null);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [deviceInput, setDeviceInput] = useState("");


  useEffect(() => {
  const updateClock = () => {
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
    setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  };

  // Turn off all bulbs on initial login
  const turnOffAllBulbs = () => {
    setDevices((prevDevices) => {
      return prevDevices.map((section) => ({
        ...section,
        devices: section.devices.map((device) => {
          const updatedDevice = { ...device, isOn: false, value: 0 };
          publishMQTTMessage(section.section, updatedDevice); // MQTT call
          return updatedDevice;
        }),
      }));
    });
  };

  updateClock();
  const timer = setInterval(updateClock, 1000);

  // Turn off bulbs on component mount
  turnOffAllBulbs();

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

  const handleAddDevice = async () => {
  const cleaned = deviceInput.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  if (cleaned.length !== 12) {
    alert("Please enter a valid 12-character hex string.");
    return;
  }

  const formatted = cleaned.match(/.{1,2}/g).join(":"); // Format XX:XX:XX:XX:XX:XX

  try {
    const payload = { deviceId: formatted };
    await axiosClient.post("/api/devices/add", payload); // Replace with your actual backend endpoint
    alert("Device added successfully!");
    setShowAddDeviceModal(false);
    setDeviceInput("");
  } catch (error) {
    console.error("Error adding device:", error);
    alert("Failed to add device.");
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
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.headerContainer}>
          <Ionicons name="bulb-outline" size={40} color="#FFD700" style={styles.bulbIcon} />
          <Text style={styles.logoText}>LIGHTIFY</Text>

          {/* Add Device Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              backgroundColor: "#FFD700",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 6,
            }}
            onPress={() => setShowAddDeviceModal(true)}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>+ Add Device</Text>
          </TouchableOpacity>
        </View>



      {/* Clock */}
      <View style={{ backgroundColor: "#2b2b2b", margin: 20, padding: 20, borderRadius: 15, alignItems: "center" }}>
        <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>{time}</Text>
        <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
        <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
      </View>

        {devices.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            
            {/* Section Header with Calibrate and Add Schedule buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>

              <View style={{ flexDirection: "row" }}>
                {/* Calibrate Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFA500",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                  onPress={() => router.push("/Room/RadarDataReceiver")}
                >
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>Calibrate</Text>
                </TouchableOpacity>

                {/* Add Schedule Button */}
                <TouchableOpacity
                  style={{ backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }}
                  onPress={() => router.push("/Room/AddSchedule")}
                >
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Temperature and Humidity (optional) */}
            {section.temperature !== undefined && (
              <Text style={{ color: "white", marginBottom: 15 }}>
                🌡️ {section.temperature}°C 💧 {section.humidity ?? '--'}%
              </Text>
            )}

            {/* Devices Grid */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {section.devices.map((device, deviceIndex) => (
                <View
                  key={deviceIndex}
                  style={{
                    width: "48%",
                    backgroundColor: "#2D2D2D",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
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


      {/* ✅ Add Room Button - now inside scrollable area */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#FFD700", padding: 15, borderRadius: 10, alignItems: "center" }}
          onPress={() => router.push("/Room/AddRoomHome")}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>

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

      {/* Add Device Modal */}
      <Modal visible={showAddDeviceModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Enter Device ID</Text>
            <TextInput
              placeholder="Example: 9454C5B7E32C"
              value={deviceInput}
              onChangeText={setDeviceInput}
              style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 }}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={{ backgroundColor: "#FFD700", padding: 12, borderRadius: 8, alignItems: "center" }}
              onPress={handleAddDevice}
            >
              <Text style={{ fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddDeviceModal(false)} style={{ marginTop: 15, alignItems: "center" }}>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default SmartHomeDashboard;





