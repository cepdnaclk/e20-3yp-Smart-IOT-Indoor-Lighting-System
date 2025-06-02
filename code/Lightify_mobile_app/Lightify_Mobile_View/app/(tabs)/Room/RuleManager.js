// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
// import { useEffect, useState } from 'react';
// import {
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';

// export default function RuleManager({ shapes = [] }) {
//   const [rules, setRules] = useState([]);
//   const [itemName, setItemName] = useState('');
//   const [shape, setShape] = useState(null);
//   const [startTime, setStartTime] = useState(new Date());
//   const [endTime, setEndTime] = useState(new Date());
//   const [priority, setPriority] = useState(1);
//   const [bulbs, setBulbs] = useState([
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//   ]);
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     if (!itemName || !Array.isArray(shapes)) return;
//     const matched = shapes.find(s => s.name === itemName);
//     if (matched) {
//       setShape(matched.type === 'point' ? 'circle' : matched.type);
//     }
//   }, [itemName, shapes]);

//   const addRule = () => {
//     if (!itemName || !shape) return;

//     const newRule = {
//       item_name: itemName,
//       shape,
//       start_time: startTime.toTimeString().slice(0, 5),
//       end_time: endTime.toTimeString().slice(0, 5),
//       priority,
//     };

//     bulbs.forEach((b, i) => {
//       newRule[`bulb${i + 1}_brightness`] = b.on ? Math.round(b.value) : 0;
//     });

//     setRules(prev => [...prev, newRule]);

//     // Reset form
//     setItemName('');
//     setShape(null);
//     setStartTime(new Date());
//     setEndTime(new Date());
//     setPriority(1);
//     setBulbs([
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//     ]);
//     setShowModal(false);
//   };

//   const toggleBulb = index => {
//     setBulbs(prev => {
//       const updated = [...prev];
//       updated[index].on = !updated[index].on;
//       return updated;
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
//         <Text style={styles.addButtonText}>+ Create Rule</Text>
//       </TouchableOpacity>

//       <Text style={styles.heading}>Existing Rules</Text>
//       <ScrollView style={{ maxHeight: 200 }}>
//         {rules.map((r, idx) => (
//           <View key={idx} style={styles.ruleItem}>
//             <Text style={styles.ruleText}>{r.item_name} ({r.shape})</Text>
//             <TouchableOpacity onPress={() => setRules(prev => prev.filter((_, i) => i !== idx))}>
//               <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <Text style={styles.heading}>Create Rule</Text>

//             <RNPickerSelect
//               onValueChange={setItemName}
//               value={itemName}
//               placeholder={{ label: 'Select Area', value: '' }}
//               items={shapes.map(s => ({ label: s.name, value: s.name }))}
//               style={pickerStyle}
//             />

//             {shape && (
//               <Text style={[styles.label, { color: 'white' }]}>
//                 Detected Shape: {shape}
//               </Text>
//             )}

//             <Text style={styles.label}>Start Time:</Text>
//             <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
//               <Text style={{ color: '#FFD700' }}>
//                 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//             </TouchableOpacity>
//             {showStartPicker && (
//               <DateTimePicker
//                 value={startTime}
//                 mode="time"
//                 display="default"
//                 onChange={(event, date) => {
//                   setShowStartPicker(false);
//                   if (date) setStartTime(date);
//                 }}
//               />
//             )}

//             <Text style={styles.label}>End Time:</Text>
//             <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
//               <Text style={{ color: '#FFD700' }}>
//                 {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//             </TouchableOpacity>
//             {showEndPicker && (
//               <DateTimePicker
//                 value={endTime}
//                 mode="time"
//                 display="default"
//                 onChange={(event, date) => {
//                   setShowEndPicker(false);
//                   if (date) setEndTime(date);
//                 }}
//               />
//             )}

