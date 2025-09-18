// app/Room/RuleManager.tsx
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axiosClient from "../../../utils/axiosClient";

// adjust this import path if your folder differs.
// From app/Room → app/shape-selector/utils/types
import type { Shape } from "../shape-selector/utils/types";

// ---------- Types ----------
type BulbState = { on: boolean; value: number };

type Area = {
  name: string;
  type: Shape["type"] | "none";
  equation?: string;
  x: number;
  y: number;
};


type SelectedBulbs = {
  ON: { bulb: string; intensity: number }[];
  OFF: { bulb: string; intensity: number }[];
};

type Rule = {
  Rule_Name: string;
  Area: Area;
  Selected_Bulbs: SelectedBulbs;
  Start_Time: string; // "HH:MM"
  End_Time: string;   // "HH:MM"
  Priority: "Low" | "Medium" | "High";
};

type ModeConfig = {
  Mode_Name: string;
  Rules: Rule[];
};

type RuleManagerProps = {
  shapes?: Shape[];
  mode?: string;
  username?: string;
  bulbsList?: string[]; // e.g. ['b1', 'b2', 'b3', 'b4']
};

// ---------- Component ----------
const RuleManager: React.FC<RuleManagerProps> = ({
  shapes = [],
  bulbsList = ["b1", "b2", "b3", "b4"],
  mode: initialMode,
  username: initialUser,
}) => {
  // Route params fallback
  const { roomId, mode: routeMode, username: routeUser } = useLocalSearchParams<{
    roomId?: string;
    mode?: string;
    username?: string;
  }>();
  const roomName = roomId ?? "Bathroom";
  const modeName = initialMode ?? routeMode ?? "Normal Mode";
  const username = initialUser ?? routeUser ?? "Tharindu";

  // Convert incoming shapes → Area[]
  const shapeAreas: Area[] = (shapes ?? []).map((s) => ({
    name: s.name,                    // must exist on Shape
    type: s.type as Shape["type"],   // preserve the union type
    // the rest are optional in your flow; provide fallbacks if Shape doesn't carry them
    equation: (s as any).equation ?? "",
    x: (s as any).x ?? 0,
    y: (s as any).y ?? 0,
  }));     

  const effectiveShapes: Area[] = React.useMemo(() => {
    const DEFAULT_AREA: Area = { name: "none", type: "none", equation: "", x: 0, y: 0 };
    return [DEFAULT_AREA, ...shapeAreas];
  }, [shapeAreas]);

  // State
  const [rules, setRules] = useState<Rule[]>([]);
  const [itemName, setItemName] = useState<string>("");
  const [shapeType, setShapeType] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [startText, setStartText] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);

  const [endTime, setEndTime] = useState<Date>(new Date());
  const [endText, setEndText] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const [priority, setPriority] = useState<number>(1);
  const [bulbs, setBulbs] = useState<BulbState[]>(bulbsList.map(() => ({ on: false, value: 0 })));
  const [showModal, setShowModal] = useState<boolean>(false);
  const [allModes, setAllModes] = useState<ModeConfig[]>([]);

  // Update displayed "shape type" when area changes
  useEffect(() => {
    const matched = effectiveShapes.find((s) => s.name === itemName);
    if (matched) setShapeType(matched.type);
    else setShapeType(null);
  }, [itemName,effectiveShapes]);

  // Fetch existing config and mode rules
  useEffect(() => {
    const fetchConfigForMode = async () => {
      try {
        const response = await axiosClient.get(
          `/api/rooms/configure?username=${username}&roomName=${roomName}`
        );
        const data = response.data ?? {};
        const modes: ModeConfig[] = Array.isArray(data.Automation_Modes) ? data.Automation_Modes : [];
        setAllModes(modes);

        const matchedMode = modes.find((m) => m.Mode_Name === modeName);
        setRules(matchedMode?.Rules ?? []);
      } catch (error) {
        console.error("❌ Failed to load room config:", error);
      }
    };
    fetchConfigForMode();
  }, [roomName, username, modeName]);

  // Manual time edits
  const onStartTextChange = (text: string) => {
    setStartText(text);
    const [hh, mm] = text.split(":").map((v) => parseInt(v, 10));
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      const d = new Date(startTime);
      d.setHours(hh, mm, 0, 0);
      setStartTime(d);
    }
  };

  const onEndTextChange = (text: string) => {
    setEndText(text);
    const [hh, mm] = text.split(":").map((v) => parseInt(v, 10));
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      const d = new Date(endTime);
      d.setHours(hh, mm, 0, 0);
      setEndTime(d);
    }
  };

  // Add rule locally
  const addRule = () => {
    if (!itemName || !shapeType) {
      Alert.alert("Error", "Select an area first");
      return;
    }
    const areaObj = effectiveShapes.find((s) => s.name === itemName) as Area;
    if (!areaObj) {
      Alert.alert("Error", "Invalid area");
      return;
    }

    const onBulbs: { bulb: string; intensity: number }[] = [];
    const offBulbs: { bulb: string; intensity: number }[] = [];
    bulbs.forEach((b, i) => {
      const bulbId = bulbsList[i];
      if (b.on) onBulbs.push({ bulb: bulbId, intensity: Math.round(b.value) });
      else offBulbs.push({ bulb: bulbId, intensity: 0 });
    });

    const newRule: Rule = {
      Rule_Name: `${itemName}_${Date.now()}`,
      Area: areaObj,
      Selected_Bulbs: { ON: onBulbs, OFF: offBulbs },
      Start_Time: startText,
      End_Time: endText,
      Priority: priority >= 4 ? "High" : priority === 3 ? "Medium" : "Low",
    };

    setRules((prev) => [...prev, newRule]);

    // reset
    setItemName("");
    setShapeType(null);
    const now = new Date();
    setStartTime(now);
    setStartText(now.toTimeString().slice(0, 5));
    setEndTime(now);
    setEndText(now.toTimeString().slice(0, 5));
    setPriority(1);
    setBulbs(bulbsList.map(() => ({ on: false, value: 0 })));
    setShowModal(false);
  };

  // Submit to backend
  const sendToBackend = async () => {
    const bulbMetadata = bulbsList.map((bulbId) => ({ bulbId, username }));
    const uniqueAreas: Area[] = [
      ...new Map(rules.map((r) => [r.Area.name, r.Area])).values(),
    ];

    const updatedModes: ModeConfig[] = allModes.map((m) =>
      m.Mode_Name === modeName ? { ...m, Rules: rules } : m
    );

    const payload = {
      username,
      roomName,
      bulbs: bulbMetadata,
      Areas: uniqueAreas,
      Automation_Modes: updatedModes,
    };

    try {
      await axiosClient.post("/api/rooms/configure", payload);
      Alert.alert("Success", "Rules submitted successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit rules");
    }
  };

  const toggleBulb = (index: number) => {
    setBulbs((prev) => {
      const u = [...prev];
      u[index].on = !u[index].on;
      return u;
    });
  };

  // ---------- Render ----------
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Create Rule</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Existing Rules</Text>
      <ScrollView>
        {rules.map((r, idx) => (
          <View key={r.Rule_Name} style={styles.ruleItem}>
            <Text style={styles.ruleText}>{r.Rule_Name}</Text>
            <TouchableOpacity onPress={() => setRules((prev) => prev.filter((_, i) => i !== idx))}>
              <Text style={{ color: "red", fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={sendToBackend} style={[styles.addButton, { backgroundColor: "#0a0" }]}>
        <Text style={styles.addButtonText}>Finish Calibrate</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.heading}>Create Rule</Text>

            <RNPickerSelect
              onValueChange={(val: string) => setItemName(val)}
              value={itemName}
              placeholder={{ label: "Select Area", value: "" }}
              items={effectiveShapes.map((s) => ({
                label: s.name === "none" ? "Default (outside door)" : s.name,
                value: s.name,
              }))}
              style={pickerStyle as any}
            />

            {shapeType && <Text style={[styles.label, { color: "white" }]}>Shape: {shapeType}</Text>}

            <Text style={styles.label}>Start Time:</Text>
            <TextInput
              style={styles.input}
              value={startText}
              onChangeText={onStartTextChange}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
            />
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
              <Text style={{ color: "#FFD700" }}>{startText}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                onChange={(_: DateTimePickerEvent, date?: Date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setStartTime(date);
                    setStartText(date.toTimeString().slice(0, 5));
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
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
              <Text style={{ color: "#FFD700" }}>{endText}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                onChange={(_: DateTimePickerEvent, date?: Date) => {
                  setShowEndPicker(false);
                  if (date) {
                    setEndTime(date);
                    setEndText(date.toTimeString().slice(0, 5));
                  }
                }}
              />
            )}

            <Text style={styles.label}>Select Bulbs:</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
              {bulbs.map((b, i) => (
                <TouchableOpacity key={`bulb-toggle-${i}`} onPress={() => toggleBulb(i)}>
                  <Ionicons name="bulb" size={40} color={b.on ? "#FFD700" : "#444"} />
                </TouchableOpacity>
              ))}
            </View>

            {bulbs.map(
              (b, i) =>
                b.on && (
                  <View key={`bulb-slider-${i}`}>
                    <Text style={styles.label}>Bulb {i + 1} Intensity: {Math.round(b.value)}%</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={b.value}
                      onValueChange={(val: number) => {
                        setBulbs((prev) => {
                          const u = [...prev];
                          u[i].value = val;
                          return u;
                        });
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
              onValueChange={(v: number) => setPriority(v)}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#444"
            />

            <TouchableOpacity onPress={addRule} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Save Rule</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.addButton, { backgroundColor: "#777" }]}>
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default RuleManager;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#FFD700",
  },
  heading: { fontSize: 18, color: "#FFD700", fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "#222",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: "#FFF",
  },
  label: { color: "#FFD700", marginVertical: 5 },
  addButton: { backgroundColor: "#FFD700", padding: 12, borderRadius: 8, marginVertical: 10, alignItems: "center" },
  addButtonText: { color: "#000", fontWeight: "bold" },
  ruleItem: { backgroundColor: "#111", padding: 10, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  ruleText: { color: "#FFD700", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.9)" },
  modalContent: { padding: 20 },
});

const pickerStyle = {
  inputIOS: {
    backgroundColor: "#222",
    color: "#FFD700",
    padding: 12,
    borderRadius: 6,
    borderColor: "#FFD700",
    borderWidth: 1,
    marginBottom: 10,
  },
  inputAndroid: {
    backgroundColor: "#222",
    color: "#FFD700",
    padding: 12,
    borderRadius: 6,
    borderColor: "#FFD700",
    borderWidth: 1,
    marginBottom: 10,
  },
  placeholder: { color: "#999" },
};
