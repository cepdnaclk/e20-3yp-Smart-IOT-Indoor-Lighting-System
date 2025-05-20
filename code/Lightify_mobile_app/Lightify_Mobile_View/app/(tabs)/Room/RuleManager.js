import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function RuleManager() {
  const [rules, setRules] = useState([]);
  const [ruleName, setRuleName] = useState('');
  const [area, setArea] = useState('');
  const [bulbs, setBulbs] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [priority, setPriority] = useState('low');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const addRule = () => {
    if (!ruleName.trim()) return;
    const newRule = { ruleName, area, bulbs, startTime, endTime, priority };
    setRules(prev => [...prev, newRule]);
    setRuleName('');
    setArea('');
    setBulbs('');
    setStartTime(new Date());
    setEndTime(new Date());
    setPriority('low');
  };

  const deleteRule = index => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Rule</Text>

      <TextInput
        style={styles.input}
        placeholder="Rule Name"
        placeholderTextColor="#AAA"
        value={ruleName}
        onChangeText={setRuleName}
      />

      <RNPickerSelect
        onValueChange={setArea}
        value={area}
        placeholder={{ label: 'Select Area', value: '' }}
        items={[{ label: 'Living Room', value: 'living_room' }]}
        style={pickerStyle}
      />

      <RNPickerSelect
        onValueChange={setBulbs}
        value={bulbs}
        placeholder={{ label: 'Select Bulbs', value: '' }}
        items={[{ label: 'b1, b2, b3', value: 'b1,b2,b3' }]}
        style={pickerStyle}
      />

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

      <RNPickerSelect
        onValueChange={setPriority}
        value={priority}
        placeholder={{ label: 'Select Priority', value: 'low' }}
        items={[
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ]}
        style={pickerStyle}
      />

      <TouchableOpacity onPress={addRule} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Rule</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Existing Rules</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {rules.map((r, idx) => (
          <View key={idx} style={styles.ruleItem}>
            <Text style={styles.ruleText}>{r.ruleName}</Text>
            <TouchableOpacity onPress={() => deleteRule(idx)}>
              <Text style={{ color: 'red', fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
