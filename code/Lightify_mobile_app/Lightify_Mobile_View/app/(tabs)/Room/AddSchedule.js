


// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert, 
//   TextInput, 
//   ScrollView 
// } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import Slider from '@react-native-community/slider';
// import axiosClient from "../../../utils/axiosClient";

// const SchedulePage = () => {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('12:00:00');
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('blue');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 101', value: 'bulb101' },
//     { label: 'Bulb 102', value: 'bulb102' },
//     { label: 'Bulb 103', value: 'bulb103' }
//   ];

//   const handleBulbSelection = (value) => {
//     setBulbIds((prevBulbs) =>
//       prevBulbs.includes(value) ? prevBulbs.filter((id) => id !== value) : [...prevBulbs, value]
//     );
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       date,
//       time,
//       intensityPercentage: intensity,
//       color,
//       recurrence,
//       bulbId: bulbIds
//     };

//     try {
//       const response = await axiosClient.put('/api/rooms/Kitchen/schedules', payload);
//       Alert.alert('Success', 'Schedule saved successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save schedule');
//     }
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.label}>Enter Date (YYYY-MM-DD)</Text>
//         <TextInput
//           style={styles.input}
//           value={date}
//           onChangeText={setDate}
//           placeholder="YYYY-MM-DD"
//           placeholderTextColor="#AAA"
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Select Time</Text>
//         <RNPickerSelect
//           onValueChange={(selectedTime) => setTime(selectedTime)}
//           items={[
//             { label: '12:00:00', value: '12:00:00' },
//             { label: '14:30:00', value: '14:30:00' }
//           ]}
//           style={pickerSelectStyles}
//         />

//         <Text style={styles.label}>Intensity: {intensity}%</Text>
//         <Slider
//           value={intensity}
//           onValueChange={setIntensity}
//           minimumValue={0}
//           maximumValue={100}
//           step={1}
//           minimumTrackTintColor="#FFD700"
//           thumbTintColor="#FFD700"
//         />

//         <Text style={styles.label}>Select Color</Text>
//         <View style={styles.colorContainer}>
//           {['blue', 'red', 'green'].map((c) => (
//             <TouchableOpacity 
//               key={c} 
//               style={[
//                 styles.colorBox, 
//                 { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: color === c ? "#FFD700" : "transparent" }
//               ]} 
//               onPress={() => setColor(c)}
//             />
//           ))}
//         </View>

//         <Text style={styles.label}>Select Bulbs</Text>
//         {bulbOptions.map((bulb) => (
//           <TouchableOpacity 
//             key={bulb.value} 
//             style={[styles.bulbOption, bulbIds.includes(bulb.value) && styles.selectedBulb]}
//             onPress={() => handleBulbSelection(bulb.value)}
//           >
//             <Text style={[styles.bulbText, { color: bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF" }]}>{bulb.label}</Text>
//           </TouchableOpacity>
//         ))}

//         <Text style={styles.label}>Recurrence</Text>
//         <RNPickerSelect
//           onValueChange={(value) => setRecurrence(value === 'yes')}
//           items={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
//           style={pickerSelectStyles}
//         />

//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Schedule</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: { flex: 1, backgroundColor: '#000000' },
//   container: { padding: 20 },
//   label: { fontSize: 16, color: "#FFD700", marginVertical: 10, fontWeight: "bold" },
//   input: { 
//     borderWidth: 1, 
//     borderColor: "#FFD700", 
//     padding: 10, 
//     borderRadius: 8, 
//     marginVertical: 5, 
//     color: "#FFFFFF",
//     backgroundColor: "#222222"
//   },
//   colorContainer: { flexDirection: 'row', marginVertical: 10 },
//   colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
//   bulbOption: { 
//     padding: 10, 
//     backgroundColor: "#222222", 
//     marginVertical: 5, 
//     borderRadius: 5, 
//     borderWidth: 1,
//     borderColor: "#FFD700"
//   },
//   selectedBulb: { backgroundColor: "#FFD700" },
//   bulbText: { fontSize: 14, textAlign: "center" },
//   button: { 
//     backgroundColor: "#FFD700", 
//     paddingVertical: 15, 
//     borderRadius: 10, 
//     alignItems: "center", 
//     marginTop: 20,
//     shadowColor: "#FFD700",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//   },
//   buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
// });

