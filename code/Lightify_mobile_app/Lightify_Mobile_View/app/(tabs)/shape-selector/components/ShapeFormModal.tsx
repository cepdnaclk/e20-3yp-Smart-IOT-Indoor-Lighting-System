// app/(rooms)/shape-selector/components/ShapeFormModal.tsx
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { parsePair } from "../utils/parse";
import { Shape } from "../utils/types";

type Tab = "Light Zone" | "Door" | "Bed/Table";

interface Props {
  visible: boolean;
  styles: any;
  liveX: number;
  liveY: number;
  defaultShape: Shape | null;
  onClose: () => void;
  onSave: (shape: Shape) => void;
  /** notify parent which tab the user selected (so it can show instructions) */
  onTabSelect?: (label: Tab) => void;
}

export default function ShapeFormModal({
  visible,
  styles,
  liveX,
  liveY,
  defaultShape,
  onClose,
  onSave,
  onTabSelect,
}: Props) {
  const [selected, setSelected] = useState<Tab>("Light Zone");
  const [name, setName] = useState("");
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!defaultShape) {
      setSelected("Light Zone");
      setName("");
      setInputs({});
      return;
    }
    setName(defaultShape.name);

    if (defaultShape.type === "point") {
      setSelected("Light Zone");
      setInputs({
        center: `${defaultShape.x[0]},${defaultShape.y[0]}`,
        radius: "1000",
      });
    } else if (defaultShape.type === "Door") {
      setSelected("Door");
      setInputs({
        lineCorner1: `${defaultShape.x[0]},${defaultShape.y[0]}`,
        lineCorner2: `${defaultShape.x[1]},${defaultShape.y[1]}`,
      });
    } else {
      setSelected("Bed/Table");
      const ni: Record<string, string> = {};
      defaultShape.x.forEach(
        (_, idx) => (ni[`rectCorner${idx + 1}`] = `${defaultShape.x[idx]},${defaultShape.y[idx]}`)
      );
      setInputs(ni);
    }
  }, [defaultShape]);

  const handleInput = (k: string, v: string) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const autofill = (k: string) =>
    handleInput(k, `${liveX},${liveY}`);

  const validate = () => {
    if (!name.trim()) return false;
    if (selected === "Light Zone") return !!inputs.center && !!inputs.radius;
    if (selected === "Door") return !!inputs.lineCorner1 && !!inputs.lineCorner2;
    if (selected === "Bed/Table")
      return [1, 2, 3, 4].every((n) => !!inputs[`rectCorner${n}`]);
    return true;
  };

  const submit = () => {
    if (!validate()) {
      Alert.alert("Error", "Fill name & all fields.");
      return;
    }

    let shape: Shape;
    if (selected === "Light Zone") {
      const { x, y } = parsePair(inputs.center!);
      const r = +inputs.radius!;
      shape = {
        type: "point",
        name: name.trim(),
        equation: `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`,
        x: [x],
        y: [y],
      };
    } else if (selected === "Door") {
      const p1 = parsePair(inputs.lineCorner1!);
      const p2 = parsePair(inputs.lineCorner2!);
      const m = (p2.y - p1.y) / (p2.x - p1.x);
      const b = p1.y - m * p1.x;
      const mF = Number.isFinite(m) ? m.toFixed(3) : "0";
      const bF = Number.isFinite(b) ? Number(b.toFixed(1)) : 0;
      shape = {
        type: "Door",
        name: name.trim(),
        equation: `y = ${mF}x ${bF >= 0 ? "+" + bF : bF}`,
        x: [p1.x, p2.x],
        y: [p1.y, p2.y],
      };
    } else {
      const corners = [1, 2, 3, 4].map((n) => parsePair(inputs[`rectCorner${n}`]!));
      shape = {
        type: "Bed/Table",
        name: name.trim(),
        equation: `Rectangle with corners ${corners
          .map((p) => `(${p.x},${p.y})`)
          .join(", ")}`,
        x: corners.map((p) => p.x),
        y: corners.map((p) => p.y),
      };
    }

    onSave(shape);
  };

  const selectTab = (t: Tab) => {
    setSelected(t);
    onTabSelect?.(t); // notify parent to show instructions
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            {/* tabs */}
            <View style={styles.buttonContainer}>
              {(["Light Zone", "Door", "Bed/Table"] as Tab[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.button, selected === t && styles.activeBtn]}
                  onPress={() => selectTab(t)}
                >
                  <Text style={[styles.buttonText, selected === t && styles.activeText]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* name */}
            <TextInput
              placeholder="Shape Name"
              placeholderTextColor="#999"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            {/* fields by tab */}
            {selected === "Light Zone" && (
              <>
                <TextInput
                  placeholder="Center (x,y)"
                  style={styles.input}
                  value={inputs.center || ""}
                  onChangeText={(t) => handleInput("center", t)}
                />
                <TouchableOpacity onPress={() => autofill("center")}>
                  <Text style={styles.fillBtn}>Use Current Pos</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="Radius (mm)"
                  style={styles.input}
                  keyboardType="numeric"
                  value={inputs.radius || ""}
                  onChangeText={(t) => handleInput("radius", t)}
                />
              </>
            )}

            {selected === "Door" &&
              [1, 2].map((n) => (
                <View key={n}>
                  <TextInput
                    placeholder={`Corner ${n} (x,y)`}
                    style={styles.input}
                    value={inputs[`lineCorner${n}`] || ""}
                    onChangeText={(t) => handleInput(`lineCorner${n}`, t)}
                  />
                  <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
                    <Text style={styles.fillBtn}>Use Current Pos</Text>
                  </TouchableOpacity>
                </View>
              ))}

            {selected === "Bed/Table" &&
              [1, 2, 3, 4].map((n) => (
                <View key={n}>
                  <TextInput
                    placeholder={`Corner ${n} (x,y)`}
                    style={styles.input}
                    value={inputs[`rectCorner${n}`] || ""}
                    onChangeText={(t) => handleInput(`rectCorner${n}`, t)}
                  />
                  <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}>
                    <Text style={styles.fillBtn}>Use Current Pos</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>

          {/* actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.submitBtn} onPress={submit}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
