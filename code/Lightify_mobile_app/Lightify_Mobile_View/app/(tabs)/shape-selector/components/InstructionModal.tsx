// InstructionModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function InstructionModal({
  visible, text, styles, onClose,
}: { visible: boolean; text: string; styles: any; onClose: () => void; }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={{ color: "#FFD700", marginBottom: 20, fontSize: 16 }}>{text}</Text>
          <TouchableOpacity style={styles.submitBtn} onPress={onClose}>
            <Text style={{ color: "#000", fontWeight: "bold" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
