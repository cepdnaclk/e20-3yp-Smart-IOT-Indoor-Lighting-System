





// RuleManager.jsx

// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
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
// import axiosClient from '../../../utils/axiosClient'; // use axiosClient here

// export default function RuleManager({
//   shapes = [],
//   bulbsList = ["b1", "b2", "b3", "b4"],
//   mode: initialMode,
//   username: initialUser
// }) {
//   // Prefer props.mode/props.username; otherwise fall back to route params
//   const { roomId, mode: routeMode, username: routeUser } = useLocalSearchParams();
//   const roomName = roomId || "Bathroom";
//   const modeName = initialMode || routeMode || "Night Mode";
//   const username = initialUser || routeUser || "Tharindu";

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

//   // Whenever the selected “itemName” (shape name) changes, update `shape` type
//   useEffect(() => {
//     const matched = shapes.find((s) => s.name === itemName);
//     if (matched) {
//       setShape(matched.type === 'point' ? 'circle' : matched.type);
//     }
//   }, [itemName]);

//   // On mount (or when modeName/roomName/username change), fetch existing rules for that mode
//   useEffect(() => {
//     const fetchConfigForMode = async () => {
//       try {
//         const response = await axiosClient.get(
//           `/api/rooms/configure?username=${username}&roomName=${roomName}`
//         );
//         const data = response.data;
//         if (Array.isArray(data.Automation_Modes)) {
//           // Find the mode that matches modeName exactly
//           const matchedMode = data.Automation_Modes.find(
//             (m) => m.Mode_Name === modeName
//           );
//           if (matchedMode && Array.isArray(matchedMode.Rules)) {
//             setRules(matchedMode.Rules);
//           } else {
//             setRules([]); // no rules if not found
//           }
//         } else {
//           setRules([]);
//         }
//       } catch (error) {
//         console.error('❌ Failed to load room config:', error);
//       }
//     };

//     fetchConfigForMode();
//   }, [roomName, username, modeName]);

//   // Add a new rule locally
//   const addRule = () => {
//     if (!itemName || !shape) {
//       return Alert.alert("Error", "Select an area first");
//     }
//     const area = shapes.find((s) => s.name === itemName);
//     if (!area) {
//       return Alert.alert("Error", "Invalid area selected");
//     }

//     const onBulbs = [];
//     const offBulbs = [];
//     bulbs.forEach((b, i) => {
//       const bulbId = bulbsList[i];
//       if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
//       else offBulbs.push({ bulb: bulbId, intensity: 0 });
//     });

//     const rule = {
//       Rule_Name: `${itemName}_${Date.now()}`, // unique
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
//       Start_Time: startTime.toTimeString().slice(0, 5), // "HH:MM"
//       End_Time: endTime.toTimeString().slice(0, 5),
//       Priority: priority >= 4 ? "High" : priority === 3 ? "Medium" : "Low",
//     };

//     setRules((prev) => [...prev, rule]);

//     // Reset form fields
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

//   // Send the updated set of rules for this mode back to backend
//   const sendToBackend = async () => {
//     // Build bulb metadata array
//     const bulbMetadata = bulbsList.map((bulbId) => ({
//       bulbId,
//       username,
//       name: `Bulb${bulbId.replace('b', '')}`, // e.g. "b1" → "Bulb1"
//     }));

//     // To avoid duplicate areas, we re-extract unique Areas from the rules
//     const uniqueAreas = [
//       ...new Map(
//         rules.map((r) => [JSON.stringify(r.Area), r.Area])
//       ).values(),
//     ];

//     const payload = {
//       username,
//       roomName,
//       bulbs: bulbMetadata,
//       Areas: uniqueAreas,
//       Automation_Modes: [
//         {
//           Mode_Name: modeName,
//           Rules: rules,
//         },
//       ],
//     };

//     console.log("Sending Payload to Backend:", JSON.stringify(payload, null, 2));

//     try {
//       // ← Use axiosClient (with proper baseURL) instead of plain axios
//       await axiosClient.post("/api/rooms/configure", payload);
//       Alert.alert("Success", "Rules submitted successfully");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to submit rules");
//     }
//   };

//   const toggleBulb = (index) => {
//     setBulbs((prev) => {
//       const updated = [...prev];
//       updated[index].on = !updated[index].on;
//       return updated;
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Button to open “Create Rule” modal */}
//       <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
//         <Text style={styles.addButtonText}>+ Create Rule</Text>
//       </TouchableOpacity>

//       {/* Display existing rules for the selected mode */}
//       <Text style={styles.heading}>Existing Rules</Text>
//       <ScrollView style={{ maxHeight: 200 }}>
//         {rules.map((r, idx) => (
//           <View key={idx} style={styles.ruleItem}>
//             <Text style={styles.ruleText}>{r.Rule_Name}</Text>
//             <TouchableOpacity onPress={() => setRules((prev) => prev.filter((_, i) => i !== idx))}>
//               <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Button to send all rules back to backend */}
//       <TouchableOpacity
//         onPress={sendToBackend}
//         style={[styles.addButton, { backgroundColor: '#0a0' }]}
//       >
//         <Text style={styles.addButtonText}>Finish Calibrate</Text>
//       </TouchableOpacity>

