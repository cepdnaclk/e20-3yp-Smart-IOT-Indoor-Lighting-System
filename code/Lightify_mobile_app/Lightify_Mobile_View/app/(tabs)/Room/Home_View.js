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
// import axiosClient from "../../../utils/axiosClient";

// const SmartHomeDashboard = () => {
//   const router = useRouter();

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
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#000]">
//       <ScrollView className="p-5 mb-16">
//         {devices.map((section, sectionIndex) => (
//           <View key={sectionIndex} className="mb-8">
//             <Text className="text-2xl font-bold text-white mb-2">
//               {section.section}
//             </Text>
//             {section.temperature !== undefined && (
//               <Text className="text-white mb-4">
//                 🌡️ {section.temperature}°C 💧 {section.humidity}%
//               </Text>
//             )}
//             <View className="flex-row flex-wrap justify-between">
//               {section.devices.map((device, deviceIndex) => (
//                 <View
//                   key={deviceIndex}
//                   className="w-[48%] bg-[#2D2D2D] p-5 rounded-lg shadow-lg items-center mb-5"
//                 >
//                   <Text className="text-white font-bold">{device.name}</Text>

//                   {/* Bulb Icon Toggle */}
//                   <TouchableOpacity
//                     onPress={() => handleToggle(sectionIndex, deviceIndex)}
//                   >
//                     <MaterialCommunityIcons
//                       name="lightbulb"
//                       size={50}
//                       color={device.isOn ? "#FFD700" : "#555"}
//                       className="mb-3"
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

//       {/* ✅ Add Room Button at Bottom */}
//       <View className="absolute bottom-5 left-5 right-5">
//         <TouchableOpacity
//           className="bg-[#FFD700] p-4 rounded-lg items-center shadow-lg"
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Text className="text-black font-bold text-lg">+ Add Room</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SmartHomeDashboard;

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosClient from "../../../utils/axiosClient";

const SmartHomeDashboard = () => {
  const router = useRouter();

  const [devices, setDevices] = useState([
    {
      section: "Living Room",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView style={{ padding: 20, marginBottom: 80 }}>
        {devices.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20 }}>
            {/* Room Title + Add Schedule Button in the Same Row */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{section.section}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFD700",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                }}
                onPress={() => router.push("/Room/AddSchedule")}
              >
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>+ Add Schedule</Text>
              </TouchableOpacity>
            </View>

            {/* Display temperature & humidity if available */}
            {section.temperature !== undefined && (
              <Text style={{ color: "white", marginBottom: 15 }}>
                🌡️ {section.temperature}°C 💧 {section.humidity}%
              </Text>
            )}

            {/* Bulb Grid */}
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

                  {/* Bulb Icon Toggle */}
                  <TouchableOpacity onPress={() => handleToggle(sectionIndex, deviceIndex)}>
                    <MaterialCommunityIcons
                      name="lightbulb"
                      size={50}
                      color={device.isOn ? "#FFD700" : "#555"}
                      style={{ marginBottom: 10 }}
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
                    onSlidingComplete={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Room Button at Bottom */}
      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFD700",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            shadowColor: "#FFD700",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
          }}
          onPress={() => router.push("/Room/AddRoom")}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>+ Add Room</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SmartHomeDashboard;

