// import React, { useState } from 'react';
// import { View, Text, Button, Switch, Alert } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ScheduleScreen = () => {
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [isOn, setIsOn] = useState(false);

//   const handleConfirm = (event, selectedDate) => {
//     setShowPicker(false);
//     if (selectedDate) setDate(selectedDate);
//   };

//   const handleSubmit = async () => {
//     const schedule = { time: date, status: isOn ? "ON" : "OFF" };

//     try {
//       const response = await fetch("http://your-backend-url/api/schedule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(schedule),
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Schedule saved successfully!");
//       } else {
//         Alert.alert("Error", "Failed to save schedule");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Network error, try again");
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Select Date & Time:</Text>
//       <Button title={date.toLocaleString()} onPress={() => setShowPicker(true)} />
//       {showPicker && (
//         <DateTimePicker value={date} mode="datetime" display="default" onChange={handleConfirm} />
//       )}

//       <Text>Turn Lights:</Text>
//       <Switch value={isOn} onValueChange={setIsOn} />

//       <Button title="Save Schedule" onPress={handleSubmit} />
//     </View>
//   );
// };

// export default ScheduleScreen;