//             <Text style={styles.label}>Select Bulbs:</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
//               {bulbs.map((bulb, idx) => (
//                 <TouchableOpacity key={idx} onPress={() => toggleBulb(idx)}>
//                   <Ionicons
//                     name="bulb"
//                     size={40}
//                     color={bulb.on ? '#FFD700' : '#444'}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {bulbs.map((bulb, idx) => (
//               bulb.on && (
//                 <View key={idx}>
//                   <Text style={styles.label}>Bulb {idx + 1} Intensity: {Math.round(bulb.value)}%</Text>
//                   <Slider
//                     minimumValue={0}
//                     maximumValue={100}
//                     step={1}
//                     value={bulb.value}
//                     onValueChange={val => {
//                       const updated = [...bulbs];
//                       updated[idx].value = val;
//                       setBulbs(updated);
//                     }}
//                     minimumTrackTintColor="#FFD700"
//                     maximumTrackTintColor="#444"
//                   />
//                 </View>
//               )
//             ))}

//             <Text style={styles.label}>Priority: {priority}</Text>
//             <Slider
//               minimumValue={1}
//               maximumValue={5}
//               step={1}
//               value={priority}
//               onValueChange={setPriority}
//               minimumTrackTintColor="#FFD700"
//               maximumTrackTintColor="#444"
//             />

//             <TouchableOpacity onPress={addRule} style={styles.addButton}>
//               <Text style={styles.addButtonText}>+ Save Rule</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.addButton, { backgroundColor: '#777' }]}>
//               <Text style={styles.addButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     backgroundColor: '#000',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#FFD700',
//   },
//   heading: {
//     fontSize: 18,
//     color: '#FFD700',
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     backgroundColor: '#222',
//     borderColor: '#FFD700',
//     borderWidth: 1,
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 10,
//     color: '#FFF',
//   },
//   label: {
//     color: '#FFD700',
//     marginVertical: 5,
//   },
//   addButton: {
//     backgroundColor: '#FFD700',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   ruleItem: {
//     backgroundColor: '#111',
//     padding: 10,
//     borderRadius: 6,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   ruleText: {
//     color: '#FFD700',
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.9)',
//   },
//   modalContent: {
//     padding: 20,
//   },
// });

// const pickerStyle = {
//   inputIOS: {
//     backgroundColor: '#222',
//     color: '#FFD700',
//     padding: 12,
//     borderRadius: 6,
//     borderColor: '#FFD700',
//     borderWidth: 1,
//     marginBottom: 10,
//   },
//   placeholder: {
//     color: '#999',
//   },
// };





// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
// import axios from 'axios';
// import { useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';

// export default function RuleManager({ shapes = [], bulbsList = ["b1", "b2", "b3", "b4"] }) {
//   const { roomId, mode } = useLocalSearchParams();
//   const roomName = roomId || "Default_Room";
//   const modeName = mode || "Normal_Mode";
//   const [rules, setRules] = useState([]);
//   const [itemName, setItemName] = useState('');
//   const [shape, setShape] = useState(null);
//   const [startTime, setStartTime] = useState(new Date());
//   const [endTime, setEndTime] = useState(new Date());
//   const [priority, setPriority] = useState(1);
//   const [bulbs, setBulbs] = useState([
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//     { on: false, value: 0 },
//   ]);
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const matched = shapes.find(s => s.name === itemName);
//     if (matched) {
//       setShape(matched.type === 'point' ? 'circle' : matched.type);
//     }
//   }, [itemName]);

//   const addRule = () => {
//     if (!itemName || !shape) return;

//     const area = shapes.find(s => s.name === itemName);
//     const onBulbs = [];
//     const offBulbs = [];

//     bulbs.forEach((b, i) => {
//       const bulbId = bulbsList[i];
//       if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
//       else offBulbs.push({ bulb: bulbId, intensity: 0 });
//     });

//     const rule = {
//       Rule_Name: `${itemName}_${Date.now()}`,
//       Area: {
//         type: area.type,
//         name: area.name,
//         equation: area.equation,
//         x: area.x,
//         y: area.y,
//       },
//       Selected_Bulbs: {
//         ON: onBulbs,
//         OFF: offBulbs,
//       },
//       Start_Time: startTime.toTimeString().slice(0, 5),
//       End_Time: endTime.toTimeString().slice(0, 5),
//       Priority: priority >= 4 ? "High" : priority === 3 ? "Medium" : "Low",
//     };

