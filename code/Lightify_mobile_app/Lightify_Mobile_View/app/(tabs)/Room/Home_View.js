// // import React, { useState } from 'react';
// // import { View, Text, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
// // import Slider from '@react-native-community/slider';
// // import axiosClient from "../../utils/axiosClient";

// // const SmartHomeDashboard = () => {
// //   const [devices, setDevices] = useState([
// //     {
// //       section: "LivingRoom",
// //       temperature: 22.8,
// //       humidity: 57,
// //       devices: [
// //         { name: "Bulb 1", id: "bulb101", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 2", id: "bulb102", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 3", id: "bulb103", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 4", id: "bulb104", type: "lamp", value: 50, isOn: true },
// //       ],
// //     },
// //     {
// //       section: "Kitchen",
// //       devices: [
// //         { name: "Bulb 1", id: "bulb201", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 2", id: "bulb202", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 3", id: "bulb203", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 4", id: "bulb204", type: "lamp", value: 50, isOn: true },
// //       ],
// //     },
// //     {
// //       section: "Outdoor",
// //       temperature: 10.2,
// //       illuminance: 555,
// //       devices: [
// //         { name: "Bulb 1", id: "bulb301", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 2", id: "bulb302", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 3", id: "bulb303", type: "lamp", value: 50, isOn: true },
// //         { name: "Bulb 4", id: "bulb304", type: "lamp", value: 50, isOn: true },
// //       ],
// //     },
// //   ]);

// //   const sendBulbUpdate = async (roomName, bulbId, newIntensity) => {
// //     // Ensure the intensity is a valid integer between 0-100
// //     const safeIntensity = Math.round(Math.max(0, Math.min(100, newIntensity)));

// //     const message = JSON.stringify({
// //       Bulb_Id: bulbId,
// //       Intensity: safeIntensity.toString(),
// //     });

// //     const payload = {
// //       roomName,
// //       message: message, // The message is now properly formatted as a string
// //     };

// //     try {
// //       await axiosClient.post('/api/topics/publish', payload);
// //     } catch (error) {
// //       Alert.alert('Error', `Failed to update ${bulbId}`);
// //     }
// //   };

// //   const handleToggle = (sectionIndex, deviceIndex) => {
// //     setDevices((prevDevices) => {
// //       const updatedDevices = prevDevices.map((section, sIndex) => {
// //         if (sIndex === sectionIndex) {
// //           return {
// //             ...section,
// //             devices: section.devices.map((device, dIndex) => {
// //               if (dIndex === deviceIndex) {
// //                 const newIsOn = !device.isOn;
// //                 const newIntensity = newIsOn ? 100 : 0; // Ensuring only 100 or 0

// //                 sendBulbUpdate(section.section, device.id, newIntensity);
// //                 return { ...device, isOn: newIsOn };
// //               }
// //               return device;
// //             }),
// //           };
// //         }
// //         return section;
// //       });

// //       return updatedDevices;
// //     });
// //   };

// //   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
// //     setDevices((prevDevices) => {
// //       const updatedDevices = prevDevices.map((section, sIndex) => {
// //         if (sIndex === sectionIndex) {
// //           return {
// //             ...section,
// //             devices: section.devices.map((device, dIndex) => {
// //               if (dIndex === deviceIndex) {
// //                 const roundedValue = Math.round(newValue); // Ensure integer value (0-100)
// //                 sendBulbUpdate(section.section, device.id, roundedValue);
// //                 return { ...device, value: roundedValue };
// //               }
// //               return device;
// //             }),
// //           };
// //         }
// //         return section;
// //       });