// // Styles for Picker Select
// const pickerSelectStyles = {
//   inputIOS: {
//     color: "#FFD700",
//     backgroundColor: "#222222",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   inputAndroid: {
//     color: "#FFD700",
//     backgroundColor: "#222222",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
// };

// export default SchedulePage;


// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert, 
//   TextInput, 
//   ScrollView 
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
// import axiosClient from "../../../utils/axiosClient";

// const SchedulePage = () => {
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [time, setTime] = useState(new Date());
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('blue');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 1', value: '1' },
//     { label: 'Bulb 2', value: '2' },
//     { label: 'Bulb 3', value: '3' }
//   ];

//   const handleBulbSelection = (value) => {
//     setBulbIds((prevBulbs) =>
//       prevBulbs.includes(value) ? prevBulbs.filter((id) => id !== value) : [...prevBulbs, value]
//     );
//   };

//   const handleSubmit = async () => {
//     const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
//     const formattedTime = time.toTimeString().split(' ')[0]; // Format to HH:mm:ss
//     const payload = {
//       date: formattedDate,
//       time: formattedTime,
//       intensityPercentage: Math.round(intensity), // Ensure intensity is a whole number
//       color,
//       recurrence,
//       bulbId: bulbIds
//     };

//     try {
//       const response = await axiosClient.put('/api/rooms/kitchen/schedules', payload);
//       Alert.alert('Success', 'Schedule saved successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save schedule');
//     }
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
        
//         {/* Date Picker */}
//         <Text style={styles.label}>Select Date</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{date.toISOString().split('T')[0]}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowDatePicker(false);
//               if (selectedDate) setDate(selectedDate);
//             }}
//           />
//         )}

//         {/* Time Picker */}
//         <Text style={styles.label}>Select Time</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{time.toTimeString().split(' ')[0]}</Text>
//         </TouchableOpacity>
//         {showTimePicker && (
//           <DateTimePicker
//             value={time}
//             mode="time"
//             is24Hour={true}
//             display="default"
//             onChange={(event, selectedTime) => {
//               setShowTimePicker(false);
//               if (selectedTime) setTime(selectedTime);
//             }}
//           />
//         )}

//         {/* Intensity Slider */}
//         <Text style={styles.label}>Intensity: {Math.round(intensity)}%</Text>
//         <Slider
//           value={intensity}
//           onValueChange={(value) => setIntensity(Math.round(value))}
//           minimumValue={0}
//           maximumValue={100}
//           step={1}
//           minimumTrackTintColor="#FFD700"
//           thumbTintColor="#FFD700"
//         />

//         {/* Color Selection */}
//         <Text style={styles.label}>Select Color</Text>
//         <View style={styles.colorContainer}>
//           {['blue', 'red', 'green'].map((c) => (
//             <TouchableOpacity 
//               key={c} 
//               style={[
//                 styles.colorBox, 
//                 { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: color === c ? "#FFD700" : "transparent" }
//               ]} 
//               onPress={() => setColor(c)}
//             />
//           ))}
//         </View>