//     setRules(prev => [...prev, rule]);

//     // Reset form
//     setItemName('');
//     setShape(null);
//     setStartTime(new Date());
//     setEndTime(new Date());
//     setPriority(1);
//     setBulbs([
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//       { on: false, value: 0 },
//     ]);
//     setShowModal(false);
//   };

//   const sendToBackend = async () => {
//     const payload = {
//       Room_Name: roomName,
//       bulbs: bulbsList,
//       Areas: [...new Set(rules.map(r => JSON.stringify(r.Area)))].map(s => JSON.parse(s)),
//       Automation_Modes: [
//         {
//           Mode_Name: modeName,
//           Rules: rules,
//         }
//       ]
//     };


//     console.log("Sending Payload to Backend:", JSON.stringify(payload, null, 2)); // ✅ Log to terminal

//     try {
//       await axios.post("/api/rooms/configure", payload);
//       Alert.alert("Success", "Rules submitted successfully");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to submit rules");
//     }
//   };

//   const toggleBulb = index => {
//     setBulbs(prev => {
//       const updated = [...prev];
//       updated[index].on = !updated[index].on;
//       return updated;
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
//         <Text style={styles.addButtonText}>+ Create Rule</Text>
//       </TouchableOpacity>

//       <Text style={styles.heading}>Existing Rules</Text>
//       <ScrollView style={{ maxHeight: 200 }}>
//         {rules.map((r, idx) => (
//           <View key={idx} style={styles.ruleItem}>
//             <Text style={styles.ruleText}>{r.Rule_Name}</Text>
//             <TouchableOpacity onPress={() => setRules(prev => prev.filter((_, i) => i !== idx))}>
//               <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       <TouchableOpacity onPress={sendToBackend} style={[styles.addButton, { backgroundColor: '#0a0' }]}>
//         <Text style={styles.addButtonText}>Finish Calibrate</Text>
//       </TouchableOpacity>

//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <Text style={styles.heading}>Create Rule</Text>

//             <RNPickerSelect
//               onValueChange={setItemName}
//               value={itemName}
//               placeholder={{ label: 'Select Area', value: '' }}
//               items={shapes.map(s => ({ label: s.name, value: s.name }))}
//               style={pickerStyle}
//             />

//             {shape && (
//               <Text style={[styles.label, { color: 'white' }]}>
//                 Detected Shape: {shape}
//               </Text>
//             )}

//             <Text style={styles.label}>Start Time:</Text>
//             <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
//               <Text style={{ color: '#FFD700' }}>
//                 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//             </TouchableOpacity>
//             {showStartPicker && (
//               <DateTimePicker
//                 value={startTime}
//                 mode="time"
//                 display="default"
//                 onChange={(event, date) => {
//                   setShowStartPicker(false);
//                   if (date) setStartTime(date);
//                 }}
//               />
//             )}

//             <Text style={styles.label}>End Time:</Text>
//             <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
//               <Text style={{ color: '#FFD700' }}>
//                 {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//             </TouchableOpacity>
//             {showEndPicker && (
//               <DateTimePicker
//                 value={endTime}
//                 mode="time"
//                 display="default"
//                 onChange={(event, date) => {
//                   setShowEndPicker(false);
//                   if (date) setEndTime(date);
//                 }}
//               />
//             )}

//             <Text style={styles.label}>Select Bulbs:</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
//               {bulbs.map((bulb, idx) => (
//                 <TouchableOpacity key={idx} onPress={() => toggleBulb(idx)}>
//                   <Ionicons
//                     name="bulb"
//                     size={40}
//                     color={bulb.on ? '#FFD700' : '#444'}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {bulbs.map((bulb, idx) => (
//               bulb.on && (
//                 <View key={idx}>
//                   <Text style={styles.label}>Bulb {idx + 1} Intensity: {Math.round(bulb.value)}%</Text>
//                   <Slider
//                     minimumValue={0}
//                     maximumValue={100}
//                     step={1}
//                     value={bulb.value}
//                     onValueChange={val => {
//                       const updated = [...bulbs];
//                       updated[idx].value = val;
//                       setBulbs(updated);
//                     }}
//                     minimumTrackTintColor="#FFD700"
//                     maximumTrackTintColor="#444"
//                   />
//                 </View>
//               )
//             ))}

