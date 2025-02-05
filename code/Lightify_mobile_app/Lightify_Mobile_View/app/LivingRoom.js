import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LivingRoomControl = () => {
  const [floorLamp, setFloorLamp] = useState(70);
  const [spotlights, setSpotlights] = useState(29);
  const [barLamp, setBarLamp] = useState(73);
  const [blinds, setBlinds] = useState(100);
  const [nestMiniStatus, setNestMiniStatus] = useState('Playing');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Living Room</Text>
        <View style={styles.environment}>
          <Text>🌡️ 22.8°C</Text>
          <Text>💧 57%</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <ControlItem
          name="Floor Lamp"
          value={`${floorLamp}%`}
          onPress={() => setFloorLamp((prev) => (prev < 100 ? prev + 10 : 0))}
        />
        <ControlItem
          name="Spotlights"
          value={`${spotlights}%`}
          onPress={() => setSpotlights((prev) => (prev < 100 ? prev + 10 : 0))}
        />
        <ControlItem
          name="Bar Lamp"
          value={`${barLamp}%`}
          onPress={() => setBarLamp((prev) => (prev < 100 ? prev + 10 : 0))}
        />
        <ControlItem
          name="Blinds"
          value={`Open - ${blinds}%`}
          onPress={() => setBlinds((prev) => (prev === 100 ? 0 : 100))}
        />
        <ControlItem
          name="Nest Mini"
          value={nestMiniStatus}
          onPress={() => setNestMiniStatus((prev) => (prev === 'Playing' ? 'Paused' : 'Playing'))}
        />
      </View>
    </View>
  );
};

const ControlItem = ({ name, value, onPress }) => (
  <TouchableOpacity style={styles.controlItem} onPress={onPress}>
    <Text style={styles.controlName}>{name}</Text>
    <Text style={styles.controlValue}>{value}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  environment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  controlName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  controlValue: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default LivingRoomControl;