//         {/* Bulb Selection */}
//         <Text style={styles.label}>Select Bulbs</Text>
//         {bulbOptions.map((bulb) => (
//           <TouchableOpacity 
//             key={bulb.value} 
//             style={[styles.bulbOption, bulbIds.includes(bulb.value) && styles.selectedBulb]}
//             onPress={() => handleBulbSelection(bulb.value)}
//           >
//             <Text style={[styles.bulbText, { color: bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF" }]}>{bulb.label}</Text>
//           </TouchableOpacity>
//         ))}

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Schedule</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: { flex: 1, backgroundColor: '#000000' },
//   container: { padding: 20 },
//   label: { fontSize: 16, color: "#FFD700", marginVertical: 10, fontWeight: "bold" },
//   input: { 
//     borderWidth: 1, 
//     borderColor: "#FFD700", 
//     padding: 10, 
//     borderRadius: 8, 
//     marginVertical: 5, 
//     color: "#FFFFFF",
//     backgroundColor: "#222222"
//   },
//   colorContainer: { flexDirection: 'row', marginVertical: 10 },
//   colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
//   bulbOption: { 
//     padding: 10, 
//     backgroundColor: "#222222", 
//     marginVertical: 5, 
//     borderRadius: 5, 
//     borderWidth: 1,
//     borderColor: "#FFD700"
//   },
//   selectedBulb: { backgroundColor: "#FFD700" },
//   bulbText: { fontSize: 14, textAlign: "center" },
//   button: { 
//     backgroundColor: "#FFD700", 
//     paddingVertical: 15, 
//     borderRadius: 10, 
//     alignItems: "center", 
//     marginTop: 20,
//     shadowColor: "#FFD700",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//   },
//   buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
// });

// export default SchedulePage;


// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert, 
//   ScrollView, 
//   Platform, 
//   Modal 
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
// import axiosClient from "../../../utils/axiosClient";

// const SchedulePage = () => {
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [time, setTime] = useState(new Date());
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('blue');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 1', value: '1' },
//     { label: 'Bulb 2', value: '2' },
//     { label: 'Bulb 3', value: '3' }
//   ];

//   const handleBulbSelection = (value) => {
//     setBulbIds((prevBulbs) =>
//       prevBulbs.includes(value) ? prevBulbs.filter((id) => id !== value) : [...prevBulbs, value]
//     );
//   };

//   const handleDateChange = (event, selectedDate) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//     setShowDatePicker(false);
//   };

//   const handleTimeChange = (event, selectedTime) => {
//     if (selectedTime) {
//       setTime(selectedTime);
//     }
//     setShowTimePicker(false);
//   };

//   const handleSubmit = async () => {
//     const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
//     const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:mm

//     const payload = {
//       date: formattedDate,
//       time: formattedTime,
//       intensityPercentage: Math.round(intensity),
//       color,
//       recurrence,
//       bulbIds, // Correct key
//     };

//     try {
//       const response = await axiosClient.put('/api/rooms/kitchen/schedules', payload);
//       Alert.alert('Success', 'Schedule saved successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save schedule');
//     }
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
        
//         {/* Date Picker */}
//         <Text style={styles.label}>Select Date</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{date.toLocaleDateString()}</Text>
//         </TouchableOpacity>

//         {/* iOS shows DatePicker directly, Android needs a modal */}
//         {showDatePicker && (
//           Platform.OS === 'ios' ? (
//             <DateTimePicker
//               value={date}
//               mode="date"
//               display="spinner"
//               onChange={handleDateChange}
//             />
//           ) : (
//             <Modal transparent={true} animationType="slide">
//               <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                   <DateTimePicker
//                     value={date}
//                     mode="date"
//                     display="calendar"
//                     onChange={handleDateChange}
//                   />
//                   <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalButton}>
//                     <Text style={styles.modalButtonText}>Done</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )
//         )}

//         {/* Time Picker */}
//         <Text style={styles.label}>Select Time</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
//         </TouchableOpacity>

//         {showTimePicker && (
//           Platform.OS === 'ios' ? (
//             <DateTimePicker
//               value={time}
//               mode="time"
//               display="spinner"
//               is24Hour={true}
//               onChange={handleTimeChange}
//             />
//           ) : (
//             <Modal transparent={true} animationType="slide">
//               <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                   <DateTimePicker
//                     value={time}
//                     mode="time"
//                     is24Hour={true}
//                     display="clock"
//                     onChange={handleTimeChange}
//                   />
//                   <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.modalButton}>
//                     <Text style={styles.modalButtonText}>Done</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )
//         )}

