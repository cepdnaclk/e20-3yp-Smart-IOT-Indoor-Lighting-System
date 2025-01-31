import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

const AddNewLightScreen = () => {
  const [isAuto, setIsAuto] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>{'<'} Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Add New Light</Text>

      {/* Light Name */}
      <View style={styles.row}>
        <Text style={styles.label}>Light name:</Text>
        <TextInput style={styles.input} placeholder="Enter light name" />
      </View>

      {/* Select Room */}
      <View style={styles.row}>
        <Text style={styles.label}>Select room:</Text>
        <View style={styles.inputWithOptions}>
          <TextInput style={[styles.input, styles.flex1]} placeholder="Select room" />
          <TouchableOpacity>
            <Text style={styles.link}>create new room</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* More Options */}
      <TouchableOpacity>
        <Text style={styles.moreOptions}>More Options ▼</Text>
      </TouchableOpacity>

      {/* Timing */}
      <View style={styles.row}>
        <Text style={styles.label}>Timing:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setIsAuto(false)} style={styles.radioRow}>
            <View style={[styles.radioButton, !isAuto && styles.radioSelected]} />
            <Text>Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAuto(true)} style={styles.radioRow}>
            <View style={[styles.radioButton, isAuto && styles.radioSelected]} />
            <Text>Auto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Start and End Time */}
      {isAuto && (
        <View style={styles.timingContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Start time:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter start time"
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End time:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter end time"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Light Button */}
      <TouchableOpacity style={styles.addLightButton}>
        <Text style={styles.addLightText}>Add Light</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>www.smartlights.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#007BFF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputWithOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 2,
  },
  link: {
    color: '#007BFF',
    marginLeft: 10,
    fontSize: 14,
  },
  moreOptions: {
    color: '#333',
    fontSize: 16,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 5,
  },
  radioSelected: {
    backgroundColor: '#007BFF',
  },
  timingContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addLightButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addLightText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
});

export default AddNewLightScreen;
