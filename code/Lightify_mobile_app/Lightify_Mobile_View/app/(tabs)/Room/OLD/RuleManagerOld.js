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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axiosClient from '../../../../utils/axiosClient';

export default function RuleManager({
  shapes = [],
  bulbsList = ['b1', 'b2', 'b3', 'b4'],
  mode: initialMode,
  username: initialUser,
}) {
  // Route params fallback
  const { roomId, mode: routeMode, username: routeUser } = useLocalSearchParams();
  const roomName = roomId || 'Bathroom';
  const modeName = initialMode || routeMode || 'Normal Mode';
  const username = initialUser || routeUser || 'Tharindu';

  // Default area
  const DEFAULT_AREA = { name: 'none', type: 'none', equation: '', x: 0, y: 0 };
  const effectiveShapes = [DEFAULT_AREA, ...shapes];

  // State
  const [rules, setRules] = useState([]);
  const [itemName, setItemName] = useState('');
  const [shape, setShape] = useState(null);

  const [startTime, setStartTime] = useState(new Date());
  const [startText, setStartText] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [endTime, setEndTime] = useState(new Date());
  const [endText, setEndText] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [priority, setPriority] = useState(1);
  const [bulbs, setBulbs] = useState(
    bulbsList.map(() => ({ on: false, value: 0 }))
  );
  const [showModal, setShowModal] = useState(false);
  const [allModes, setAllModes] = useState([]);


  // Update shape when itemName changes
  useEffect(() => {
    const matched = effectiveShapes.find((s) => s.name === itemName);
    if (matched) setShape(matched.type);
  }, [itemName]);

  // Fetch existing rules
  useEffect(() => {
  const fetchConfigForMode = async () => {
    try {
      const response = await axiosClient.get(
        `/api/rooms/configure?username=${username}&roomName=${roomName}`
      );
      const data = response.data;
      // store all modes
      setAllModes(Array.isArray(data.Automation_Modes) ? data.Automation_Modes : []);
      // extract just the one you’re editing
      const matchedMode = (data.Automation_Modes || [])
        .find(m => m.Mode_Name === modeName);
      setRules(matchedMode?.Rules || []);
    } catch (error) {
      console.error('❌ Failed to load room config:', error);
    }
  };
  fetchConfigForMode();
}, [roomName, username, modeName]);


  // Handlers for manual time entry
  const onStartTextChange = (text) => {
    setStartText(text);
    const [hh, mm] = text.split(':').map((v) => parseInt(v, 10));
    if (!isNaN(hh) && !isNaN(mm)) {
      const d = new Date(startTime);
      d.setHours(hh, mm);
      setStartTime(d);
    }
  };

  const onEndTextChange = (text) => {
    setEndText(text);
    const [hh, mm] = text.split(':').map((v) => parseInt(v, 10));
    if (!isNaN(hh) && !isNaN(mm)) {
      const d = new Date(endTime);
      d.setHours(hh, mm);
      setEndTime(d);
    }
  };

  // Add rule locally
  const addRule = () => {
    if (!itemName || !shape) {
      return Alert.alert('Error', 'Select an area first');
    }
    const areaObj = effectiveShapes.find((s) => s.name === itemName);
    const onBulbs = [];
    const offBulbs = [];
    bulbs.forEach((b, i) => {
      const bulbId = bulbsList[i];
      if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
      else offBulbs.push({ bulb: bulbId, intensity: 0 });
    });

    const rule = {
      Rule_Name: `${itemName}_${Date.now()}`,
      Area: areaObj,
      Selected_Bulbs: { ON: onBulbs, OFF: offBulbs },
      Start_Time: startText,
      End_Time: endText,
      Priority:
        priority >= 4 ? 'High' : priority === 3 ? 'Medium' : 'Low',
    };

    setRules((prev) => [...prev, rule]);
    // reset
    setItemName('');
    setShape(null);
    setStartTime(new Date());
    setStartText(new Date().toTimeString().slice(0, 5));
    setEndTime(new Date());
    setEndText(new Date().toTimeString().slice(0, 5));
    setPriority(1);
    setBulbs(bulbsList.map(() => ({ on: false, value: 0 })));
    setShowModal(false);
  };

  // Send to backend
    const sendToBackend = async () => {
    // build your bulb and area metadata as before...
    const bulbMetadata = bulbsList.map(bulbId => ({ bulbId, username }));
    const uniqueAreas = [
      ...new Map(rules.map(r => [r.Area.name, r.Area])).values()
    ];

    // map over allModes, swapping in the updated rules for this mode only
    const updatedModes = allModes.map(m =>
      m.Mode_Name === modeName
        ? { ...m, Rules: rules }
        : m
    );

    const payload = {
      username,
      roomName,
      bulbs: bulbMetadata,
      Areas: uniqueAreas,
      Automation_Modes: updatedModes,
    };

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
      const u = [...prev];
      u[index].on = !u[index].on;
      return u;
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Create Rule</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Existing Rules</Text>
      <ScrollView>
        {rules.map((r, idx) => (
          <View key={idx} style={styles.ruleItem}>
            <Text style={styles.ruleText}>{r.Rule_Name}</Text>
            <TouchableOpacity
              onPress={() =>
                setRules((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={sendToBackend}
        style={[styles.addButton, { backgroundColor: '#0a0' }]}
      >
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
              items={effectiveShapes.map((s) => ({
                label:
                  s.name === 'none'
                    ? 'Default (outside door)'
                    : s.name,
                value: s.name,
              }))}
              style={pickerStyle}
            />
            {shape && (
              <Text style={[styles.label, { color: 'white' }]}>Shape: {shape}</Text>
            )}

            <Text style={styles.label}>Start Time:</Text>
            <TextInput
              style={styles.input}
              value={startText}
              onChangeText={onStartTextChange}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
            />
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.input}
            >
              <Text style={{ color: '#FFD700' }}>{startText}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setStartTime(date);
                    const txt = date.toTimeString().slice(0, 5);
                    setStartText(txt);
                  }
                }}
              />
            )}

            <Text style={styles.label}>End Time:</Text>
            <TextInput
              style={styles.input}
              value={endText}
              onChangeText={onEndTextChange}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
            />
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.input}
            >
              <Text style={{ color: '#FFD700' }}>{endText}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) {
                    setEndTime(date);
                    const txt = date.toTimeString().slice(0, 5);
                    setEndText(txt);
                  }
                }}
              />
            )}

            <Text style={styles.label}>Select Bulbs:</Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}
            >
              {bulbs.map((b, i) => (
                <TouchableOpacity key={i} onPress={() => toggleBulb(i)}>
                  <Ionicons name="bulb" size={40} color={b.on ? '#FFD700' : '#444'} />
                </TouchableOpacity>
              ))}
            </View>
            {bulbs.map(
              (b, i) =>
                b.on && (
                  <View key={i}>
                    <Text style={styles.label}>
                      Bulb {i + 1} Intensity: {Math.round(b.value)}%
                    </Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={b.value}
                      onValueChange={(val) => {
                        const u = [...bulbs];
                        u[i].value = val;
                        setBulbs(u);
                      }}
                      minimumTrackTintColor="#FFD700"
                      maximumTrackTintColor="#444"
                    />
                  </View>
                )
            )}

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
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[styles.addButton, { backgroundColor: '#777' }]}
            >
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
  heading: { fontSize: 18, color: '#FFD700', fontWeight: 'bold', marginBottom: 10 },
  input: {
    backgroundColor: '#222',
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: '#FFF',
  },
  label: { color: '#FFD700', marginVertical: 5 },
  addButton: { backgroundColor: '#FFD700', padding: 12, borderRadius: 8, marginVertical: 10, alignItems: 'center' },
  addButtonText: { color: '#000', fontWeight: 'bold' },
  ruleItem: { backgroundColor: '#111', padding: 10, borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ruleText: { color: '#FFD700', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' },
  modalContent: { padding: 20 },
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
  placeholder: { color: '#999' },
};