//         {/* Intensity Slider */}
//         <Text style={styles.label}>Intensity: {Math.round(intensity)}%</Text>
//         <Slider
//           value={intensity}
//           onValueChange={(value) => setIntensity(Math.round(value))}
//           minimumValue={0}
//           maximumValue={100}
//           step={1}
//           minimumTrackTintColor="#FFD700"
//           thumbTintColor="#FFD700"
//         />

//         {/* Color Selection */}
//         <Text style={styles.label}>Select Color</Text>
//         <View style={styles.colorContainer}>
//           {['blue', 'red', 'green'].map((c) => (
//             <TouchableOpacity 
//               key={c} 
//               style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]} 
//               onPress={() => setColor(c)}
//             />
//           ))}
//         </View>

//         {/* Bulb Selection */}
//         <Text style={styles.label}>Select Bulbs</Text>
//         {bulbOptions.map((bulb) => (
//           <TouchableOpacity 
//             key={bulb.value} 
//             style={[styles.bulbOption, bulbIds.includes(bulb.value) && styles.selectedBulb]}
//             onPress={() => handleBulbSelection(bulb.value)}
//           >
//             <Text style={{ color: bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF" }}>{bulb.label}</Text>
//           </TouchableOpacity>
//         ))}

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Schedule</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: { flex: 1, backgroundColor: '#000000' },
//   container: { padding: 20 },
//   label: { fontSize: 16, color: "#FFD700", marginVertical: 10, fontWeight: "bold" },
//   input: { borderWidth: 1, borderColor: "#FFD700", padding: 10, borderRadius: 8, marginVertical: 5, backgroundColor: "#222222" },
//   colorContainer: { flexDirection: 'row', marginVertical: 10 },
//   colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
//   bulbOption: { padding: 10, backgroundColor: "#222222", marginVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: "#FFD700" },
//   selectedBulb: { backgroundColor: "#FFD700" },
//   button: { backgroundColor: "#FFD700", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
//   buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
//   modalBackground: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
//   modalContainer: { backgroundColor: "#222", padding: 20, borderRadius: 10 },
//   modalButton: { marginTop: 10, alignSelf: "center" },
//   modalButtonText: { color: "#FFD700", fontSize: 16 }
// });

// export default SchedulePage;



