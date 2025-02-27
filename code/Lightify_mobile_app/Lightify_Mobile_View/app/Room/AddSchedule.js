// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import Slider from '@react-native-community/slider';
// import axiosClient from "../../utils/axiosClient"; 

// const SchedulePage = () => {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('12:00');
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('#FF5733');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 101', value: '101' },
//     { label: 'Bulb 102', value: '102' },
//     { label: 'Bulb 103', value: '103' }
//   ];

//   const handleSubmit = async () => {
//     const payload = {
//       schedule: [{
//         date,
//         time,
//         intensityPercentage: intensity,
//         color,
//         recurrence,
//         bulbId: bulbIds
//       }]
//     };

//     try {
//       const response = await axiosClient.post('/api/rooms/Kitchen', payload);
//       Alert.alert('Success', 'Schedule saved successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save schedule');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Enter Date (YYYY-MM-DD)</Text>
//       <TextInput
//         style={styles.input}
//         value={date}
//         onChangeText={setDate}
//         placeholder="YYYY-MM-DD"
//         placeholderTextColor="white"
//         keyboardType="numeric"
//       />

//       <Text style={styles.label}>Select Time</Text>
//       <RNPickerSelect
//         onValueChange={(selectedTime) => setTime(selectedTime)}
//         items={[{ label: '12:00', value: '12:00' }, { label: '14:30', value: '14:30' }]}
//       />

//       <Text style={styles.label}>Intensity: {intensity}%</Text>
//       <Slider
//         value={intensity}
//         onValueChange={setIntensity}
//         minimumValue={0}
//         maximumValue={100}
//         step={1}
//       />

//       <Text style={styles.label}>Select Color</Text>
//       <View style={styles.colorContainer}>
//         {['#FF0000', '#00FF00', '#0000FF'].map((c) => (
//           <TouchableOpacity key={c} style={[styles.colorBox, { backgroundColor: c }]} onPress={() => setColor(c)} />
//         ))}
//       </View>

//       <Text style={styles.label}>Select Bulbs</Text>
//       <RNPickerSelect
//         onValueChange={(value) => setBulbIds([value])}
//         items={bulbOptions}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Schedule</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: 'lightblue' },
//   label: { fontSize: 16, marginVertical: 10 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 5, color: 'white' },
//   colorContainer: { flexDirection: 'row', marginVertical: 10 },
//   colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
//   button: { backgroundColor: 'blue', padding: 15, alignItems: 'center', marginTop: 20 },
//   buttonText: { color: 'white', fontSize: 16 },
// });

// export default SchedulePage;


// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import Slider from '@react-native-community/slider';
// import axiosClient from "../../utils/axiosClient";

// const SchedulePage = () => {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('12:00');
//   const [intensity, setIntensity] = useState(50);
//   const [color, setColor] = useState('#FF5733');
//   const [recurrence, setRecurrence] = useState(false);
//   const [bulbIds, setBulbIds] = useState([]);

//   const bulbOptions = [
//     { label: 'Bulb 101', value: '101' },
//     { label: 'Bulb 102', value: '102' },
//     { label: 'Bulb 103', value: '103' }
//   ];

