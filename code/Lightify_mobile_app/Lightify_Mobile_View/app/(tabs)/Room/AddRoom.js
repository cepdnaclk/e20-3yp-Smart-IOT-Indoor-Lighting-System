
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosClient from "../../../utils/axiosClient";
const USERNAME = "Tharindu";


export default function RoomCreationScreen() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [allDevices, setAllDevices] = useState([]);
  const [addedDevices, setAddedDevices] = useState([]);
  const router = useRouter();

  const initialBulbs = [
    { bulbId: "b1", name: "" },
    { bulbId: "b2", name: "" },
    { bulbId: "b3", name: "" },
    { bulbId: "b4", name: "" },
  ];
  const [bulbs, setBulbs] = useState(initialBulbs);
  const [selectedBulbs, setSelectedBulbs] = useState([]);

  useEffect(() => {
  const fetchDevices = async () => {
    try {
      const response = await axiosClient.get(`/api/devices?username=${USERNAME}`);
      setAllDevices(response.data || []);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      Alert.alert("Error", "Unable to fetch devices from server.");
    }
  };

  fetchDevices();
}, []);


  const toggleBulb = (bulbId) => {
    setSelectedBulbs((prev) =>
      prev.includes(bulbId) ? prev.filter((b) => b !== bulbId) : [...prev, bulbId]
    );
  };

  const handleAddDevice = (device) => {
  if (addedDevices.some((d) => d.deviceId === device.deviceId)) return;

  if (addedDevices.length >= 1) {
    Alert.alert("Limit Reached", "Only one device can be added to a room.");
    return;
  }

  setAddedDevices((prev) => [...prev, device]);
};

  const handleRemoveDevice = (deviceId) => {
  setAddedDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
};


  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a Room Name.");
      return;
    }
    if (addedDevices.length === 0) {
      Alert.alert("Error", "Please add at least one device.");
      return;
    }

    const payload = {
      roomName: roomName.trim(),
      username: USERNAME,
      bulbs: bulbs
        .filter((bulb) => selectedBulbs.includes(bulb.bulbId))
        .map((bulb) => ({
          bulbId: bulb.bulbId,
          username: USERNAME,
          name: bulb.name || bulb.bulbId,
        })),
      "addedDevices": addedDevices.map((d) => ({
        deviceId: d.deviceId,
        deviceName: d.deviceName,
        macAddress: d.macAddress,
      })),
      Areas: [],
      Automation_Modes: [],
    };

    console.log("Room Payload:", JSON.stringify(payload, null, 2));

    setLoading(true);
    try {
      await axiosClient.post("/api/rooms/devices", payload);

      const existingJson = await AsyncStorage.getItem("localRooms");
      const existing = existingJson ? JSON.parse(existingJson) : [];

      const newRoom = {
        room: roomName.trim(),
        devices: addedDevices.length > 0 ? [addedDevices[0]] : [],
      };

      await AsyncStorage.setItem("localRooms", JSON.stringify([...existing, newRoom]));

      router.replace("/Room/AddRoomHome");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>Create Room</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Room Name"
        placeholderTextColor="#AAAAAA"
        value={roomName}
        onChangeText={setRoomName}
      />

      <Text style={styles.label}>Select Bulbs & Set Names:</Text>
      <View style={styles.bulbContainer}>
        {bulbs.map((bulb, index) => {
          const isSelected = selectedBulbs.includes(bulb.bulbId);
          return (
            <View key={bulb.bulbId} style={styles.bulbBox}>
              <TouchableOpacity
                style={[styles.bulbIcon, isSelected && styles.selectedBulb]}
                onPress={() => toggleBulb(bulb.bulbId)}
              >
                <FontAwesome name="lightbulb-o" size={24} color="#FFD700" />
                <Text style={styles.bulbIdText}>{bulb.bulbId.toUpperCase()}</Text>
              </TouchableOpacity>
              {isSelected && (
                <TextInput
                  style={styles.bulbNameInput}
                  placeholder="Bulb Name"
                  placeholderTextColor="#888"
                  value={bulb.name}
                  onChangeText={(text) => {
                    const updated = [...bulbs];
                    updated[index].name = text;
                    setBulbs(updated);
                  }}
                />
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.label}>Available Devices:</Text>
      {allDevices
  .filter((device) => !addedDevices.some((d) => d.deviceId === device.deviceId))
  .map((device) => (
        <View key={device.deviceId} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>
              ID: {device.deviceId} - {device.deviceName}
            </Text>
            <Text style={styles.macText}>{device.macAddress}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddDevice(device)}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Added Devices:</Text>
      {addedDevices.map((device) => (
        <View key={device.deviceId} style={styles.deviceCard}>
          <View>
            <Text style={styles.deviceText}>
              ID: {device.deviceId} - {device.deviceName}
            </Text>
            <Text style={styles.macText}>{device.macAddress}</Text>
          </View>
          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveDevice(device.deviceId)}>
            <Text style={styles.btnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.createButton, loading && { backgroundColor: "#A68B00" }]}
        onPress={handleCreateRoom}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.createButtonText}>Create Room</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  label: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  deviceCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#FFD700",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  macText: {
    color: "#AAA",
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: "#0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeBtn: {
    backgroundColor: "#F00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  bulbContainer: {
    marginTop: 10,
  },
  bulbBox: {
    marginBottom: 15,
  },
  bulbIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#111",
  },
  selectedBulb: {
    backgroundColor: "#333",
  },
  bulbIdText: {
    color: "#FFD700",
    marginLeft: 10,
    fontWeight: "bold",
  },
  bulbNameInput: {
    backgroundColor: "#222",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: "#FFF",
  },
});