//       {/* Modal: “Create Rule” Form */}
//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <Text style={styles.heading}>Create Rule</Text>

//             {/* Select an existing area (shape) by name */}
//             <RNPickerSelect
//               onValueChange={setItemName}
//               value={itemName}
//               placeholder={{ label: 'Select Area', value: '' }}
//               items={shapes.map((s) => ({ label: s.name, value: s.name }))}
//               style={pickerStyle}
//             />
//             {shape && (
//               <Text style={[styles.label, { color: 'white' }]}>
//                 Detected Shape: {shape}
//               </Text>
//             )}

//             {/* Start Time */}
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
//                 onChange={(_, date) => {
//                   setShowStartPicker(false);
//                   if (date) setStartTime(date);
//                 }}
//               />
//             )}

//             {/* End Time */}
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
//                 onChange={(_, date) => {
//                   setShowEndPicker(false);
//                   if (date) setEndTime(date);
//                 }}
//               />
//             )}

//             {/* Select which bulbs should be ON/OFF */}
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

//             {/* For each “on” bulb, show a slider to pick intensity */}
//             {bulbs.map((bulb, idx) =>
//               bulb.on ? (
//                 <View key={idx}>
//                   <Text style={styles.label}>
//                     Bulb {idx + 1} Intensity: {Math.round(bulb.value)}%
//                   </Text>
//                   <Slider
//                     minimumValue={0}
//                     maximumValue={100}
//                     step={1}
//                     value={bulb.value}
//                     onValueChange={(val) => {
//                       const updated = [...bulbs];
//                       updated[idx].value = val;
//                       setBulbs(updated);
//                     }}
//                     minimumTrackTintColor="#FFD700"
//                     maximumTrackTintColor="#444"
//                   />
//                 </View>
//               ) : null
//             )}

//             {/* Priority slider */}
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

//             {/* Buttons: Save Rule / Cancel */}
//             <TouchableOpacity onPress={addRule} style={styles.addButton}>
//               <Text style={styles.addButtonText}>+ Save Rule</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setShowModal(false)}
//               style={[styles.addButton, { backgroundColor: '#777' }]}
//             >
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
import axiosClient from '../../../utils/axiosClient'; // use axiosClient here