//             <Text style={styles.label}>Priority: {priority}</Text>
//             <Slider
//               minimumValue={1}
//               maximumValue={5}
//               step={1}
//               value={priority}
//               onValueChange={setPriority}
//               minimumTrackTintColor="#FFD700"
//               maximumTrackTintColor="#444"
//             />

//             <TouchableOpacity onPress={addRule} style={styles.addButton}>
//               <Text style={styles.addButtonText}>+ Save Rule</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.addButton, { backgroundColor: '#777' }]}>
//               <Text style={styles.addButtonText}>Cancel</Text>
//             </TouchableOpacity>


//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     backgroundColor: '#000',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#FFD700',
//   },
//   heading: {
//     fontSize: 18,
//     color: '#FFD700',
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     backgroundColor: '#222',
//     borderColor: '#FFD700',
//     borderWidth: 1,
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 10,
//     color: '#FFF',
//   },
//   label: {
//     color: '#FFD700',
//     marginVertical: 5,
//   },
//   addButton: {
//     backgroundColor: '#FFD700',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   ruleItem: {
//     backgroundColor: '#111',
//     padding: 10,
//     borderRadius: 6,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   ruleText: {
//     color: '#FFD700',
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.9)',
//   },
//   modalContent: {
//     padding: 20,
//   },
// });

// const pickerStyle = {
//   inputIOS: {
//     backgroundColor: '#222',
//     color: '#FFD700',
//     padding: 12,
//     borderRadius: 6,
//     borderColor: '#FFD700',
//     borderWidth: 1,
//     marginBottom: 10,
//   },
//   placeholder: {
//     color: '#999',
//   },
// };




