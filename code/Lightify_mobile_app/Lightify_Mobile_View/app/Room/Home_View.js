// import React, { useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
// import { Slider } from '@react-native-community/slider';
// // import { Icon } from 'react-native-elements';

// const SmartHomeDashboard = () => {
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Floor Lamp", type: "lamp", value: 70, controlType: "slider" },
//         { name: "Bar Lamp", type: "lamp", value: true, controlType: "switch" },
//         { name: "Blinds", type: "blind", value: 100, controlType: "info" },
//         { name: "Nest Mini", type: "speaker", value: "Playing", controlType: "info" },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Shutter", type: "blind", value: 100, controlType: "info" },
//         { name: "Spotlights", type: "lamp", value: 34, controlType: "slider" },
//         { name: "Worktop", type: "lamp", value: 33, controlType: "slider" },
//         { name: "Fridge", type: "fridge", value: "Closed", controlType: "info" },
//         { name: "Nest Audio", type: "speaker", value: "On", controlType: "switch" },
//       ],
//     },
//     {
//       section: "Outdoor",
//       temperature: 10.2,
//       illuminance: 555,
//       devices: [
//         { name: "Door Light", type: "lamp", value: 100, controlType: "slider" },
//         { name: "Flood Light", type: "lamp", value: false, controlType: "switch" },
//         { name: "Motion", type: "sensor", value: "Clear", controlType: "info" },
//       ],
//     },
//   ]);

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     const updatedDevices = [...devices];
//     updatedDevices[sectionIndex].devices[deviceIndex].value = !updatedDevices[sectionIndex].devices[deviceIndex].value;
//     setDevices(updatedDevices);
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     const updatedDevices = [...devices];
//     updatedDevices[sectionIndex].devices[deviceIndex].value = newValue;
//     setDevices(updatedDevices);
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
                
//                 {device.controlType === "slider" ? (
//                   <Slider
//                     style={styles.slider}
//                     minimumValue={0}
//                     maximumValue={100}
//                     value={device.value}
//                     onValueChange={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
//                   />
//                 ) : device.controlType === "switch" ? (
//                   <Switch
//                     value={device.value}
//                     onValueChange={() => handleToggle(sectionIndex, deviceIndex)}
//                   />
//                 ) : (
//                   <Text style={styles.infoText}>{device.value}</Text>
//                 )}
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
// import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
// import Slider from '@react-native-community/slider';

// const SmartHomeDashboard = () => {
//   const [devices, setDevices] = useState([
//     {
//       section: "Living Room",
//       temperature: 22.8,
//       humidity: 57,
//       devices: [
//         { name: "Floor Lamp", type: "lamp", value: 70, controlType: "slider" },
//         { name: "Bar Lamp", type: "lamp", value: true, controlType: "switch" },
//       ],
//     },
//     {
//       section: "Kitchen",
//       devices: [
//         { name: "Shutter", type: "blind", value: 100, controlType: "info" },
//         { name: "Spotlights", type: "lamp", value: 34, controlType: "slider" },
//       ],
//     },
//     {
//       section: "Outdoor",
//       temperature: 10.2,
//       illuminance: 555,
//       devices: [
//         { name: "Door Light", type: "lamp", value: 100, controlType: "slider" },
//         { name: "Flood Light", type: "lamp", value: false, controlType: "switch" },
//       ],
//     },
//   ]);

//   const handleToggle = (sectionIndex, deviceIndex) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = [...prevDevices];
//       updatedDevices[sectionIndex].devices[deviceIndex].value = !updatedDevices[sectionIndex].devices[deviceIndex].value;
//       return updatedDevices;
//     });
//   };

//   const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
//     setDevices((prevDevices) => {
//       const updatedDevices = [...prevDevices];
//       updatedDevices[sectionIndex].devices[deviceIndex].value = newValue;
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
//             {section.devices?.map((device, deviceIndex) => (
//               device ? (
//                 <View key={deviceIndex} style={styles.deviceCard}>
//                   <Text style={styles.deviceName}>{device.name}</Text>
//                   {device.controlType === "slider" ? (
//                     <Slider
//                       style={styles.slider}
//                       minimumValue={0}
//                       maximumValue={100}
//                       value={device.value}
//                       onValueChange={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
//                     />
//                   ) : device.controlType === "switch" ? (
//                     <Switch
//                       value={device.value}
//                       onValueChange={() => handleToggle(sectionIndex, deviceIndex)}
//                     />
//                   ) : (
//                     <Text style={styles.infoText}>{device.value}</Text>
//                   )}
//                 </View>
//               ) : null
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



import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import Slider from '@react-native-community/slider';

const SmartHomeDashboard = () => {
  const [devices, setDevices] = useState([
    {
      section: "Living Room",
      temperature: 22.8,
      humidity: 57,
      devices: [
        { name: "Bulb 1", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 2", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 4", type: "lamp", value: 50, isOn: true },
      ],
    },
    {
      section: "Kitchen",
      devices: [
        { name: "Bulb 1", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 2", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 4", type: "lamp", value: 50, isOn: true },
      ],
    },
    {
      section: "Outdoor",
      temperature: 10.2,
      illuminance: 555,
      devices: [
        { name: "Bulb 1", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 2", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 3", type: "lamp", value: 50, isOn: true },
        { name: "Bulb 4", type: "lamp", value: 50, isOn: true },
      ],
    },
  ]);

  const handleToggle = (sectionIndex, deviceIndex) => {
    setDevices((prevDevices) => {
      const updatedDevices = [...prevDevices];
      updatedDevices[sectionIndex].devices[deviceIndex].isOn = !updatedDevices[sectionIndex].devices[deviceIndex].isOn;
      return [...updatedDevices];
    });
  };

  const handleSliderChange = (sectionIndex, deviceIndex, newValue) => {
    setDevices((prevDevices) => {
      const updatedDevices = [...prevDevices];
      updatedDevices[sectionIndex].devices[deviceIndex].value = newValue;
      return [...updatedDevices];
    });
  };

  return (
    <ScrollView style={styles.container}>
      {devices.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.temperature !== undefined && (
            <Text style={styles.infoText}>🌡️ {section.temperature}°C 💧 {section.humidity}%</Text>
          )}
          <View style={styles.deviceGrid}>
            {section.devices.map((device, deviceIndex) => (
              <View key={deviceIndex} style={styles.deviceCard}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={device.value}
                  onValueChange={(newValue) => handleSliderChange(sectionIndex, deviceIndex, newValue)}
                />
                <Switch
                  value={device.isOn}
                  onValueChange={() => handleToggle(sectionIndex, deviceIndex)}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default SmartHomeDashboard;