export default function RuleManager({
  shapes = [],
  bulbsList = ["b1", "b2", "b3", "b4"],
  mode: initialMode,
  username: initialUser
}) {
  // Prefer props.mode/props.username; otherwise fall back to route params
  const { roomId, mode: routeMode, username: routeUser } = useLocalSearchParams();
  const roomName = roomId || "Bathroom";
  // const modeName = initialMode || routeMode || "Night Mode";
  const modeName = initialMode || routeMode || "Normal Mode";
  const username = initialUser || routeUser || "Tharindu";

  // 1) define a constant default-area
  const DEFAULT_AREA = { name: 'none', type: 'none', equation: '', x: 0, y: 0 };

  // 2) build an “effective” list of areas, with default first
  const effectiveShapes = [DEFAULT_AREA, ...shapes];

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

  // Whenever the selected "itemName" (area name) changes, update `shape` type
  useEffect(() => {
    const matched = effectiveShapes.find((s) => s.name === itemName);
    if (matched) {
      // for default, type stays 'default'
      setShape(matched.type);
    }
  }, [itemName]);

  // On mount (or when modeName/roomName/username change), fetch existing rules for that mode
  useEffect(() => {
    const fetchConfigForMode = async () => {
      try {
        const response = await axiosClient.get(
          `/api/rooms/configure?username=${username}&roomName=${roomName}`
        );
        const data = response.data;
        if (Array.isArray(data.Automation_Modes)) {
          const matchedMode = data.Automation_Modes.find(
            (m) => m.Mode_Name === modeName
          );
          if (matchedMode && Array.isArray(matchedMode.Rules)) {
            setRules(matchedMode.Rules);
          } else {
            setRules([]);
          }
        } else {
          setRules([]);
        }
      } catch (error) {
        console.error('❌ Failed to load room config:', error);
      }
    };

    fetchConfigForMode();
  }, [roomName, username, modeName]);

  // Add a new rule locally
  const addRule = () => {
    if (!itemName || !shape) {
      return Alert.alert('Error', 'Select an area first');
    }
    const areaObj = effectiveShapes.find((s) => s.name === itemName);
    if (!areaObj) {
      return Alert.alert('Error', 'Invalid area selected');
    }

    const onBulbs = [];
    const offBulbs = [];
    bulbs.forEach((b, i) => {
      const bulbId = bulbsList[i];
      if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
      else offBulbs.push({ bulb: bulbId, intensity: 0 });
    });

    const rule = {
      Rule_Name: `${itemName}_${Date.now()}`, // unique
      Area: {
        type: areaObj.type,
        name: areaObj.name,
        equation: areaObj.equation,
        x: areaObj.x,
        y: areaObj.y,
      },
      Selected_Bulbs: {
        ON: onBulbs,
        OFF: offBulbs,
      },
      Start_Time: startTime.toTimeString().slice(0, 5),
      End_Time: endTime.toTimeString().slice(0, 5),
      Priority: priority >= 4 ? 'High' : priority === 3 ? 'Medium' : 'Low',
    };

    setRules((prev) => [...prev, rule]);

    // Reset form fields
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

  // Send the updated set of rules for this mode back to backend
  const sendToBackend = async () => {
    const bulbMetadata = bulbsList.map((bulbId) => ({
      bulbId,
      username,
      name: `Bulb${bulbId.replace('b', '')}`,
    }));

    const uniqueAreas = [
      ...new Map(
        rules.map((r) => [JSON.stringify(r.Area), r.Area])
      ).values(),
    ];

    const payload = {
      username,
      roomName,
      bulbs: bulbMetadata,
      Areas: uniqueAreas,
      Automation_Modes: [
        {
          Mode_Name: modeName,
          Rules: rules,
        },
      ],
    };

    console.log('Sending Payload to Backend:', JSON.stringify(payload, null, 2));

    try {
      await axiosClient.post('/api/rooms/configure', payload);
      Alert.alert('Success', 'Rules submitted successfully');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit rules');
    }
  };

  const toggleBulb = (index) => {
    setBulbs((prev) => {
      const updated = [...prev];
      updated[index].on = !updated[index].on;
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      {/* Button to open “Create Rule” modal */}
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Create Rule</Text>
      </TouchableOpacity>

      {/* Display existing rules for the selected mode */}
      <Text style={styles.heading}>Existing Rules</Text>
      <ScrollView >
        {rules.map((r, idx) => (
          <View key={idx} style={styles.ruleItem}>
            <Text style={styles.ruleText}>{r.Rule_Name}</Text>
            <TouchableOpacity onPress={() => setRules((prev) => prev.filter((_, i) => i !== idx))}>
              <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Button to send all rules back to backend */}
      <TouchableOpacity
        onPress={sendToBackend}
        style={[styles.addButton, { backgroundColor: '#0a0' }]}>
        <Text style={styles.addButtonText}>Finish Calibrate</Text>
      </TouchableOpacity>

      {/* Modal: “Create Rule” Form */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.heading}>Create Rule</Text>

            {/* Area picker including default */}
            <RNPickerSelect
              onValueChange={setItemName}
              value={itemName}
              placeholder={{ label: 'Select Area', value: '' }}
              items={effectiveShapes.map((s) => ({
                label: s.name === 'none' ? 'Default (outside door)' : s.name,
                value: s.name,
              }))}
              style={pickerStyle}
            />
            {shape && (
              <Text style={[styles.label, { color: 'white' }]}>Detected Shape: {shape}</Text>
            )}

            {/* Start Time */}
            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
              <Text style={{ color: '#FFD700' }}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) setStartTime(date);
                }}
              />
            )}

            {/* End Time */}
            <Text style={styles.label}>End Time:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
              <Text style={{ color: '#FFD700' }}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) setEndTime(date);
                }}
              />
            )}

            {/* Bulb selection */}
            <Text style={styles.label}>Select Bulbs:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
              {bulbs.map((bulb, idx) => (
                <TouchableOpacity key={idx} onPress={() => toggleBulb(idx)}>
                  <Ionicons name="bulb" size={40} color={bulb.on ? '#FFD700' : '#444'} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Sliders for on-bulbs */}
            {bulbs.map((bulb, idx) =>
              bulb.on ? (
                <View key={idx}>
                  <Text style={styles.label}>Bulb {idx + 1} Intensity: {Math.round(bulb.value)}%</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={bulb.value}
                    onValueChange={(val) => {
                      const updated = [...bulbs];
                      updated[idx].value = val;
                      setBulbs(updated);
                    }}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="#444"
                  />
                </View>
              ) : null
            )}

            {/* Priority */}
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

            {/* Actions */}
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
  container: { width: '100%', backgroundColor: '#000', padding: 20, borderTopWidth: 1, borderTopColor: '#FFD700' },
  heading: { fontSize: 18, color: '#FFD700', fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#222', borderColor: '#FFD700', borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10, color: '#FFF' },
  label: { color: '#FFD700', marginVertical: 5 },
  addButton: { backgroundColor: '#FFD700', padding: 12, borderRadius: 8, marginVertical: 10, alignItems: 'center' },
  addButtonText: { color: '#000', fontWeight: 'bold' },
  ruleItem: { backgroundColor: '#111', padding: 10, borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ruleText: { color: '#FFD700', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' },
  modalContent: { padding: 20 },
});

const pickerStyle = {
  inputIOS: { backgroundColor: '#222', color: '#FFD700', padding: 12, borderRadius: 6, borderColor: '#FFD700', borderWidth: 1, marginBottom: 10 },
  placeholder: { color: '#999' },
};
