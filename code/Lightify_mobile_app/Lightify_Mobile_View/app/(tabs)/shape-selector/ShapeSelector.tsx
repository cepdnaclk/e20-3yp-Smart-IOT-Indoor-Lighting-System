import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import CalibrationModal from "./components/CalibrationModal";
import InstructionModal from "./components/InstructionModal";
import ShapeCanvas from "./components/ShapeCanvas";
import ShapeFormModal from "./components/ShapeFormModal";
import ShapeList from "./components/ShapeList";

import useRoomConfig from "./hooks/useRoomConfig";
import useWsConnector from "./hooks/useWsConnector";

import { getInstructionText } from "./utils/instructions";
import { Shape } from "./utils/types";

// 👉 your existing RuleManager
import RuleManager from "../Room/OLD/RuleManagerOld";

export default function ShapeSelector() {
  const { roomName, roomId, username, mode } = useLocalSearchParams<{
    roomName?: string;
    roomId?: string;
    username?: string;
    mode?: string;
  }>();
  const ROOM_NAME = roomName || roomId || "Bathroom";
  const USERNAME = username || "Tharindu";
  const MODE_NAME = mode || "Normal Mode";

  const { coords, send } = useWsConnector(USERNAME, ROOM_NAME);
  const { shapes, setShapes, saveShapes } = useRoomConfig(USERNAME, ROOM_NAME);

  const [canvasW, setCanvasW] = useState(0);
  const [canvasH, setCanvasH] = useState(0);

  const [formVisible, setFormVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const defaultShape: Shape | null = useMemo(
    () => (editingIndex != null ? shapes[editingIndex] : null),
    [editingIndex, shapes]
  );

  const [instructionVisible, setInstructionVisible] = useState(false);
  const [instructionText, setInstructionText] = useState("");

  const [calIdx, setCalIdx] = useState<number | null>(null);
  const [calState, setCalState] = useState<Record<number, { bulbs: boolean[]; submitted: boolean }>>({});

  const onNew = () => {
    setEditingIndex(null);
    setFormVisible(true);
  };

  const onEdit = (i: number) => {
    setEditingIndex(i);
    setFormVisible(true);
  };

  const onDelete = (i: number) => {
    const next = shapes.filter((_, idx) => idx !== i);
    send({ action: "delete", index: i });
    setShapes(next);
    saveShapes(next);
  };

  const onSaveShape = (shape: Shape) => {
    const updating = editingIndex != null;
    const next = updating
      ? [...shapes.slice(0, editingIndex!), shape, ...shapes.slice(editingIndex! + 1)]
      : [...shapes, shape];

    send({
      action: updating ? "update" : "add",
      index: updating ? editingIndex : null,
      shape,
    });

    setShapes(next);
    saveShapes(next);
    setFormVisible(false);
  };

  const onShapeTabSelect = (label: "Light Zone" | "Door" | "Bed/Table") => {
    setInstructionText(getInstructionText(label));
    setInstructionVisible(true);
  };

  const openCalibration = (i: number) => {
    setCalIdx(i);
    setCalState((p) => ({
      ...p,
      [i]: { bulbs: p[i]?.bulbs || [false, false, false, false], submitted: false },
    }));
  };

  const toggleBulb = (idx: number) => {
    setCalState((p) => {
      if (calIdx == null) return p;
      const bulbs = [...(p[calIdx]?.bulbs || [false, false, false, false])];
      bulbs[idx] = !bulbs[idx];
      return { ...p, [calIdx]: { bulbs, submitted: false } };
    });
  };

  const submitCalibration = () => {
    if (calIdx == null) return;
    setCalState((p) => ({
      ...p,
      [calIdx]: { ...(p[calIdx] || { bulbs: [false, false, false, false] }), submitted: true },
    }));
    setCalIdx(null);
  };

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Room Blueprint</Text>

        <View
          style={styles.svgContainer}
          onLayout={(e) => {
            setCanvasW(e.nativeEvent.layout.width);
            setCanvasH(e.nativeEvent.layout.height);
          }}
        >
          {canvasW > 0 && (
            <ShapeCanvas
              width={canvasW}
              height={canvasH}
              shapes={shapes}
              liveX={coords.x}
              liveY={coords.y}
              onEdit={onEdit}
            />
          )}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onNew}>
          <Text style={styles.addBtnText}>Add Room Feature</Text>
        </TouchableOpacity>

      {/* Wrap the main content in a ScrollView */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <ShapeList
          shapes={shapes}
          styles={styles}
          onEdit={onEdit}
          onDelete={onDelete}
          CalibrationResult={(i) =>
            calState[i]?.submitted && (
              <Text style={styles.calibrationResult}>
                🔆 Bulbs ON:{" "}
                {(calState[i].bulbs || [])
                  .map((on, idx) => (on ? `Bulb ${idx + 1}` : null))
                  .filter(Boolean)
                  .join(", ") || "None"}
              </Text>
            )
          }
        />

        {/* RuleManager placed inside the scroll area */}
        <RuleManager
          shapes={[]}
          mode={MODE_NAME}
          username={USERNAME}
        />
      </ScrollView>

      {/* Modals stay outside to overlay the whole screen */}
      <InstructionModal
        visible={instructionVisible}
        text={instructionText}
        styles={styles}
        onClose={() => setInstructionVisible(false)}
      />

      <CalibrationModal
        visible={calIdx !== null}
        bulbs={calState[calIdx!]?.bulbs || [false, false, false, false]}
        styles={styles}
        onToggle={toggleBulb}
        onSubmit={submitCalibration}
        onCancel={() => setCalIdx(null)}
      />

      <ShapeFormModal
        visible={formVisible}
        styles={styles}
        liveX={coords.x}
        liveY={coords.y}
        defaultShape={defaultShape}
        onClose={() => setFormVisible(false)}
        onSave={onSaveShape}
        onTabSelect={onShapeTabSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", paddingTop: 20 },
  scroll: { width: "100%" },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 32, // so content isn't hidden behind bottom edges
  },

  heading: { color: "#FFD700", fontSize: 24, marginVertical: 12 },

  svgContainer: {
    width: "90%",
    aspectRatio: 2,
    borderRadius: 6,
    overflow: "hidden",
  },

  list: { width: "90%", marginTop: 12 },
  listItem: {
    flexDirection: "column",
    backgroundColor: "#111",
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
  },
  itemText: { color: "#FFD700", fontSize: 16, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "flex-start", marginTop: 8, marginBottom: 6 },

  updateBtn: { color: "#0af", marginRight: 12, fontWeight: "bold" },
  deleteBtn: { color: "#f55", marginRight: 12, fontWeight: "bold" },
  calibrationResult: { color: "#FFD700", marginTop: 6, fontStyle: "italic", alignSelf: "flex-start" },

  addBtn: { backgroundColor: "#FFD700", padding: 12, borderRadius: 6, marginTop: 8 },
  addBtnText: { color: "#000", fontWeight: "bold" },

  input: { backgroundColor: "#222", color: "#FFD700", padding: 10, marginVertical: 6, borderRadius: 6 },
  fillBtn: { color: "#FFD700", marginBottom: 12, textDecorationLine: "underline" },

  buttonContainer: { flexDirection: "row", justifyContent: "center" },
  button: { padding: 8, margin: 4, backgroundColor: "#222", borderRadius: 6 },
  activeBtn: { backgroundColor: "#FFD700" },
  buttonText: { color: "#FFD700" },
  activeText: { color: "#000", fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { backgroundColor: "#111", padding: 20, borderRadius: 10, width: "85%", maxHeight: "80%", alignItems: "center" },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 16 },
  calibrationTitle: { color: "#FFD700", fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  bulbRow: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", marginVertical: 16 },
  bulb: { padding: 12, backgroundColor: "#555", borderRadius: 8, margin: 6 },
  bulbOn: { backgroundColor: "#00ff00" },
  bulbText: { color: "#000", fontWeight: "bold" },
  submitBtn: { backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
  cancelBtn: { backgroundColor: "#555" },
  submitText: { color: "#000", fontWeight: "bold" },
});