import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function RuleManager({ shapes = [], bulbsList = ["b1", "b2", "b3", "b4"] }) {
  const { roomId, mode, username: queryUsername } = useLocalSearchParams();
  const roomName = roomId || "Bathroom";
  const modeName = mode || "Night Mode";
  const username = queryUsername || "Tharindu";
  const [rules, setRules] = useState([]);
  const [itemName, setItemName] = useState('');
  const [shape, setShape] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [priority, setPriority] = useState(1);
  const [bulbs, setBulbs] = useState([
    { on: false, value: 0 },
    { on: false, value: 0 },
    { on: false, value: 0 },
    { on: false, value: 0 },
  ]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    const matched = shapes.find(s => s.name === itemName);
    if (matched) {
      setShape(matched.type === 'point' ? 'circle' : matched.type);
    }
  }, [itemName]);

  useEffect(() => {
  const fetchConfig = async () => {
    try {
      const response = await axios.get(`/api/rooms/configure?username=${username}&roomName=${roomName}`);
      if (response.data) {
        const { bulbs, Areas, Automation_Modes } = response.data;

        // Optional: preload bulbs array with default values
        setBulbs(bulbs.map(() => ({ on: false, value: 0 })));

        // ✅ Add this to load existing rules
        if (Automation_Modes?.length > 0 && Automation_Modes[0].Rules) {
          setRules(Automation_Modes[0].Rules);
        }
      }
    } catch (error) {
      console.error('Failed to load room config:', error);
    }
  };

  fetchConfig();
}, []);


  const addRule = () => {
    if (!itemName || !shape) return;

    const area = shapes.find(s => s.name === itemName);
    const onBulbs = [];
    const offBulbs = [];

    bulbs.forEach((b, i) => {
      const bulbId = bulbsList[i];
      if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
      else offBulbs.push({ bulb: bulbId, intensity: 0 });
    });

    const rule = {
      Rule_Name: `${itemName}_${Date.now()}`,
      Area: {
        type: area.type,
        name: area.name,
        equation: area.equation,
        x: area.x,
        y: area.y,
      },
      Selected_Bulbs: {
        ON: onBulbs,
        OFF: offBulbs,
      },
      Start_Time: startTime.toTimeString().slice(0, 5),
      End_Time: endTime.toTimeString().slice(0, 5),
      Priority: priority >= 4 ? "High" : priority === 3 ? "Medium" : "Low",
    };

    setRules(prev => [...prev, rule]);

    // Reset form
    setItemName('');
    setShape(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setPriority(1);
    setBulbs([
      { on: false, value: 0 },
      { on: false, value: 0 },
      { on: false, value: 0 },
      { on: false, value: 0 },
    ]);
    setShowModal(false);
  };

  const sendToBackend = async () => {
  const bulbMetadata = bulbsList.map(bulbId => ({
    bulbId,
    username,
    name: `Bulb${bulbId.replace('b', '')}`, // Example logic: "b1" → "Bulb1"
  }));

  const payload = {
    username,
    roomName,
    bulbs: bulbMetadata,
    Areas: [...new Set(rules.map(r => JSON.stringify(r.Area)))].map(s => JSON.parse(s)),
    Automation_Modes: [
      {
        Mode_Name: modeName,
        Rules: rules,
      },
    ],
  };

  console.log("Sending Payload to Backend:", JSON.stringify(payload, null, 2));

  try {
    await axios.post("/api/rooms/configure", payload);
    Alert.alert("Success", "Rules submitted successfully");
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to submit rules");
  }
};


  const toggleBulb = index => {
    setBulbs(prev => {
      const updated = [...prev];
      updated[index].on = !updated[index].on;
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Create Rule</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Existing Rules</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {rules.map((r, idx) => (
          <View key={idx} style={styles.ruleItem}>
            <Text style={styles.ruleText}>{r.Rule_Name}</Text>
            <TouchableOpacity onPress={() => setRules(prev => prev.filter((_, i) => i !== idx))}>
              <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={sendToBackend} style={[styles.addButton, { backgroundColor: '#0a0' }]}>
        <Text style={styles.addButtonText}>Finish Calibrate</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.heading}>Create Rule</Text>

            <RNPickerSelect
              onValueChange={setItemName}
              value={itemName}
              placeholder={{ label: 'Select Area', value: '' }}
              items={shapes.map(s => ({ label: s.name, value: s.name }))}
              style={pickerStyle}
            />

            {shape && (
              <Text style={[styles.label, { color: 'white' }]}>
                Detected Shape: {shape}
              </Text>
            )}

            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
              <Text style={{ color: '#FFD700' }}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setStartTime(date);
                }}
              />
            )}

            <Text style={styles.label}>End Time:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
              <Text style={{ color: '#FFD700' }}>
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndTime(date);
                }}
              />
            )}

            <Text style={styles.label}>Select Bulbs:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
              {bulbs.map((bulb, idx) => (
                <TouchableOpacity key={idx} onPress={() => toggleBulb(idx)}>
                  <Ionicons
                    name="bulb"
                    size={40}
                    color={bulb.on ? '#FFD700' : '#444'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {bulbs.map((bulb, idx) => (
              bulb.on && (
                <View key={idx}>
                  <Text style={styles.label}>Bulb {idx + 1} Intensity: {Math.round(bulb.value)}%</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={bulb.value}
                    onValueChange={val => {
                      const updated = [...bulbs];
                      updated[idx].value = val;
                      setBulbs(updated);
                    }}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="#444"
                  />
                </View>
              )
            ))}

            <Text style={styles.label}>Priority: {priority}</Text>
            <Slider
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={priority}
              onValueChange={setPriority}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#444"
            />

            <TouchableOpacity onPress={addRule} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Save Rule</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.addButton, { backgroundColor: '#777' }]}>
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  heading: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#222',
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: '#FFF',
  },
  label: {
    color: '#FFD700',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  ruleItem: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ruleText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalContent: {
    padding: 20,
  },
});

const pickerStyle = {
  inputIOS: {
    backgroundColor: '#222',
    color: '#FFD700',
    padding: 12,
    borderRadius: 6,
    borderColor: '#FFD700',
    borderWidth: 1,
    marginBottom: 10,
  },
  placeholder: {
    color: '#999',
  },
};