// //       return updatedDevices;
// //     });
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       {devices.map((section, sectionIndex) => (
// //         <View key={sectionIndex} style={styles.section}>
// //           <Text style={styles.sectionTitle}>{section.section}</Text>
// //           {section.temperature !== undefined && (
// //             <Text style={styles.infoText}>🌡️ {section.temperature}°C 💧 {section.humidity}%</Text>
// //           )}
// //           <View style={styles.deviceGrid}>
// //             {section.devices.map((device, deviceIndex) => (
// //               <View key={deviceIndex} style={styles.deviceCard}>
// //                 <Text style={styles.deviceName}>{device.name}</Text>
// //                 <Slider
// //                   style={styles.slider}
// //                   minimumValue={0}
// //                   maximumValue={100}
// //                   step={1} // Ensure only integer values
// //                   value={device.value}
// //                   onSlidingComplete={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
// //                 />
// //                 <Switch
// //                   value={device.isOn}
// //                   onValueChange={() => handleToggle(sectionIndex, deviceIndex)}
// //                 />
// //               </View>
// //             ))}
// //           </View>
// //         </View>
// //       ))}
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: '#F8F9FA',
// //     padding: 10,
// //   },
// //   section: {
// //     marginBottom: 20,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   infoText: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginBottom: 5,
// //   },
// //   deviceGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   deviceCard: {
// //     width: '48%',
// //     backgroundColor: 'white',
// //     padding: 15,
// //     borderRadius: 10,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 3,
// //     marginBottom: 10,
// //   },
// //   deviceName: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   slider: {
// //     width: '100%',
// //     height: 40,
// //   },
// // });

// // export default SmartHomeDashboard;


// import React, { useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Bulb Icon
// import axiosClient from "../../utils/axiosClient";

// const SmartHomeDashboard = () => {
//   const [devices, setDevices] = useState([
//     {
//       section: "LivingRoom",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: "bulb101", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: "bulb102", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: "bulb103", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 4", id: "bulb104", type: "lamp", value: 50, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: "bulb201", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: "bulb202", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: "bulb203", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 4", id: "bulb204", type: "lamp", value: 50, isOn: true },
//       ],
//     },
//     {
//       section: "Outdoor",
//       temperature: 10.2,
//       illuminance: 555,
//       devices: [
//         { name: "Bulb 1", id: "bulb301", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: "bulb302", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: "bulb303", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 4", id: "bulb304", type: "lamp", value: 50, isOn: true },
//       ],
//     },
//   ]);

//   const sendBulbUpdate = async (roomName, bulbId, newIntensity) => {
//     const safeIntensity = Math.round(Math.max(0, Math.min(100, newIntensity)));

//     const message = JSON.stringify({
//       Bulb_Id: bulbId,
//       Intensity: safeIntensity.toString(),
//     });

//     const payload = {
//       roomName,
//       message: message,
//     };

//     try {
//       await axiosClient.post('/api/topics/publish', payload);
//     } catch (error) {
//       Alert.alert('Error', `Failed to update ${bulbId}`);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = prevDevices.map((section, sIndex) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             devices: section.devices.map((device, dIndex) => {
//               if (dIndex === deviceIndex) {
//                 const newIsOn = !device.isOn;
//                 const newIntensity = newIsOn ? 100 : 0;

//                 sendBulbUpdate(section.section, device.id, newIntensity);
//                 return { ...device, isOn: newIsOn };
//               }
//               return device;
//             }),
//           };
//         }
//         return section;
//       });

//       return updatedDevices;
//     });
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = prevDevices.map((section, sIndex) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             devices: section.devices.map((device, dIndex) => {
//               if (dIndex === deviceIndex) {
//                 const roundedValue = Math.round(newValue);
//                 sendBulbUpdate(section.section, device.id, roundedValue);
//                 return { ...device, value: roundedValue };
//               }
//               return device;
//             }),
//           };
//         }
//         return section;
//       });

//       return updatedDevices;
//     });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {devices.map((section, sectionIndex) => (
//         <View key={sectionIndex} style={styles.section}>
//           <Text style={styles.sectionTitle}>{section.section}</Text>
//           {section.temperature !== undefined && (
//             <Text style={styles.infoText}>🌡️ {section.temperature}°C 💧 {section.humidity}%</Text>
//           )}
//           <View style={styles.deviceGrid}>
//             {section.devices.map((device, deviceIndex) => (
//               <View key={deviceIndex} style={styles.deviceCard}>
//                 <Text style={styles.deviceName}>{device.name}</Text>

//                 {/* Bulb Icon Toggle */}
//                 <TouchableOpacity onPress={() => handleToggle(sectionIndex, deviceIndex)}>
//                   <MaterialCommunityIcons
//                     name="lightbulb"
//                     size={40}
//                     color={device.isOn ? "yellow" : "gray"}
//                   />
//                 </TouchableOpacity>

//                 {/* Intensity Slider */}
//                 <Slider
//                   style={styles.slider}
//                   minimumValue={0}
//                   maximumValue={100}
//                   step={1}
//                   value={device.value}
//                   onSlidingComplete={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
//                 />
//               </View>
//             ))}
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#F8F9FA',
//     padding: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   deviceGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   deviceCard: {
//     width: '48%',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   deviceName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//   },
// });

// export default SmartHomeDashboard;


// import React, { useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Bulb Icon
// import axiosClient from "../../../utils/axiosClient";

// const SmartHomeDashboard = () => {
//   const [devices, setDevices] = useState([
//     {
//       section: "LivingRoom",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Bulb 1", id: "bulb101", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: "bulb102", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: "bulb103", type: "lamp", value: 50, isOn: false },
//         { name: "Bulb 4", id: "bulb104", type: "lamp", value: 50, isOn: true },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Bulb 1", id: "bulb201", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 2", id: "bulb202", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 3", id: "bulb203", type: "lamp", value: 50, isOn: true },
//         { name: "Bulb 4", id: "bulb204", type: "lamp", value: 50, isOn: true },
//       ],
//     },
//   ]);

//   const sendBulbUpdate = async (roomName, bulbId, newIntensity) => {
//     const safeIntensity = Math.round(Math.max(0, Math.min(100, newIntensity)));

//     const message = JSON.stringify({
//       Bulb_Id: bulbId,
//       Intensity: safeIntensity.toString(),
//     });

//     const payload = {
//       roomName,
//       message: message,
//     };

//     try {
//       await axiosClient.post('/api/topics/publish', payload);
//     } catch (error) {
//       Alert.alert('Error', `Failed to update ${bulbId}`);
//     }
//   };

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = prevDevices.map((section, sIndex) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             devices: section.devices.map((device, dIndex) => {
//               if (dIndex === deviceIndex) {
//                 const newIsOn = !device.isOn;
//                 const newIntensity = newIsOn ? 100 : 0;

//                 sendBulbUpdate(section.section, device.id, newIntensity);
//                 return { ...device, isOn: newIsOn };
//               }
//               return device;
//             }),
//           };
//         }
//         return section;
//       });

//       return updatedDevices;
//     });
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = prevDevices.map((section, sIndex) => {
//         if (sIndex === sectionIndex) {
//           return {
//             ...section,
//             devices: section.devices.map((device, dIndex) => {
//               if (dIndex === deviceIndex) {
//                 const roundedValue = Math.round(newValue);
//                 sendBulbUpdate(section.section, device.id, roundedValue);
//                 return { ...device, value: roundedValue };
//               }
//               return device;
//             }),
//           };
//         }
//         return section;
//       });

//       return updatedDevices;
//     });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {devices.map((section, sectionIndex) => (
//         <View key={sectionIndex} style={styles.section}>
//           <Text style={styles.sectionTitle}>{section.section}</Text>
//           {section.temperature !== undefined && (
//             <Text style={styles.infoText}>🌡️ {section.temperature}°C 💧 {section.humidity}%</Text>
//           )}
//           <View style={styles.deviceGrid}>
//             {section.devices.map((device, deviceIndex) => (
//               <View key={deviceIndex} style={styles.deviceCard}>
//                 <Text style={styles.deviceName}>{device.name}</Text>

//                 {/* Bulb Icon Toggle */}
//                 <TouchableOpacity onPress={() => handleToggle(sectionIndex, deviceIndex)}>
//                   <MaterialCommunityIcons
//                     name="lightbulb"
//                     size={50}
//                     color={device.isOn ? "gold" : "#b0b0b0"}
//                     style={styles.bulbIcon}
//                   />
//                 </TouchableOpacity>

//                 {/* Intensity Slider */}
//                 <Slider
//                   style={styles.slider}
//                   minimumValue={0}
//                   maximumValue={100}
//                   step={1}
//                   minimumTrackTintColor={device.isOn ? "gold" : "gray"}
//                   thumbTintColor="blue"
//                   value={device.value}
//                   onSlidingComplete={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
//                 />
//               </View>
//             ))}
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#f0f4f8', // Soft light gray background
//     padding: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: "#333", // Darker text for contrast
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 10,
//   },
//   deviceGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   deviceCard: {
//     width: '48%',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   deviceName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   bulbIcon: {
//     marginBottom: 10,
//   },
//   slider: {
//     width: '90%',
//     height: 40,
//   },
// });

// export default SmartHomeDashboard;


import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Import Bulb Icon
import axiosClient from "../../../utils/axiosClient";

const SmartHomeDashboard = () => {
  const [devices, setDevices] = useState([
    {
      section: "LivingRoom",
      temperature: 22.8,
      humidity: 57,
      devices: [
        { name: "Bulb 1", id: "bulb101", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 2", id: "bulb102", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", id: "bulb103", type: "lamp", value: 50, isOn: false },
        { name: "Bulb 4", id: "bulb104", type: "lamp", value: 50, isOn: true },
      ],
    },
    {
      section: "Kitchen",
      devices: [
        { name: "Bulb 1", id: "bulb201", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 2", id: "bulb202", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", id: "bulb203", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 4", id: "bulb204", type: "lamp", value: 50, isOn: true },
      ],
    },
  ]);

  const sendBulbUpdate = async (roomName, bulbId, newIntensity) => {
    const safeIntensity = Math.round(Math.max(0, Math.min(100, newIntensity)));

    const message = JSON.stringify({
      Bulb_Id: bulbId,
      Intensity: safeIntensity.toString(),
    });

    const payload = {
      roomName,
      message: message,
    };

    try {
      await axiosClient.post("/api/topics/publish", payload);
    } catch (error) {
      Alert.alert("Error", `Failed to update ${bulbId}`);
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
  };

  return (
    <ScrollView className="bg-[#000] p-5">
      {devices.map((section, sectionIndex) => (
        <View key={sectionIndex} className="mb-8">
          <Text className="text-2xl font-bold text-white mb-2">
            {section.section}
          </Text>
          {section.temperature !== undefined && (
            <Text className="text-white mb-4">
              🌡️ {section.temperature}°C 💧 {section.humidity}%
            </Text>
          )}
          <View className="flex-row flex-wrap justify-between">
            {section.devices.map((device, deviceIndex) => (
              <View
                key={deviceIndex}
                className="w-[48%] bg-[#2D2D2D] p-5 rounded-lg shadow-lg items-center mb-5"
              >
                <Text className="text-white font-bold">{device.name}</Text>

                {/* Bulb Icon Toggle */}
                <TouchableOpacity
                  onPress={() => handleToggle(sectionIndex, deviceIndex)}
                >
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={50}
                    color={device.isOn ? "#FFD700" : "#555"}
                    className="mb-3"
                  />
                </TouchableOpacity>

                {/* Intensity Slider */}
                <Slider
                  style={{ width: "90%", height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  minimumTrackTintColor={device.isOn ? "#FFD700" : "gray"}
                  thumbTintColor="#FFD700"
                  value={device.value}
                  onSlidingComplete={(newValue) =>
                    handleSliderChange(sectionIndex, deviceIndex, newValue)
                  }
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SmartHomeDashboard;
