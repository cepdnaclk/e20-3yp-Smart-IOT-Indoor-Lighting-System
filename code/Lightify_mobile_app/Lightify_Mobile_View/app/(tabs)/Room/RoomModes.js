import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosClient from "../../../utils/axiosClient";
import RuleManager from "./RuleManager";

export default function RoomModesScreen() {
  const router = useRouter();
  const { roomName } = useLocalSearchParams(); // Fetch roomName from URL
  const USERNAME = "Tharindu"; // Hard-coded username

  const [modes, setModes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModeName, setNewModeName] = useState("");
  const [selectedMode, setSelectedMode] = useState(null);

  // For the custom error banner:
  const [errorMessage, setErrorMessage] = useState(null);
  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Fetch existing modes from backend
  useEffect(() => {
    const fetchRoomModes = async () => {
      try {
        const res = await axiosClient.get(
          `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
        );
        const data = res.data;
        if (Array.isArray(data.Automation_Modes)) {
          const extractedModes = data.Automation_Modes.map((modeObj) => ({
            _id: modeObj.Mode_Name.toLowerCase().replace(/\s+/g, "_"),
            name: modeObj.Mode_Name,
            active: false, // default inactive; adjust as needed
          }));
          setModes(extractedModes);
        } else {
          throw new Error("Invalid Automation_Modes format");
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch modes, using fallback:", err);
        setModes([
          { _id: "normal_mode", name: "Normal Mode", active: true },
          { _id: "night_mode", name: "Night Mode", active: false },
          { _id: "energy_saver", name: "Energy Saver", active: false },
        ]);
      }
    };

    if (roomName) {
      fetchRoomModes();
    }
  }, [roomName]);

  // Toggle the “active” switch for a mode (only one can be active)
  const toggleModeSwitch = async (index) => {
    const modeName = modes[index].name;
    const isActive = modes[index].active;
    const anotherActive = modes.some((m, i) => i !== index && m.active);

    if (!isActive && anotherActive) {
      showError("Only one mode can be active at a time.");
      return;
    }

    // 1) Update local UI
    const updated = modes.map((m, i) =>
      i === index ? { ...m, active: !isActive } : { ...m, active: false }
    );
    setModes(updated);

    // 2) If turning ON, publish the mode name
    if (!isActive) {
      try {
        await axiosClient.post(
          `/api/rooms/publishMqtt?username=${encodeURIComponent(USERNAME)}` +
            `&roomName=${encodeURIComponent(roomName)}` +
            `&modeName=${encodeURIComponent(modeName)}`
        );
        Alert.alert("Success", `${modeName} published to MQTT`);
      } catch (err) {
        console.error("❌ MQTT publish failed", err);
        showError(`Could not publish "${modeName}"`);
      }
      return;
    }

    // 3) If turning OFF, fetch roomState and send direct_light_set
    try {
      const stateRes = await axiosClient.get(
        `/api/backend/roomState?username=${encodeURIComponent(USERNAME)}` +
          `&roomName=${encodeURIComponent(roomName)}`
      );
      const bulbStates = stateRes.data.message; // array of { bulb_id, brightness }

      const mqttBody = {
        command: "direct_light_set",
        payload: {
          room_name: roomName,
          message: bulbStates,
          automation: [
            { schedule_type: "permanent", schedule_working_period: null },
          ],
        },
      };

      await axiosClient.post(
        `/mqtt/publish?username=${encodeURIComponent(USERNAME)}` +
          `&roomName=${encodeURIComponent(roomName)}`,
        mqttBody
      );
      Alert.alert("Success", "Room state published to MQTT");
    } catch (err) {
      console.error("❌ Failed to publish direct_light_set", err);
      showError("Could not send room-state MQTT message");
    }
  };

  // Called when a mode card is tapped
  const selectModeForRules = (modeName) => {
    setSelectedMode(modeName);
  };

  // Add a brand-new mode
  const handleAddMode = async () => {
    if (!newModeName.trim()) {
      showError("Please enter a mode name");
      return;
    }
    try {
      const res = await axiosClient.get(
        `/api/rooms/configure?username=${USERNAME}&roomName=${roomName}`
      );
      const data = res.data;

      const newMode = {
        Mode_Name: newModeName.trim(),
        Rules: [],
      };

      const updatedData = {
        username: USERNAME,
        roomName: roomName,
        bulbs: data.bulbs || [],
        Areas: data.Areas || [],
        Automation_Modes: [...(data.Automation_Modes || []), newMode],
      };

      await axiosClient.post("/api/rooms/configure", updatedData);

      setModes((prev) => [
        ...prev,
        {
          _id: newModeName.toLowerCase().replace(/\s+/g, "_"),
          name: newModeName.trim(),
          active: false,
        },
      ]);

      setNewModeName("");
      setModalVisible(false);
      Alert.alert("Success", "New mode added!");
    } catch (err) {
      console.error("❌ Failed to add mode:", err);
      showError("Could not add new mode. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom error banner */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Header with room title and “+” to add mode */}
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName || "Room"}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* List of existing modes */}
      <ScrollView contentContainerStyle={styles.modeList}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={styles.modeCard}
            onPress={() => {
              selectModeForRules(mode.name);
              router.push({
                // pathname: "Room/RadarDataReceiver",
                pathname: "shape-selector/ShapeSelector",
                params: { roomName, mode: mode.name },
              });
            }}
          >
            <Text style={styles.modeText}>{mode.name}</Text>
            <Switch
              value={mode.active}
              onValueChange={() => toggleModeSwitch(index)}
              trackColor={{ false: "#444", true: "#FFD70055" }}
              thumbColor={mode.active ? "#FFD700" : "#888"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Render RuleManager if a mode was tapped */}
      {selectedMode && (
        <RuleManager
          shapes={[]} // replace with real shapes if available
          bulbsList={["b1", "b2", "b3", "b4"]}
          mode={selectedMode}
          username={USERNAME}
        />
      )}

      {/* Modal to add a new mode */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Mode</Text>
            <TextInput
              placeholder="Enter mode name"
              style={styles.input}
              value={newModeName}
              onChangeText={setNewModeName}
              placeholderTextColor="#AAA"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddMode}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#777" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  modeList: {
    paddingBottom: 20,
  },
  modeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#FFD700",
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#111",
  },
  modeText: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#FFD700",
  },
  input: {
    width: "100%",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#FFF",
    backgroundColor: "#222",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#000",
    fontWeight: "bold",
  },
  // Styles for the custom error banner:
  errorBanner: {
    backgroundColor: "#000",      // solid black background
    borderColor: "#FFD700",       // dark yellow border
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#FFD700",             // dark yellow text
    fontWeight: "bold",
    textAlign: "center",
  },
});

