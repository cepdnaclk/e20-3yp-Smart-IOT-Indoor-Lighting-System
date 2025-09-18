// Full ShapeSelector with local storage, SVG rendering, and advanced calibration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

const bulbNames = ["Bulb 1", "Bulb 2", "Bulb 3", "Bulb 4"];

const ShapeSelector = () => {
  const [selectedShape, setSelectedShape] = useState("round");
  const [inputs, setInputs] = useState({});
  const [shapes, setShapes] = useState([]);
  const [calibrateIndex, setCalibrateIndex] = useState(null);
  const [bulbStates, setBulbStates] = useState({});
  const [shapeName, setShapeName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadShapesFromStorage();
  }, []);

  const saveShapesToStorage = async (shapes) => {
    try {
      await AsyncStorage.setItem("shapes", JSON.stringify(shapes));
    } catch (error) {
      console.error("Error saving shapes:", error);
    }
  };

  const loadShapesFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("shapes");
      if (data) setShapes(JSON.parse(data));
    } catch (error) {
      console.error("Error loading shapes:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
  };

  const toggleBulb = (index) => {
    setBulbStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        on: !prev[index]?.on,
      },
    }));
  };

  const updateBulbState = (index, key, value) => {
    setBulbStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value,
      },
    }));
  };

  const handleSaveShape = () => {
    if (!shapeName) return alert("Enter shape name!");

    const bulbs = Object.entries(bulbStates).map(([index, state]) => ({
      name: bulbNames[index],
      ...state,
    }));

    const shapeData = {
      name: shapeName,
      type: selectedShape,
      coordinates: { ...inputs },
      bulbs: bulbs.filter((b) => b.on),
    };

    const updatedShapes = [...shapes, shapeData];
    setShapes(updatedShapes);
    saveShapesToStorage(updatedShapes);

    setInputs({});
    setShapeName("");
    setBulbStates({});
    setCalibrateIndex(null);
  };

  const handleSubmit = () => {
    const jsonOutput = shapes.map((s) => [s.name, s.type, s.coordinates, s.bulbs]);
    console.log("\u2705 Final JSON Output:\n", JSON.stringify(jsonOutput, null, 2));
    Alert.alert("Submitted!", "Check console for JSON output");
  };

  const renderCalibrateSection = (index) => {
    if (calibrateIndex !== index) return null;

    return (
      <View style={styles.calibrateBox}>
        {bulbNames.map((bulb, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => toggleBulb(i)}
              style={[styles.bulbButton, bulbStates[i]?.on && { backgroundColor: "lime" }]}
            >
              <Text style={styles.buttonText}>{bulb}</Text>
            </TouchableOpacity>
            {showAdvanced && bulbStates[i]?.on && (
              <View>
                <TextInput
                  placeholder="Brightness (0-100)"
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={(val) => updateBulbState(i, "brightness", val)}
                />
                <TextInput
                  placeholder="Priority (1-5)"
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={(val) => updateBulbState(i, "priority", val)}
                />
                <TextInput
                  placeholder="Start Time (e.g. 18:00)"
                  style={styles.input}
                  onChangeText={(val) => updateBulbState(i, "startTime", val)}
                />
                <TextInput
                  placeholder="End Time (e.g. 22:00)"
                  style={styles.input}
                  onChangeText={(val) => updateBulbState(i, "endTime", val)}
                />
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.buttonText}>Advanced</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSave} onPress={handleSaveShape}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Shape</Text>
      <View style={styles.buttonContainer}>
        {["round", "line", "rectangle"].map((shape) => (
          <TouchableOpacity
            key={shape}
            style={styles.button}
            onPress={() => setSelectedShape(shape)}
          >
            <Text style={styles.buttonText}>{shape.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Shape Name"
        style={styles.input}
        placeholderTextColor="#999"
        onChangeText={setShapeName}
        value={shapeName}
      />
      <ScrollView style={{ width: "90%" }}>
        {selectedShape === "round" && (
          <>
            <TextInput
              placeholder="Center (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("center", text)}
              value={inputs.center}
            />
            <TextInput
              placeholder="Radius"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("radius", text)}
              value={inputs.radius}
            />
          </>
        )}

        {selectedShape === "line" && (
          <>
            <TextInput
              placeholder="Corner 1 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("lineCorner1", text)}
              value={inputs.lineCorner1}
            />
            <TextInput
              placeholder="Corner 2 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("lineCorner2", text)}
              value={inputs.lineCorner2}
            />
          </>
        )}

        {selectedShape === "rectangle" && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <TextInput
                key={i}
                placeholder={`Corner ${i} (x,y)`}
                style={styles.input}
                placeholderTextColor="#999"
                onChangeText={(text) =>
                  handleInputChange(`rectCorner${i}`, text)
                }
                value={inputs[`rectCorner${i}`]}
              />
            ))}
          </>
        )}

        <TouchableOpacity
          style={styles.buttonSave}
          onPress={() => setCalibrateIndex(shapes.length)}
        >
          <Text style={styles.buttonText}>Calibrate</Text>
        </TouchableOpacity>

        {renderCalibrateSection(shapes.length)}

        <Svg height="300" width="100%">
          {shapes.map((shape, index) => {
            const color = shape.bulbs.length ? "lime" : "gray";

            if (shape.type === "round") {
              const [cx, cy] = shape.coordinates.center?.split(",").map((v) => parseFloat(v.trim()));
              const r = parseFloat(shape.coordinates.radius);
              return <Circle key={index} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="2" />;
            }

            if (shape.type === "line") {
              const [x1, y1] = shape.coordinates.lineCorner1?.split(",").map((v) => parseFloat(v.trim()));
              const [x2, y2] = shape.coordinates.lineCorner2?.split(",").map((v) => parseFloat(v.trim()));
              return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />;
            }

            return null;
          })}
        </Svg>

        {shapes.map((s, i) => (
          <View key={i} style={styles.shapeCard}>
            <Text style={styles.instruction}>{s.name} - {s.type.toUpperCase()}</Text>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setCalibrateIndex(i)}
            >
              <Text style={styles.buttonText}>Calibrate</Text>
            </TouchableOpacity>
            {renderCalibrateSection(i)}
          </View>
        ))}

        {shapes.length > 0 && (
          <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShapeSelector;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", alignItems: "center" },
  title: { color: "#fff", fontSize: 24, marginVertical: 20 },
  buttonContainer: { flexDirection: "row" },
  button: { backgroundColor: "#FFD700", padding: 10, margin: 5, borderRadius: 8 },
  buttonText: { color: "#000", fontWeight: "bold" },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#555",
    borderWidth: 1,
  },
  bulbButton: {
    backgroundColor: "#888",
    padding: 8,
    margin: 4,
    borderRadius: 5,
  },
  buttonSave: { backgroundColor: "#28a745", padding: 10, borderRadius: 8, marginTop: 10 },
  buttonSecondary: { backgroundColor: "#555", padding: 10, borderRadius: 8, marginTop: 10 },
  buttonSubmit: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, margin: 20 },
  instruction: { color: "#fff" },
  calibrateBox: { backgroundColor: "#333", padding: 10, marginVertical: 10, borderRadius: 6 },
  shapeCard: { backgroundColor: "#222", padding: 10, marginVertical: 10, borderRadius: 6 },
});