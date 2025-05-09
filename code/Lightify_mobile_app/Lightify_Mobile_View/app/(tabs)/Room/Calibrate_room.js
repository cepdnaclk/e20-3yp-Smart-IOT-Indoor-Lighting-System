// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");

//   const renderShape = () => {
//     switch (selectedShape) {
//       case "round":
//         return <View style={styles.circle} />;
//       case "rectangle":
//         return <View style={styles.rectangle} />;
//       case "triangle":
//         return <View style={styles.triangle} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Select a Shape</Text>
      
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={() => setSelectedShape("round")}>
//           <Text style={styles.buttonText}>Round</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => setSelectedShape("rectangle")}>
//           <Text style={styles.buttonText}>Rectangle</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => setSelectedShape("triangle")}>
//           <Text style={styles.buttonText}>Triangle</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.shapeContainer}>
//         {renderShape()}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#111",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     color: "#fff",
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginBottom: 30,
//   },
//   button: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     marginHorizontal: 8,
//   },
//   buttonText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   shapeContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     height: 200,
//   },
//   circle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "red",
//   },
//   rectangle: {
//     width: 150,
//     height: 100,
//     backgroundColor: "green",
//   },
//   triangle: {
//     width: 0,
//     height: 0,
//     backgroundColor: "transparent",
//     borderStyle: "solid",
//     borderLeftWidth: 50,
//     borderRightWidth: 50,
//     borderBottomWidth: 100,
//     borderLeftColor: "transparent",
//     borderRightColor: "transparent",
//     borderBottomColor: "blue",
//   },
// });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
// } from "react-native";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [inputs, setInputs] = useState({});

//   const handleInputChange = (key, value) => {
//     setInputs({ ...inputs, [key]: value });
//   };

//   const renderShape = () => {
//     switch (selectedShape) {
//       case "round":
//         return <View style={styles.circle} />;
//       case "triangle":
//         return <View style={styles.rectangle} />;
//       case "line":
//         return <View style={styles.line} />;
//       default:
//         return null;
//     }
//   };

//   const renderInstructions = () => {
//     switch (selectedShape) {
//       case "round":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit on the center of the circle.
//             </Text>
//             <TextInput
//               placeholder="Center (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("center", text)}
//               value={inputs.center}
//             />
//             <TextInput
//               placeholder="Radius"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("radius", text)}
//               value={inputs.radius}
//             />
//           </>
//         );
//       case "line":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit each two corners of the line and submit the
//               coordinates.
//             </Text>
//             <TextInput
//               placeholder="Corner 1 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("lineCorner1", text)}
//               value={inputs.lineCorner1}
//             />
//             <TextInput
//               placeholder="Corner 2 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("lineCorner2", text)}
//               value={inputs.lineCorner2}
//             />
//           </>
//         );
//       case "rectangle":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit 4 corners and obtain the coordinate and submit it.
//             </Text>
//             <TextInput
//               placeholder="Corner 1 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner1", text)}
//               value={inputs.rectCorner1}
//             />
//             <TextInput
//               placeholder="Corner 2 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner2", text)}
//               value={inputs.rectCorner2}
//             />
//             <TextInput
//               placeholder="Corner 3 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner3", text)}
//               value={inputs.rectCorner3}
//             />
//             <TextInput
//               placeholder="Corner 4 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner4", text)}
//               value={inputs.rectCorner4}
//             />
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Select a Shape</Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("round")}
//         >
//           <Text style={styles.buttonText}>Round</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("line")}
//         >
//           <Text style={styles.buttonText}>Line</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("rectangle")}
//         >
//           <Text style={styles.buttonText}>Rectangle</Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("triangle")}
//         >
//           <Text style={styles.buttonText}>Triangle</Text>
//         </TouchableOpacity> */}
//       </View>

//       <View style={styles.shapeContainer}>{renderShape()}</View>

//       <View style={{ padding: 10, width: "90%" }}>{renderInstructions()}</View>
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#111",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     color: "#fff",
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     margin: 5,
//   },
//   buttonText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   shapeContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     height: 150,
//   },
//   circle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "red",
//   },
//   triangle: {
//     width: 0,
//     height: 0,
//     backgroundColor: "transparent",
//     borderStyle: "solid",
//     borderLeftWidth: 50,
//     borderRightWidth: 50,
//     borderBottomWidth: 100,
//     borderLeftColor: "transparent",
//     borderRightColor: "transparent",
//     borderBottomColor: "blue",
//   },
//   line: {
//     width: 150,
//     height: 2,
//     backgroundColor: "cyan",
//   },
//   instruction: {
//     color: "#fff",
//     fontSize: 16,
//     marginVertical: 8,
//   },
//   input: {
//     backgroundColor: "#222",
//     color: "#fff",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//     borderColor: "#555",
//     borderWidth: 1,
//   },
// });




// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
// } from "react-native";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [inputs, setInputs] = useState({});

//   const handleInputChange = (key, value) => {
//     setInputs({ ...inputs, [key]: value });
//   };

//   const renderShape = () => {
//     switch (selectedShape) {
//       case "round":
//         return <View style={styles.circle} />;
//       case "rectangle":
//         return <View style={styles.rectangle} />;
//       case "line":
//         return <View style={styles.line} />;
//       default:
//         return null;
//     }
//   };

//   const renderInstructions = () => {
//     switch (selectedShape) {
//       case "round":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit on the center of the circle.
//             </Text>
//             <TextInput
//               placeholder="Center (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("center", text)}
//               value={inputs.center}
//             />
//             <TextInput
//               placeholder="Radius"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("radius", text)}
//               value={inputs.radius}
//             />
//           </>
//         );
//       case "line":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit each two corners of the line and submit the coordinates.
//             </Text>
//             <TextInput
//               placeholder="Corner 1 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("lineCorner1", text)}
//               value={inputs.lineCorner1}
//             />
//             <TextInput
//               placeholder="Corner 2 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("lineCorner2", text)}
//               value={inputs.lineCorner2}
//             />
//           </>
//         );
//       case "rectangle":
//         return (
//           <>
//             <Text style={styles.instruction}>
//               Please sit 4 corners and obtain the coordinate and submit it.
//             </Text>
//             <TextInput
//               placeholder="Corner 1 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner1", text)}
//               value={inputs.rectCorner1}
//             />
//             <TextInput
//               placeholder="Corner 2 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner2", text)}
//               value={inputs.rectCorner2}
//             />
//             <TextInput
//               placeholder="Corner 3 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner3", text)}
//               value={inputs.rectCorner3}
//             />
//             <TextInput
//               placeholder="Corner 4 (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               onChangeText={(text) => handleInputChange("rectCorner4", text)}
//               value={inputs.rectCorner4}
//             />
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Select a Shape</Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("round")}
//         >
//           <Text style={styles.buttonText}>Round</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("line")}
//         >
//           <Text style={styles.buttonText}>Line</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setSelectedShape("rectangle")}
//         >
//           <Text style={styles.buttonText}>Rectangle</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.shapeContainer}>{renderShape()}</View>

//       <View style={{ padding: 10, width: "90%" }}>{renderInstructions()}</View>
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#111",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     color: "#fff",
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     margin: 5,
//   },
//   buttonText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   shapeContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     height: 150,
//   },
//   circle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "red",
//   },
//   rectangle: {
//     width: 150,
//     height: 100,
//     backgroundColor: "green",
//   },
//   line: {
//     width: 150,
//     height: 2,
//     backgroundColor: "cyan",
//   },
//   instruction: {
//     color: "#fff",
//     fontSize: 16,
//     marginVertical: 8,
//   },
//   input: {
//     backgroundColor: "#222",
//     color: "#fff",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//     borderColor: "#555",
//     borderWidth: 1,
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";

