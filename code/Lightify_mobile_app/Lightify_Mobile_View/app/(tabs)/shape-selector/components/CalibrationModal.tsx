// CalibrationModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function CalibrationModal({
  visible, bulbs, styles, onToggle, onSubmit, onCancel,
}: {
  visible: boolean; bulbs: boolean[];
  styles: any;
  onToggle: (idx: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.calibrationTitle}>Calibrate Bulbs</Text>
          <View style={styles.bulbRow}>
            {[0,1,2,3].map(i => (
              <TouchableOpacity key={i} onPress={() => onToggle(i)}
                style={[styles.bulb, bulbs?.[i] && styles.bulbOn]}>
                <Text style={{ color: "#000", fontWeight: "bold" }}>💡 {bulbs?.[i] ? "ON" : "OFF"}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, styles.cancelBtn]} onPress={onCancel}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