//   const handleBulbSelection = (value) => {
//     setBulbIds((prevBulbs) =>
//       prevBulbs.includes(value) ? prevBulbs.filter((id) => id !== value) : [...prevBulbs, value]
//     );
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       schedule: [{
//         date,
//         time,
//         intensityPercentage: intensity,
//         color,
//         recurrence,
//         bulbId: bulbIds
//       }]
//     };

//     try {
//       const response = await axiosClient.post('/api/rooms/Kitchen', payload);
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
//           placeholderTextColor="white"
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Select Time</Text>
//         <RNPickerSelect
//           onValueChange={(selectedTime) => setTime(selectedTime)}
//           items={[{ label: '12:00', value: '12:00' }, { label: '14:30', value: '14:30' }]}
//         />

//         <Text style={styles.label}>Intensity: {intensity}%</Text>
//         <Slider
//           value={intensity}
//           onValueChange={setIntensity}
//           minimumValue={0}
//           maximumValue={100}
//           step={1}
//         />

//         <Text style={styles.label}>Select Color</Text>
//         <View style={styles.colorContainer}>
//           {['#FF0000', '#00FF00', '#0000FF'].map((c) => (
//             <TouchableOpacity key={c} style={[styles.colorBox, { backgroundColor: c }]} onPress={() => setColor(c)} />
//           ))}
//         </View>

//         <Text style={styles.label}>Select Bulbs</Text>
//         {bulbOptions.map((bulb) => (
//           <TouchableOpacity key={bulb.value} style={styles.bulbOption} onPress={() => handleBulbSelection(bulb.value)}>
//             <Text style={{ color: bulbIds.includes(bulb.value) ? 'green' : 'black' }}>{bulb.label}</Text>
//           </TouchableOpacity>
//         ))}

//         <Text style={styles.label}>Recurrence</Text>
//         <RNPickerSelect
//           onValueChange={(value) => setRecurrence(value === 'yes')}
//           items={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
//         />

//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Schedule</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: { flex: 1, backgroundColor: 'lightblue' },
//   container: { padding: 20 },
//   label: { fontSize: 16, marginVertical: 10 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 5, color: 'white' },
//   colorContainer: { flexDirection: 'row', marginVertical: 10 },
//   colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
//   bulbOption: { padding: 10, backgroundColor: '#ddd', marginVertical: 5, borderRadius: 5 },
//   button: { backgroundColor: 'blue', padding: 15, alignItems: 'center', marginTop: 20 },
//   buttonText: { color: 'white', fontSize: 16 },
// });

// export default SchedulePage;



import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import axiosClient from "../../utils/axiosClient";

const SchedulePage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [intensity, setIntensity] = useState(50);
  const [color, setColor] = useState('#FF5733');
  const [recurrence, setRecurrence] = useState(false);
  const [bulbIds, setBulbIds] = useState([]);

  const bulbOptions = [
    { label: 'Bulb 101', value: '101' },
    { label: 'Bulb 102', value: '102' },
    { label: 'Bulb 103', value: '103' }
  ];

  const handleBulbSelection = (value) => {
    setBulbIds((prevBulbs) =>
      prevBulbs.includes(value) ? prevBulbs.filter((id) => id !== value) : [...prevBulbs, value]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      schedule: [{
        date,
        time,
        intensityPercentage: intensity,
        color,
        recurrence,
        bulbId: bulbIds
      }]
    };

    try {
      const response = await axiosClient.put('/api/rooms/Kitchen', payload);
      Alert.alert('Success', 'Schedule saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save schedule');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Enter Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="white"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Select Time</Text>
        <RNPickerSelect
          onValueChange={(selectedTime) => setTime(selectedTime)}
          items={[{ label: '12:00', value: '12:00' }, { label: '14:30', value: '14:30' }]}
        />

        <Text style={styles.label}>Intensity: {intensity}%</Text>
        <Slider
          value={intensity}
          onValueChange={setIntensity}
          minimumValue={0}
          maximumValue={100}
          step={1}
        />

        <Text style={styles.label}>Select Color</Text>
        <View style={styles.colorContainer}>
          {['#FF0000', '#00FF00', '#0000FF'].map((c) => (
            <TouchableOpacity 
              key={c} 
              style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: color === c ? 'black' : 'transparent' }]} 
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Text style={styles.label}>Select Bulbs</Text>
        {bulbOptions.map((bulb) => (
          <TouchableOpacity key={bulb.value} style={styles.bulbOption} onPress={() => handleBulbSelection(bulb.value)}>
            <Text style={{ color: bulbIds.includes(bulb.value) ? 'green' : 'black' }}>{bulb.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Recurrence</Text>
        <RNPickerSelect
          onValueChange={(value) => setRecurrence(value === 'yes')}
          items={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: 'lightblue' },
  container: { padding: 20 },
  label: { fontSize: 16, marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 5, color: 'white' },
  colorContainer: { flexDirection: 'row', marginVertical: 10 },
  colorBox: { width: 40, height: 40, margin: 5, borderRadius: 5 },
  bulbOption: { padding: 10, backgroundColor: '#ddd', marginVertical: 5, borderRadius: 5 },
  button: { backgroundColor: 'blue', padding: 15, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16 },
});

export default SchedulePage;