const ShapeRadarScreen = () => {
  // ——— Radar/WebSocket state ———
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [shapesData, setShapesData] = useState([]);
  const [status, setStatus] = useState("Connecting...");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ——— Shape selector state ———
  const [selectedShape, setSelectedShape] = useState("round");
  const [inputs, setInputs] = useState({});

  // WebSocket setup with auto-reconnect
  useEffect(() => {
    let ws;
    const connect = () => {
      ws = new WebSocket("ws://192.168.7.115:81");

      ws.onopen = () => {
        console.log("✅ WS connected");
        setStatus("Connected");
      };
      ws.onerror = (e) => {
        console.warn("⚠ WS error", e.message);
        setStatus("Error");
      };
      ws.onmessage = ({ data }) => {
        console.log("📡 Raw:", data);
        try {
          const msg = JSON.parse(data);

          if (typeof msg.x === "number" && typeof msg.y === "number") {
            console.log(`🛰 Got coords X:${msg.x} Y:${msg.y}`);
            setCoordinates({ x: msg.x, y: msg.y });
            setLastUpdated(new Date().toLocaleTimeString());
          }

          if (Array.isArray(msg.shapes)) {
            console.log("🗺 Shapes list:", msg.shapes);
            setShapesData(msg.shapes);
          }
        } catch (err) {
          console.warn("❌ JSON parse err", err.message);
        }
      };
      ws.onclose = (evt) => {
        console.log("🔌 WS closed, code=", evt.code);
        setStatus("Reconnecting...");
        setTimeout(connect, 1000);
      };
    };

    connect();
    return () => {
      ws.onclose = null;
      ws.close();
    };
  }, []);

  // Handle user input for shape parameters
  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Draw the selected shape
  const renderShape = () => {
    switch (selectedShape) {
      case "round":
        return <View style={styles.circle} />;
      case "line":
        return <View style={styles.line} />;
      case "rectangle":
        return <View style={styles.rectangle} />;
      default:
        return null;
    }
  };

  // Show appropriate instructions & input fields
  const renderInstructions = () => {
    switch (selectedShape) {
      case "round":
        return (
          <>
            <Text style={styles.instruction}>
              Sit at the center of the circle. Live coords will update below.
            </Text>
            <TextInput
              placeholder="Radius"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={(t) => handleInputChange("radius", t)}
              value={inputs.radius || ""}
            />
          </>
        );
      case "line":
        return (
          <>
            <Text style={styles.instruction}>
              Sit at each end of the line. Live coords will update below.
            </Text>
            <TextInput
              placeholder="Line length or label"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={(t) => handleInputChange("label", t)}
              value={inputs.label || ""}
            />
          </>
        );
      case "rectangle":
        return (
          <>
            <Text style={styles.instruction}>
              Sit at each of the 4 corners. Live coords will update below.
            </Text>
            <TextInput
              placeholder="Label or notes"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={(t) => handleInputChange("note", t)}
              value={inputs.note || ""}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Handle submit
  const handleSubmit = () => {
    const payload = {
      shape: selectedShape,
      params: inputs,
      liveCoords: coordinates,
      timestamp: lastUpdated,
    };
    console.log("📤 Submit payload:", payload);
    // TODO: replace with real API call if needed
    // fetch("/api/submitShape", { method:"POST", body: JSON.stringify(payload) })
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Shape</Text>

      {/* Shape buttons */}
      <View style={styles.buttonContainer}>
        {["round", "line", "rectangle"].map((shape) => (
          <TouchableOpacity
            key={shape}
            style={[
              styles.button,
              selectedShape === shape && styles.buttonActive,
            ]}
            onPress={() => {
              setSelectedShape(shape);
              setInputs({});
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedShape === shape && styles.buttonTextActive,
              ]}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shape Preview */}
      <View style={styles.shapeContainer}>{renderShape()}</View>

      {/* Instructions & Inputs */}
      <ScrollView style={styles.instructionsContainer}>
        {renderInstructions()}

        {/* Live Coordinates Display */}
        <View style={styles.liveCoords}>
          <Text style={styles.liveCoordsTitle}>Live Coordinates:</Text>
          <Text style={styles.liveCoordsText}>
            X: {coordinates.x}, Y: {coordinates.y}
          </Text>
          <Text style={styles.lastUpdated}>
            Last Updated: {lastUpdated || "Waiting..."}
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Optionally show server-sent shapes list */}
        <Text style={styles.subheading}>Saved Shapes from Server:</Text>
        {shapesData.length === 0 ? (
          <Text style={styles.noShapes}>None</Text>
        ) : (
          shapesData.map((s, i) => (
            <View key={i} style={styles.shapeCard}>
              <Text style={styles.shapeTitle}>
                {s.name} ({s.type})
              </Text>
              <Text>Equation: {s.equation}</Text>
              {Array.isArray(s.x) &&
                s.x.map((xVal, idx) => (
                  <Text key={idx}>
                    X: {xVal}, Y: {s.y[idx]}
                  </Text>
                ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShapeRadarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonActive: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontWeight: "600",
    color: "#333",
  },
  buttonTextActive: {
    color: "#fff",
  },
  shapeContainer: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "red",
  },
  rectangle: {
    width: 150,
    height: 100,
    backgroundColor: "green",
  },
  line: {
    width: 150,
    height: 2,
    backgroundColor: "cyan",
  },
  instructionsContainer: {
    width: "90%",
    marginTop: 8,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  liveCoords: {
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  liveCoordsTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  liveCoordsText: {
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  subheading: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  noShapes: {
    color: "#666",
    marginBottom: 12,
  },
  shapeCard: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    marginBottom: 8,
  },
  shapeTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