import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Platform, 
  Modal 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import axiosClient from "../../../utils/axiosClient";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SchedulePage = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [intensity, setIntensity] = useState(50);
  const [color, setColor] = useState('blue');
  const [recurrence, setRecurrence] = useState(false);
  const [bulbIds, setBulbIds] = useState([]);

  const bulbOptions = [
    { label: 'Bulb 1', value: '1' },
    { label: 'Bulb 2', value: '2' },
    { label: 'Bulb 3', value: '3' }
  ];

  const handleBulbSelection = (value) => {
    setBulbIds((prevBulbs) => {
      const updatedBulbs = prevBulbs.includes(value) 
        ? prevBulbs.filter((id) => id !== value) 
        : [...prevBulbs, value];
      
      console.log("Selected Bulb IDs:", updatedBulbs); // Debugging output
      return updatedBulbs;
    });
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    if (bulbIds.length === 0) {
      Alert.alert("Error", "Please select at least one bulb.");
      return;
    }

    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const payload = {
      date: formattedDate,
      time: formattedTime,
      intensityPercentage: Math.round(intensity),
      color,
      recurrence,
      bulbId: bulbIds.length === 1 ? bulbIds[0] : bulbIds // Send single ID if only one, otherwise array
    };

    console.log("Payload Sent:", payload); // Debugging output

    try {
      const response = await axiosClient.put('/api/rooms/kitchen/schedules', payload);
      Alert.alert('Success', 'Schedule saved successfully!');
    } catch (error) {
      console.error("Schedule API Error:", error);
      Alert.alert('Error', 'Failed to save schedule');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Date Picker */}
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: "#FFD700" }}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          Platform.OS === 'ios' ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          ) : (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )
        )}

        {/* Time Picker */}
        <Text style={styles.label}>Select Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={{ color: "#FFD700" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          Platform.OS === 'ios' ? (
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              is24Hour={true}
              onChange={handleTimeChange}
            />
          ) : (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="clock"
                    onChange={handleTimeChange}
                  />
                  <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )
        )}

        {/* Intensity Slider */}
        <Text style={styles.label}>Intensity: {Math.round(intensity)}%</Text>
        <Slider
          value={intensity}
          onValueChange={(value) => setIntensity(Math.round(value))}
          minimumValue={0}
          maximumValue={100}
          step={1}
          minimumTrackTintColor="#FFD700"
          thumbTintColor="#FFD700"
        />

        {/* Color Selection */}
        <Text style={styles.label}>Select Color</Text>
        <View style={styles.colorContainer}>
          {['blue', 'red', 'green'].map((c) => (
            <TouchableOpacity 
              key={c} 
              style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]} 
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Bulb Selection with Icons */}
        <Text style={styles.label}>Select Bulbs</Text>
        <View style={styles.bulbContainer}>
          {bulbOptions.map((bulb) => (
            <TouchableOpacity 
              key={bulb.value} 
              style={[styles.bulbOption, bulbIds.includes(bulb.value) && styles.selectedBulb]}
              onPress={() => handleBulbSelection(bulb.value)}
            >
              <Icon 
                name={bulbIds.includes(bulb.value) ? "lightbulb-on" : "lightbulb-outline"} 
                size={30} 
                color={bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF"} 
              />
              <Text style={{ color: bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF" }}>{bulb.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#000000' },
  container: { padding: 20 },
  label: { fontSize: 16, color: "#FFD700", marginVertical: 10, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#FFD700", padding: 10, borderRadius: 8, marginVertical: 5, backgroundColor: "#222222" },
  colorContainer: { flexDirection: 'row', marginVertical: 10 },
  colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
  bulbContainer: { flexDirection: 'row', justifyContent: "space-around", marginVertical: 10 },
  button: { backgroundColor: "#FFD700", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" }
});

export default SchedulePage;






// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Alert, 
//   ScrollView, 
//   Platform, 
//   Modal 
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Slider from '@react-native-community/slider';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import bulb icon
// import axiosClient from "../../../utils/axiosClient";

// const SchedulePage = () => {
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [time, setTime] = useState(new Date());
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('blue');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 1', value: '1' },
//     { label: 'Bulb 2', value: '2' },
//     { label: 'Bulb 3', value: '3' }
//   ];

//   const handleBulbSelection = (value) => {
//     setBulbIds((prevBulbs) => {
//       const updatedBulbs = prevBulbs.includes(value) 
//         ? prevBulbs.filter((id) => id !== value) 
//         : [...prevBulbs, value];
      
//       console.log("Selected Bulb IDs:", updatedBulbs); // Debugging output
//       return updatedBulbs;
//     });
//   };

//   const handleDateChange = (event, selectedDate) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//     setShowDatePicker(false);
//   };

//   const handleTimeChange = (event, selectedTime) => {
//     if (selectedTime) {
//       setTime(selectedTime);
//     }
//     setShowTimePicker(false);
//   };

//   const handleSubmit = async () => {
//     if (bulbIds.length === 0) {
//       Alert.alert("Error", "Please select at least one bulb.");
//       return;
//     }

//     const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
//     const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

//     const payload = {
//       date: formattedDate,
//       time: formattedTime,
//       intensityPercentage: Math.round(intensity),
//       color,
//       recurrence,
//       bulbId: bulbIds.length === 1 ? bulbIds[0] : bulbIds // Send single ID if only one, otherwise array
//     };

//     console.log("Payload Sent:", payload); // Debugging output

//     try {
//       const response = await axiosClient.put('/api/rooms/kitchen/schedules', payload);
//       Alert.alert('Success', 'Schedule saved successfully!');
//     } catch (error) {
//       console.error("Schedule API Error:", error);
//       Alert.alert('Error', 'Failed to save schedule');
//     }
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
        
//         {/* Date Picker */}
//         <Text style={styles.label}>Select Date</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{date.toLocaleDateString()}</Text>
//         </TouchableOpacity>

//         {showDatePicker && (
//           Platform.OS === 'ios' ? (
//             <DateTimePicker
//               value={date}
//               mode="date"
//               display="spinner"
//               onChange={handleDateChange}
//             />
//           ) : (
//             <Modal transparent={true} animationType="slide">
//               <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                   <DateTimePicker
//                     value={date}
//                     mode="date"
//                     display="calendar"
//                     onChange={handleDateChange}
//                   />
//                   <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalButton}>
//                     <Text style={styles.modalButtonText}>Done</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )
//         )}

//         {/* Time Picker */}
//         <Text style={styles.label}>Select Time</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
//           <Text style={{ color: "#FFD700" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
//         </TouchableOpacity>

//         {showTimePicker && (
//           Platform.OS === 'ios' ? (
//             <DateTimePicker
//               value={time}
//               mode="time"
//               display="spinner"
//               is24Hour={true}
//               onChange={handleTimeChange}
//             />
//           ) : (
//             <Modal transparent={true} animationType="slide">
//               <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                   <DateTimePicker
//                     value={time}
//                     mode="time"
//                     is24Hour={true}
//                     display="clock"
//                     onChange={handleTimeChange}
//                   />
//                   <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.modalButton}>
//                     <Text style={styles.modalButtonText}>Done</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )
//         )}

//         {/* Intensity Slider */}
//         <Text style={styles.label}>Intensity: {Math.round(intensity)}%</Text>
//         <Slider
//           value={intensity}
//           onValueChange={(value) => setIntensity(Math.round(value))}
//           minimumValue={0}
//           maximumValue={100}
//           step={1}
//           minimumTrackTintColor="#FFD700"
//           thumbTintColor="#FFD700"
//         />

//         {/* Color Selection */}
//         <Text style={styles.label}>Select Color</Text>
//         <View style={styles.colorContainer}>
//           {['blue', 'red', 'green'].map((c) => (
//             <TouchableOpacity 
//               key={c} 
//               style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]} 
//               onPress={() => setColor(c)}
//             />
//           ))}
//         </View>

//         {/* Bulb Selection with Icons */}
//         <Text style={styles.label}>Select Bulbs</Text>
//         <View style={styles.bulbContainer}>
//           {bulbOptions.map((bulb) => (
//             <TouchableOpacity 
//               key={bulb.value} 
//               style={[styles.bulbOption, bulbIds.includes(bulb.value) && styles.selectedBulb]}
//               onPress={() => handleBulbSelection(bulb.value)}
//             >
//               <Icon 
//                 name={bulbIds.includes(bulb.value) ? "lightbulb-on" : "lightbulb-outline"} 
//                 size={30} 
//                 color={bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF"} 
//               />
//               <Text style={{ color: bulbIds.includes(bulb.value) ? "#FFD700" : "#FFFFFF" }}>{bulb.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Schedule</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: { flex: 1, backgroundColor: '#000000' },
//   container: { padding: 20 },
//   label: { fontSize: 16, color: "#FFD700", marginVertical: 10, fontWeight: "bold" },
//   bulbContainer: { flexDirection: 'row', justifyContent: "space-around", marginVertical: 10 },
//   bulbOption: { alignItems: "center", padding: 10 },
//   selectedBulb: { backgroundColor: "rgba(255, 215, 0, 0.2)", borderRadius: 10 },
//   button: { backgroundColor: "#FFD700", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
//   buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" }
// });

// export default SchedulePage;

