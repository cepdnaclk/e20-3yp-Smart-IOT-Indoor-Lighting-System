import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Shape } from "../utils/types";

export default function ShapeList({
  shapes, styles, onEdit, onDelete, CalibrationResult,
}: {
  shapes: Shape[]; styles: any;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  CalibrationResult?: (i: number) => React.ReactNode;
}) {
  return (
    <ScrollView style={styles.list}>
      {shapes.map((s, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.itemText}>{s.name} ({s.type})</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(i)}>
              <Text style={styles.updateBtn}>🛠️ Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert("Confirm Delete", `Delete "${s.name}"?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(i) },
              ]);
            }}>
              <Text style={styles.deleteBtn}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
          {CalibrationResult?.(i)}
        </View>
      ))}
    </ScrollView>
  );
}
