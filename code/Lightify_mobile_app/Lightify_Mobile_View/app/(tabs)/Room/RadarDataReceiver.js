




// import { useLocalSearchParams } from "expo-router"; // add this
// import { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
// import axiosClient from "../../../utils/axiosClient"; // make sure path is correct
// import RuleManager from "./RuleManager";

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [instructionVisible, setInstructionVisible] = useState(false);
//   const [instructionText, setInstructionText] = useState("");
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);
//   const [calibrationStates, setCalibrationStates] = useState({});
//   const [calibratingIndex, setCalibratingIndex] = useState(null); // modal state

//   const handleShapeSelect = (type) => {
//   let message = "";
//   if (type === "Light Zone") {
//     message =
//       "1. Give a name for Light Zone (eg. Light1)\n2. Sit at the center of the light zone and click 'Use Current Pos'\n3. Then press the Save button.";
//   } else if (type === "Door") {
//     message =
//       "1. Give a name for the Door (eg. Door1)\n2. Sit at the two corners of the door and click 'Use Current Pos'\n3. Then press the Save button.";
//   } else if (type === "Bed/Table") {
//     message =
//       "1. Give a name for the Bed or Table (eg. Bed1/Table1)\n2. Sit at the four corners of the bed or table and click 'Use Current Pos'\n3. Then press the Save button.";
//   }

//   setSelectedShape(type);
//   setInstructionText(message);
//   setInstructionVisible(true);
// };


//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

  

//   const { roomName, username } = useLocalSearchParams(); // from route
// // fallback if null
// const ROOM_NAME = roomName || "Bathroom";
// const USERNAME = username || "Tharindu";

// useEffect(() => {
//   const wsInstance = new WebSocket("ws://192.168.8.100:81");
//   ws.current = wsInstance;

//   wsInstance.onopen = () => {
//     console.log("✅ WebSocket connected");
//     wsInstance.send(JSON.stringify({ username: "Topic" }));
//   };

//   wsInstance.onmessage = (e) => {
//     try {
//       const data = JSON.parse(e.data);
//       console.log("📥 WS Received:", data);

//       if (typeof data.x === "number" && typeof data.y === "number") {
//         setLiveCoords({ x: data.x, y: data.y });
//       }
//     } catch (err) {
//       console.warn("❌ WS JSON error:", err);
//     }
//   };

//   wsInstance.onerror = (e) => console.error("WS error", e.message);
//   wsInstance.onclose = () => console.log("WebSocket closed");

//   return () => {
//     wsInstance.close();
//   };
// }, []);

// useEffect(() => {
//   const fetchShapes = async () => {
//     try {
//       const response = await axiosClient.get(
//         `/api/rooms/configure?username=${USERNAME}&roomName=${ROOM_NAME}`
//       );

//       if (
//         response.status === 200 &&
//         response.data &&
//         Array.isArray(response.data.Areas)
//       ) {
//         setShapes(response.data.Areas);
//         console.log("🎯 Shapes loaded from backend");
//       } else {
//         console.warn("⚠️ No shapes found in response");
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch shapes:", err);
//     }
//   };

//   fetchShapes();
// }, [USERNAME, ROOM_NAME]);


//     // helper math
//   const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
//   const originX = canvasWidth / 2;
//   const originY = 0;
//   const toPxX = x => originX + x * scale;
//   const toPxY = y => originY + (-y) * scale; // y is negative downwards

//   // parse helpers
//   const parseCircleEquation = eq => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/\(x-([-\d.]+)\)\^2\+\(y-([-\d.]+)\)\^2=([-\d.]+)/);
//     if (!m) return null;
//     return { h: +m[1], k: +m[2], r: Math.sqrt(+m[3]) };
//   };

//   const parseLineEquation = eq => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/y=([-\d.]+)x([+-][\d.]+)/i);
//     if (!m) return null;
//     return { m: +m[1], b: +m[2] };
//   };

//   const parsePair = s => {
//     const [x, y] = s.split(",").map(Number);
//     return { x, y };
//   };

//   // input, autofill, validate, modal handlers
//   const handleInputChange = (k, v) =>
//     setInputs(prev => ({ ...prev, [k]: v }));
//   const autofill = k =>
//     handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);
//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "Light Zone") return inputs.center && inputs.radius;
//     if (selectedShape === "Door")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "Bed/Table")
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     return true;
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("Light Zone");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "Light Zone" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "Door") {
//       ni.lineCorner1 = `${s.x[0]},${s.y[0]}`;
//       ni.lineCorner2 = `${s.x[1]},${s.y[1]}`;
//     } else {
//       s.x.forEach((_, idx) => {
//         ni[`rectCorner${idx + 1}`] = `${s.x[idx]},${s.y[idx]}`;
//       });
//     }
//     setInputs(ni);
//     setEditingIndex(i);
//     setModalVisible(true);
//   };

//   const handleSubmit = () => {
//     if (!validate()) {
//       Alert.alert("Error", "Fill name & all fields.");
//       return;
//     }
//     let shape = {
//       type: selectedShape === "Light Zone" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "Light Zone") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "Door") {
//       const p1 = parsePair(inputs.lineCorner1);
//       const p2 = parsePair(inputs.lineCorner2);
//       const m = ((p2.y - p1.y) / (p2.x - p1.x)).toFixed(3);
//       const b = (p1.y - m * p1.x).toFixed(1);
//       shape.equation = `y = ${m}x ${b >= 0 ? "+" + b : b}`;
//       shape.x = [p1.x, p2.x];
//       shape.y = [p1.y, p2.y];
//     } else {
//       const corners = [1, 2, 3, 4].map(n =>
//         parsePair(inputs[`rectCorner${n}`])
//       );
//       shape.equation = `Rectangle with corners ${corners
//         .map(p => `(${p.x},${p.y})`)
//         .join(", ")}`;
//       shape.x = corners.map(p => p.x);
//       shape.y = corners.map(p => p.y);
//     }

//     ws.current.send(
//       JSON.stringify({
//         action: editingIndex != null ? "update" : "add",
//         index: editingIndex,
//         shape,
//       })
//     );

//     // **Immediately** reflect it locally, so it never disappears
//     setShapes(prev => {
//       if (editingIndex != null) {
//         const copy = [...prev];
//         copy[editingIndex] = shape;
//         return copy;
//       }
//       return [...prev, shape];
//     });

//     setModalVisible(false);
//   };

//   const handleDelete = i =>
//     Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () =>
//           ws.current.send(JSON.stringify({ action: "delete", index: i })),
//       },
//     ]);

//   const handleCalibrate = (i) => {
//     setCalibratingIndex(i); // open modal
//     setCalibrationStates(prev => ({
//       ...prev,
//       [i]: {
//         bulbs: prev[i]?.bulbs || [false, false, false, false],
//         submitted: false,
//       },
//     }));
//   };


// const toggleBulb = (i, bulbIdx) => {
//   setCalibrationStates(prev => {
//     const bulbs = [...(prev[i]?.bulbs || [false, false, false, false])];
//     bulbs[bulbIdx] = !bulbs[bulbIdx];
//     return {
//       ...prev,
//       [i]: {
//         ...prev[i],
//         bulbs,
//         submitted: false,
//       },
//     };
//   });
// };

// const handleCalibrationSubmit = () => {
//   if (calibratingIndex === null) return;
//   setCalibrationStates(prev => ({
//     ...prev,
//     [calibratingIndex]: {
//       ...prev[calibratingIndex],
//       submitted: true,
//     },
//   }));
//   setCalibratingIndex(null); // close modal
// };



//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["Light Zone", "Door", "Bed/Table"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => handleShapeSelect(t)}
//           >
//             <Text
//               style={[
//                 styles.buttonText,
//                 selectedShape === t && styles.activeText,
//               ]}
//             >
//               {t.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <TextInput
//         placeholder="Shape Name"
//         style={styles.input}
//         placeholderTextColor="#999"
//         value={shapeName}
//         onChangeText={setShapeName}
//       />
//       {selectedShape === "Light Zone" && (
//         <>
//           <TextInput
//             placeholder="Center (x,y)"
//             style={styles.input}
//             value={inputs.center || ""}
//             onChangeText={t => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius (mm)"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius || ""}
//             onChangeText={t => handleInputChange("radius", t)}
//           />
//         </>
//       )}
//       {selectedShape === "Door" &&
//         [1, 2].map(n => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={t => handleInputChange(`lineCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       {selectedShape === "Bed/Table" &&
//         [1, 2, 3, 4].map(n => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={t => handleInputChange(`rectCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Room Blueprint</Text>
//       <View
//         style={styles.svgContainer}
//         onLayout={e => {
//           setCanvasWidth(e.nativeEvent.layout.width);
//           setCanvasHeight(e.nativeEvent.layout.height);
//         }}
//       >
//         {canvasWidth > 0 && (
//           <Svg width={canvasWidth} height={canvasHeight}>
//             {/* background */}
//             <Rect
//               x={0}
//               y={0}
//               width={canvasWidth}
//               height={canvasHeight}
//               fill="#ccffcc"
//             />
//             {/* axes */}
//             <Line
//               x1={originX}
//               y1={0}
//               x2={originX}
//               y2={canvasHeight}
//               stroke="gray"
//               strokeWidth={1}
//             />
//             <Line
//               x1={0}
//               y1={0}
//               x2={canvasWidth}
//               y2={0}
//               stroke="gray"
//               strokeWidth={1}
//             />
//             {/* sensor semicircle */}
//             <Path
//               d={`
//                 M ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
//                 A ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
//                   ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}
//               `}
//               fill="rgba(0,255,0,0.1)"
//               stroke="green"
//               strokeWidth={2}
//             />
//             {/* user-defined shapes */}
//             {shapes.map((s, i) => {
//               if (s.type === "point") {
//                 const c = parseCircleEquation(s.equation);
//                 if (!c) return null;
//                 return (
//                   <Circle
//                     key={i}
//                     cx={toPxX(c.h)}
//                     cy={toPxY(c.k)}
//                     r={c.r * scale}
//                     fill="rgba(255,68,0,0.6)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Door") {
//                 const l = parseLineEquation(s.equation);
//                 if (!l) return null;
//                 const xMin = -REAL_WORLD_RADIUS;
//                 const xMax = REAL_WORLD_RADIUS;
//                 const y1 = l.m * xMin + l.b;
//                 const y2 = l.m * xMax + l.b;
//                 return (
//                   <Line
//                     key={i}
//                     x1={toPxX(xMin)}
//                     y1={toPxY(y1)}
//                     x2={toPxX(xMax)}
//                     y2={toPxY(y2)}
//                     stroke="cyan"
//                     strokeWidth={2}
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Bed/Table") {
//                 const xMin = Math.min(...s.x);
//                 const xMax = Math.max(...s.x);
//                 const yMin = Math.min(...s.y);
//                 const yMax = Math.max(...s.y);
//                 return (
//                   <Rect
//                     key={i}
//                     x={toPxX(xMin)}
//                     y={toPxY(yMax)}
//                     width={(xMax - xMin) * scale}
//                     height={(yMax - yMin) * scale}
//                     stroke="purple"
//                     strokeWidth={2}
//                     fill="rgba(128,0,128,0.3)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               return null;
//             })}
//             {/* live user dot */}
//             <Circle
//               cx={toPxX(liveCoords.x)}
//               cy={toPxY(liveCoords.y)}
//               r={4}
//               fill="red"
//             />
//           </Svg>
//         )}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>Add Room Feature</Text>
//       </TouchableOpacity>

// <ScrollView style={styles.list}>
//   {shapes.map((s, i) => (
//     <View key={i} style={styles.listItem}>
//       {/* ✅ Shape Name */}
//       <Text style={styles.itemText}>
//         {s.name} ({s.type})
//       </Text>

//       {/* ✅ Action Buttons */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => openModalForEdit(i)}>
//           <Text style={styles.updateBtn}>🛠️ Update</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleDelete(i)}>
//           <Text style={styles.deleteBtn}>🗑️ Delete</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleCalibrate(i)}>
//           <Text style={styles.calibrateBtn}>🔧 Calibrate</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🔆 Show only the submitted result here */}
//       {calibrationStates[i]?.submitted && (
//         <Text style={styles.calibrationResult}>
//           🔆 Bulbs ON:{" "}
//           {calibrationStates[i].bulbs
//             .map((on, idx) => (on ? `Bulb ${idx + 1}` : null))
//             .filter(Boolean)
//             .join(", ") || "None"}
//         </Text>
//       )}
//     </View>
//   ))}
//   <RuleManager shapes={shapes} />
// </ScrollView>


//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>{renderInputs()}</ScrollView>
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//                 <Text style={styles.submitText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, styles.cancelBtn]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.submitText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal
//   visible={instructionVisible}
//   transparent
//   animationType="fade"
//   onRequestClose={() => setInstructionVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={{ color: "#FFD700", marginBottom: 20, fontSize: 16 }}>
//         {instructionText}
//       </Text>
//       <TouchableOpacity
//         style={styles.submitBtn}
//         onPress={() => setInstructionVisible(false)}
//       >
//         <Text style={styles.submitText}>OK</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>

//       <Modal
//   visible={calibratingIndex !== null}
//   transparent
//   animationType="slide"
//   onRequestClose={() => setCalibratingIndex(null)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.calibrationTitle}>Calibrate Bulbs</Text>

//       <View style={styles.bulbRow}>
//         {[0, 1, 2, 3].map((bulbIdx) => (
//           <TouchableOpacity
//             key={bulbIdx}
//             onPress={() => toggleBulb(calibratingIndex, bulbIdx)}
//             style={[
//               styles.bulb,
//               calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] && styles.bulbOn,
//             ]}
//           >
//             <Text style={styles.bulbText}>
//               💡 {calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] ? "ON" : "OFF"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.modalActions}>
//         <TouchableOpacity
//           style={styles.submitBtn}
//           onPress={handleCalibrationSubmit}
//         >
//           <Text style={styles.submitText}>Submit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.submitBtn, styles.cancelBtn]}
//           onPress={() => setCalibratingIndex(null)}
//         >
//           <Text style={styles.submitText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
//   heading: { color: "#FFD700", fontSize: 24, marginVertical: 12 },
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//   },

//   heading: {
//     color: "#FFD700",
//     fontSize: 24,
//     marginVertical: 12,
//   },

//   svgContainer: {
//     width: "90%",
//     aspectRatio: 2, // 2:1 rectangle
//     borderRadius: 6,
//     overflow: "hidden",
//   },

//   list: {
//     width: "90%",
//     marginTop: 12,
//   },

//   listItem: {
//     flexDirection: "column",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },

//   itemText: {
//     color: "#FFD700",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   actions: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginTop: 8,
//     marginBottom: 6,
//   },

//   updateBtn: {
//     color: "#0af",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   deleteBtn: {
//     color: "#f55",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   calibrateBtn: {
//     color: "#0f0",
//     fontWeight: "bold",
//   },

//   calibrationResult: {
//     color: "#FFD700",
//     marginTop: 6,
//     fontStyle: "italic",
//     alignSelf: "flex-start",
//   },

//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },

//   addBtnText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   input: {
//     backgroundColor: "#222",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },

//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 12,
//     textDecorationLine: "underline",
//   },

//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },

//   button: {
//     padding: 8,
//     margin: 4,
//     backgroundColor: "#222",
//     borderRadius: 6,
//   },

//   activeBtn: {
//     backgroundColor: "#FFD700",
//   },

//   buttonText: {
//     color: "#FFD700",
//   },

//   activeText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   // 🔲 Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modalContent: {
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 10,
//     width: "85%",
//     maxHeight: "80%",
//     alignItems: "center",
//   },

//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: 16,
//   },

//   calibrationTitle: {
//     color: "#FFD700",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//     textAlign: "center",
//   },

//   bulbRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     flexWrap: "wrap",
//     marginVertical: 16,
//   },

//   bulb: {
//     padding: 12,
//     backgroundColor: "#555",
//     borderRadius: 8,
//     margin: 6,
//   },

//   bulbOn: {
//     backgroundColor: "#00ff00",
//   },

//   bulbText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },

//   cancelBtn: {
//     backgroundColor: "#555",
//   },

//   submitText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });




// import { useLocalSearchParams } from "expo-router"; // add this
// import { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
// import axiosClient from "../../../utils/axiosClient"; // make sure path is correct
// import RuleManager from "./RuleManager";

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [instructionVisible, setInstructionVisible] = useState(false);
//   const [instructionText, setInstructionText] = useState("");
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);
//   const [calibrationStates, setCalibrationStates] = useState({});
//   const [calibratingIndex, setCalibratingIndex] = useState(null); // modal state

//   const handleShapeSelect = (type) => {
//   let message = "";
//   if (type === "Light Zone") {
//     message =
//       "1. Give a name for Light Zone (eg. Light1)\n2. Sit at the center of the light zone and click 'Use Current Pos'\n3. Then press the Save button.";
//   } else if (type === "Door") {
//     message =
//       "1. Give a name for the Door (eg. Door1)\n2. Sit at the two corners of the door and click 'Use Current Pos'\n3. Then press the Save button.";
//   } else if (type === "Bed/Table") {
//     message =
//       "1. Give a name for the Bed or Table (eg. Bed1/Table1)\n2. Sit at the four corners of the bed or table and click 'Use Current Pos'\n3. Then press the Save button.";
//   }

//   setSelectedShape(type);
//   setInstructionText(message);
//   setInstructionVisible(true);
// };


//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

  

//   const { roomName, username } = useLocalSearchParams(); // from route
// // fallback if null
// const ROOM_NAME = roomName || "Bathroom";
// const USERNAME = username || "Tharindu";

// useEffect(() => {
//   const wsInstance = new WebSocket("ws://192.168.8.100:81");
//   ws.current = wsInstance;

//   wsInstance.onopen = () => {
//     console.log("✅ WebSocket connected");
//     wsInstance.send(JSON.stringify({ username: "Topic" }));
//   };

//   wsInstance.onmessage = (e) => {
//   try {
//     const data = JSON.parse(e.data);
//     console.log("📥 WS Received:", data);

//     // If the server is sending { command: "coordinates", payload: { seq: …, x: …, y: … } }
//     if (data.command === "coordinates" && data.payload) {
//       const { x, y } = data.payload;
//       if (typeof x === "number" && typeof y === "number") {
//         setLiveCoords({ x, y });
//       }
//     }
//     // (You can handle other `command` types here, too, e.g. if command==="status" or similar.)
//   } catch (err) {
//     console.warn("❌ WS JSON error:", err);
//   }
// };

//   wsInstance.onerror = (e) => console.error("WS error", e.message);
//   wsInstance.onclose = () => console.log("WebSocket closed");

//   return () => {
//     wsInstance.close();
//   };
// }, []);

// const [roomConfig, setRoomConfig] = useState(null);

// useEffect(() => {
//   const fetchConfig = async () => {
//     try {
//       const response = await axiosClient.get(
//         `/api/rooms/configure?username=${USERNAME}&roomName=${ROOM_NAME}`
//       );

//       if (response.status === 200 && response.data) {
//         setRoomConfig(response.data);
//         setShapes(response.data.Areas || []);
//         console.log("✅ Room config loaded");
//       } else {
//         console.warn("⚠️ No config found in response");
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch config:", err);
//     }
//   };

//   fetchConfig();
// }, [USERNAME, ROOM_NAME]);


//     // helper math
//   const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
//   const originX = canvasWidth / 2;
//   const originY = 0;
//   const toPxX = x => originX + x * scale;
//   const toPxY = y => originY + (-y) * scale; // y is negative downwards

//   // parse helpers
//   const parseCircleEquation = eq => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/\(x-([-\d.]+)\)\^2\+\(y-([-\d.]+)\)\^2=([-\d.]+)/);
//     if (!m) return null;
//     return { h: +m[1], k: +m[2], r: Math.sqrt(+m[3]) };
//   };

//   const parseLineEquation = eq => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/y=([-\d.]+)x([+-][\d.]+)/i);
//     if (!m) return null;
//     return { m: +m[1], b: +m[2] };
//   };

//   const parsePair = s => {
//     const [x, y] = s.split(",").map(Number);
//     return { x, y };
//   };

//   // input, autofill, validate, modal handlers
//   const handleInputChange = (k, v) =>
//     setInputs(prev => ({ ...prev, [k]: v }));
//   const autofill = k =>
//     handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);
//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "Light Zone") return inputs.center && inputs.radius;
//     if (selectedShape === "Door")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "Bed/Table")
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     return true;
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("Light Zone");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "Light Zone" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "Door") {
//       ni.lineCorner1 = `${s.x[0]},${s.y[0]}`;
//       ni.lineCorner2 = `${s.x[1]},${s.y[1]}`;
//     } else {
//       s.x.forEach((_, idx) => {
//         ni[`rectCorner${idx + 1}`] = `${s.x[idx]},${s.y[idx]}`;
//       });
//     }
//     setInputs(ni);
//     setEditingIndex(i);
//     setModalVisible(true);
//   };

//   const handleSubmit = () => {
//     if (!validate()) {
//       Alert.alert("Error", "Fill name & all fields.");
//       return;
//     }
//     let shape = {
//       type: selectedShape === "Light Zone" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "Light Zone") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "Door") {
//       const p1 = parsePair(inputs.lineCorner1);
//       const p2 = parsePair(inputs.lineCorner2);
//       const m = ((p2.y - p1.y) / (p2.x - p1.x)).toFixed(3);
//       const b = (p1.y - m * p1.x).toFixed(1);
//       shape.equation = `y = ${m}x ${b >= 0 ? "+" + b : b}`;
//       shape.x = [p1.x, p2.x];
//       shape.y = [p1.y, p2.y];
//     } else {
//       const corners = [1, 2, 3, 4].map(n =>
//         parsePair(inputs[`rectCorner${n}`])
//       );
//       shape.equation = `Rectangle with corners ${corners
//         .map(p => `(${p.x},${p.y})`)
//         .join(", ")}`;
//       shape.x = corners.map(p => p.x);
//       shape.y = corners.map(p => p.y);
//     }

//     ws.current.send(
//       JSON.stringify({
//         action: editingIndex != null ? "update" : "add",
//         index: editingIndex,
//         shape,
//       })
//     );

// setModalVisible(false);

// const updatedShapes = editingIndex != null
//   ? [...shapes.slice(0, editingIndex), shape, ...shapes.slice(editingIndex + 1)]
//   : [...shapes, shape];

// submitToBackend(updatedShapes);


//     // **Immediately** reflect it locally, so it never disappears
//     setShapes(prev => {
//       if (editingIndex != null) {
//         const copy = [...prev];
//         copy[editingIndex] = shape;
//         return copy;
//       }
//       return [...prev, shape];
//     });

//     setModalVisible(false);
//   };


//   const submitToBackend = async (newShapes) => {
//   if (!roomConfig) {
//     console.warn("⚠️ Room config not loaded yet.");
//     return;
//   }

//   const updatedConfig = {
//     ...roomConfig,
//     Areas: newShapes,
//   };

//   try {
//     const response = await axiosClient.post("/api/rooms/configure", updatedConfig);

//     if (response.status === 200) {
//       console.log("✅ Room configuration updated");
//     } else {
//       console.warn("⚠️ Unexpected response", response.status);
//     }
//   } catch (error) {
//     console.error("❌ Failed to update config:", error);
//   }
// };



// const handleDelete = i =>
//   Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
//     { text: "Cancel", style: "cancel" },
//     {
//       text: "Delete",
//       style: "destructive",
//       onPress: () => {
//         const newShapes = shapes.filter((_, idx) => idx !== i);
//         setShapes(newShapes);
//         submitToBackend(newShapes); // ← update backend
//         ws.current.send(JSON.stringify({ action: "delete", index: i }));
//       },
//     },
//   ]);


//   const handleCalibrate = (i) => {
//     setCalibratingIndex(i); // open modal
//     setCalibrationStates(prev => ({
//       ...prev,
//       [i]: {
//         bulbs: prev[i]?.bulbs || [false, false, false, false],
//         submitted: false,
//       },
//     }));
//   };


// const toggleBulb = (i, bulbIdx) => {
//   setCalibrationStates(prev => {
//     const bulbs = [...(prev[i]?.bulbs || [false, false, false, false])];
//     bulbs[bulbIdx] = !bulbs[bulbIdx];
//     return {
//       ...prev,
//       [i]: {
//         ...prev[i],
//         bulbs,
//         submitted: false,
//       },
//     };
//   });
// };

// const handleCalibrationSubmit = () => {
//   if (calibratingIndex === null) return;
//   setCalibrationStates(prev => ({
//     ...prev,
//     [calibratingIndex]: {
//       ...prev[calibratingIndex],
//       submitted: true,
//     },
//   }));
//   setCalibratingIndex(null); // close modal
// };



//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["Light Zone", "Door", "Bed/Table"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => handleShapeSelect(t)}
//           >
//             <Text
//               style={[
//                 styles.buttonText,
//                 selectedShape === t && styles.activeText,
//               ]}
//             >
//               {t.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <TextInput
//         placeholder="Shape Name"
//         style={styles.input}
//         placeholderTextColor="#999"
//         value={shapeName}
//         onChangeText={setShapeName}
//       />
//       {selectedShape === "Light Zone" && (
//         <>
//           <TextInput
//             placeholder="Center (x,y)"
//             style={styles.input}
//             value={inputs.center || ""}
//             onChangeText={t => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius (mm)"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius || ""}
//             onChangeText={t => handleInputChange("radius", t)}
//           />
//         </>
//       )}
//       {selectedShape === "Door" &&
//         [1, 2].map(n => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={t => handleInputChange(`lineCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       {selectedShape === "Bed/Table" &&
//         [1, 2, 3, 4].map(n => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={t => handleInputChange(`rectCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Room Blueprint</Text>
//       <View
//         style={styles.svgContainer}
//         onLayout={e => {
//           setCanvasWidth(e.nativeEvent.layout.width);
//           setCanvasHeight(e.nativeEvent.layout.height);
//         }}
//       >
//         {canvasWidth > 0 && (
//           <Svg width={canvasWidth} height={canvasHeight}>
//             {/* background */}
//             <Rect
//               x={0}
//               y={0}
//               width={canvasWidth}
//               height={canvasHeight}
//               fill="#ccffcc"
//             />
//             {/* axes */}
//             <Line
//               x1={originX}
//               y1={0}
//               x2={originX}
//               y2={canvasHeight}
//               stroke="gray"
//               strokeWidth={1}
//             />
//             <Line
//               x1={0}
//               y1={0}
//               x2={canvasWidth}
//               y2={0}
//               stroke="gray"
//               strokeWidth={1}
//             />
//             {/* sensor semicircle */}
//             <Path
//               d={`
//                 M ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
//                 A ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
//                   ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}
//               `}
//               fill="rgba(0,255,0,0.1)"
//               stroke="green"
//               strokeWidth={2}
//             />
//             {/* user-defined shapes */}
//             {shapes.map((s, i) => {
//               if (s.type === "point") {
//                 const c = parseCircleEquation(s.equation);
//                 if (!c) return null;
//                 return (
//                   <Circle
//                     key={i}
//                     cx={toPxX(c.h)}
//                     cy={toPxY(c.k)}
//                     r={c.r * scale}
//                     fill="rgba(255,68,0,0.6)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Door") {
//                 const l = parseLineEquation(s.equation);
//                 if (!l) return null;
//                 const xMin = -REAL_WORLD_RADIUS;
//                 const xMax = REAL_WORLD_RADIUS;
//                 const y1 = l.m * xMin + l.b;
//                 const y2 = l.m * xMax + l.b;
//                 return (
//                   <Line
//                     key={i}
//                     x1={toPxX(xMin)}
//                     y1={toPxY(y1)}
//                     x2={toPxX(xMax)}
//                     y2={toPxY(y2)}
//                     stroke="cyan"
//                     strokeWidth={2}
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Bed/Table") {
//                 const xMin = Math.min(...s.x);
//                 const xMax = Math.max(...s.x);
//                 const yMin = Math.min(...s.y);
//                 const yMax = Math.max(...s.y);
//                 return (
//                   <Rect
//                     key={i}
//                     x={toPxX(xMin)}
//                     y={toPxY(yMax)}
//                     width={(xMax - xMin) * scale}
//                     height={(yMax - yMin) * scale}
//                     stroke="purple"
//                     strokeWidth={2}
//                     fill="rgba(128,0,128,0.3)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               return null;
//             })}
//             {/* live user dot */}
//             <Circle
//               cx={toPxX(liveCoords.x)}
//               cy={toPxY(liveCoords.y)}
//               r={4}
//               fill="red"
//             />
//           </Svg>
//         )}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>Add Room Feature</Text>
//       </TouchableOpacity>

// <ScrollView style={styles.list}>
//   {shapes.map((s, i) => (
//     <View key={i} style={styles.listItem}>
//       {/* ✅ Shape Name */}
//       <Text style={styles.itemText}>
//         {s.name} ({s.type})
//       </Text>

//       {/* ✅ Action Buttons */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => openModalForEdit(i)}>
//           <Text style={styles.updateBtn}>🛠️ Update</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleDelete(i)}>
//           <Text style={styles.deleteBtn}>🗑️ Delete</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleCalibrate(i)}>
//           <Text style={styles.calibrateBtn}>🔧 Calibrate</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🔆 Show only the submitted result here */}
//       {calibrationStates[i]?.submitted && (
//         <Text style={styles.calibrationResult}>
//           🔆 Bulbs ON:{" "}
//           {calibrationStates[i].bulbs
//             .map((on, idx) => (on ? `Bulb ${idx + 1}` : null))
//             .filter(Boolean)
//             .join(", ") || "None"}
//         </Text>
//       )}
//     </View>
//   ))}
//   <RuleManager shapes={shapes} />
// </ScrollView>


//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>{renderInputs()}</ScrollView>
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//                 <Text style={styles.submitText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, styles.cancelBtn]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.submitText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal
//   visible={instructionVisible}
//   transparent
//   animationType="fade"
//   onRequestClose={() => setInstructionVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={{ color: "#FFD700", marginBottom: 20, fontSize: 16 }}>
//         {instructionText}
//       </Text>
//       <TouchableOpacity
//         style={styles.submitBtn}
//         onPress={() => setInstructionVisible(false)}
//       >
//         <Text style={styles.submitText}>OK</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>

//       <Modal
//   visible={calibratingIndex !== null}
//   transparent
//   animationType="slide"
//   onRequestClose={() => setCalibratingIndex(null)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.calibrationTitle}>Calibrate Bulbs</Text>

//       <View style={styles.bulbRow}>
//         {[0, 1, 2, 3].map((bulbIdx) => (
//           <TouchableOpacity
//             key={bulbIdx}
//             onPress={() => toggleBulb(calibratingIndex, bulbIdx)}
//             style={[
//               styles.bulb,
//               calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] && styles.bulbOn,
//             ]}
//           >
//             <Text style={styles.bulbText}>
//               💡 {calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] ? "ON" : "OFF"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.modalActions}>
//         <TouchableOpacity
//           style={styles.submitBtn}
//           onPress={handleCalibrationSubmit}
//         >
//           <Text style={styles.submitText}>Submit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.submitBtn, styles.cancelBtn]}
//           onPress={() => setCalibratingIndex(null)}
//         >
//           <Text style={styles.submitText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
//   heading: { color: "#FFD700", fontSize: 24, marginVertical: 12 },
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//   },

//   heading: {
//     color: "#FFD700",
//     fontSize: 24,
//     marginVertical: 12,
//   },

//   svgContainer: {
//     width: "90%",
//     aspectRatio: 2, // 2:1 rectangle
//     borderRadius: 6,
//     overflow: "hidden",
//   },

//   list: {
//     width: "90%",
//     marginTop: 12,
//   },

//   listItem: {
//     flexDirection: "column",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },

//   itemText: {
//     color: "#FFD700",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   actions: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginTop: 8,
//     marginBottom: 6,
//   },

//   updateBtn: {
//     color: "#0af",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   deleteBtn: {
//     color: "#f55",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   calibrateBtn: {
//     color: "#0f0",
//     fontWeight: "bold",
//   },

//   calibrationResult: {
//     color: "#FFD700",
//     marginTop: 6,
//     fontStyle: "italic",
//     alignSelf: "flex-start",
//   },

//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },

//   addBtnText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   input: {
//     backgroundColor: "#222",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },

//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 12,
//     textDecorationLine: "underline",
//   },

//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },

//   button: {
//     padding: 8,
//     margin: 4,
//     backgroundColor: "#222",
//     borderRadius: 6,
//   },

//   activeBtn: {
//     backgroundColor: "#FFD700",
//   },

//   buttonText: {
//     color: "#FFD700",
//   },

//   activeText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   // 🔲 Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modalContent: {
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 10,
//     width: "85%",
//     maxHeight: "80%",
//     alignItems: "center",
//   },

//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: 16,
//   },

//   calibrationTitle: {
//     color: "#FFD700",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//     textAlign: "center",
//   },

//   bulbRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     flexWrap: "wrap",
//     marginVertical: 16,
//   },

//   bulb: {
//     padding: 12,
//     backgroundColor: "#555",
//     borderRadius: 8,
//     margin: 6,
//   },

//   bulbOn: {
//     backgroundColor: "#00ff00",
//   },

//   bulbText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },

//   cancelBtn: {
//     backgroundColor: "#555",
//   },

//   submitText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });



// import { useLocalSearchParams } from "expo-router"; // add this
// import { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
// import axiosClient from "../../../utils/axiosClient"; // make sure path is correct
// import RuleManager from "./RuleManager";

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [instructionVisible, setInstructionVisible] = useState(false);
//   const [instructionText, setInstructionText] = useState("");
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);
//   const [calibrationStates, setCalibrationStates] = useState({});
//   const [calibratingIndex, setCalibratingIndex] = useState(null);

//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

//   const { roomName, username } = useLocalSearchParams(); // from route
//   // fallback if null
//   const ROOM_NAME = roomName || "Bathroom";
//   const USERNAME = username || "Tharindu";

//   // 1) Fetch the IP from backend, then open WebSocket connection
//   useEffect(() => {
//     let wsInstance = null;

//     const fetchIpAndConnect = async () => {
//       try {
//         const response = await axiosClient.get(
//           `/api/backend/websocketIp?username=${USERNAME}&roomName=${ROOM_NAME}`
//         );
//         console.log("WebSocket IP response:", response.data);
//         if (response.status === 200 && response.data && response.data.ipaddress) {
//           const ip = response.data.ipaddress; // e.g. "192.168.8.101"
//           const wsUrl = `ws://${ip}:81`;

//           wsInstance = new WebSocket(wsUrl);
//           ws.current = wsInstance;

//           wsInstance.onopen = () => {
//             console.log("✅ WebSocket connected to", wsUrl);
//             // If your server expects an initial message, send it here:
//             wsInstance.send(JSON.stringify({ username: USERNAME }));
//           };

//           wsInstance.onmessage = (e) => {
//             try {
//               const data = JSON.parse(e.data);
//               console.log("📥 WS Received:", data);
//               if (data.command === "coordinates" && data.payload) {
//                 const { x, y } = data.payload;
//                 if (typeof x === "number" && typeof y === "number") {
//                   setLiveCoords({ x, y });
//                 }
//               }
//             } catch (err) {
//               console.warn("❌ WS JSON error:", err);
//             }
//           };

//           wsInstance.onerror = (err) => {
//             console.error("WS error", err.message);
//           };

//           wsInstance.onclose = () => {
//             console.log("WebSocket closed");
//           };
//         } else {
//           console.warn("⚠️ No ipaddress in response", response.data);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch WebSocket IP:", err);
//       }
//     };

//     fetchIpAndConnect();

//     return () => {
//       // Clean up on unmount
//       if (wsInstance) {
//         wsInstance.close();
//       }
//     };
//   }, [USERNAME, ROOM_NAME]);

//   // 2) Fetch room configuration (areas, etc.)
//   const [roomConfig, setRoomConfig] = useState(null);
//   useEffect(() => {
//     const fetchConfig = async () => {
//       try {
//         const response = await axiosClient.get(
//           `/api/rooms/configure?username=${USERNAME}&roomName=${ROOM_NAME}`
//         );

//         if (response.status === 200 && response.data) {
//           setRoomConfig(response.data);
//           setShapes(response.data.Areas || []);
//           console.log("✅ Room config loaded");
//         } else {
//           console.warn("⚠️ No config found in response");
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch config:", err);
//       }
//     };

//     fetchConfig();
//   }, [USERNAME, ROOM_NAME]);

//   // Helper math for converting real-world coords to SVG pixels
//   const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
//   const originX = canvasWidth / 2;
//   const originY = 0;
//   const toPxX = (x) => originX + x * scale;
//   const toPxY = (y) => originY + -y * scale; // y is negative downwards

//   // Parsing helpers
//   const parseCircleEquation = (eq) => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/\(x-([-\d.]+)\)\^2\+\(y-([-\d.]+)\)\^2=([-\d.]+)/);
//     if (!m) return null;
//     return { h: +m[1], k: +m[2], r: Math.sqrt(+m[3]) };
//   };

//   const parseLineEquation = (eq) => {
//     const clean = eq.replace(/\s+/g, "");
//     const m = clean.match(/y=([-\d.]+)x([+-][\d.]+)/i);
//     if (!m) return null;
//     return { m: +m[1], b: +m[2] };
//   };

//   const parsePair = (s) => {
//     const [x, y] = s.split(",").map(Number);
//     return { x, y };
//   };

//   // Input, autofill, validate, modal handlers
//   const handleInputChange = (k, v) =>
//     setInputs((prev) => ({ ...prev, [k]: v }));
//   const autofill = (k) =>
//     handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);
//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "Light Zone") return inputs.center && inputs.radius;
//     if (selectedShape === "Door")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "Bed/Table")
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     return true;
//   };

//   const handleShapeSelect = (type) => {
//     let message = "";
//     if (type === "Light Zone") {
//       message =
//         "1. Give a name for Light Zone (eg. Light1)\n2. Sit at the center of the light zone and click 'Use Current Pos'\n3. Then press the Save button.";
//     } else if (type === "Door") {
//       message =
//         "1. Give a name for the Door (eg. Door1)\n2. Sit at the two corners of the door and click 'Use Current Pos'\n3. Then press the Save button.";
//     } else if (type === "Bed/Table") {
//       message =
//         "1. Give a name for the Bed or Table (eg. Bed1/Table1)\n2. Sit at the four corners of the bed or table and click 'Use Current Pos'\n3. Then press the Save button.";
//     }

//     setSelectedShape(type);
//     setInstructionText(message);
//     setInstructionVisible(true);
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("Light Zone");
//     setModalVisible(true);
//   };

//   const openModalForEdit = (i) => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "Light Zone" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "Door") {
//       ni.lineCorner1 = `${s.x[0]},${s.y[0]}`;
//       ni.lineCorner2 = `${s.x[1]},${s.y[1]}`;
//     } else {
//       s.x.forEach((_, idx) => {
//         ni[`rectCorner${idx + 1}`] = `${s.x[idx]},${s.y[idx]}`;
//       });
//     }
//     setInputs(ni);
//     setEditingIndex(i);
//     setModalVisible(true);
//   };

//   const handleSubmit = () => {
//     if (!validate()) {
//       Alert.alert("Error", "Fill name & all fields.");
//       return;
//     }
//     let shape = {
//       type: selectedShape === "Light Zone" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "Light Zone") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "Door") {
//       const p1 = parsePair(inputs.lineCorner1);
//       const p2 = parsePair(inputs.lineCorner2);
//       const m = ((p2.y - p1.y) / (p2.x - p1.x)).toFixed(3);
//       const b = (p1.y - m * p1.x).toFixed(1);
//       shape.equation = `y = ${m}x ${b >= 0 ? "+" + b : b}`;
//       shape.x = [p1.x, p2.x];
//       shape.y = [p1.y, p2.y];
//     } else {
//       const corners = [1, 2, 3, 4].map((n) =>
//         parsePair(inputs[`rectCorner${n}`])
//       );
//       shape.equation = `Rectangle with corners ${corners
//         .map((p) => `(${p.x},${p.y})`)
//         .join(", ")}`;
//       shape.x = corners.map((p) => p.x);
//       shape.y = corners.map((p) => p.y);
//     }

//     // Send over WebSocket
//     ws.current.send(
//       JSON.stringify({
//         action: editingIndex != null ? "update" : "add",
//         index: editingIndex,
//         shape,
//       })
//     );

//     setModalVisible(false);

//     // Update local shapes immediately
//     const updatedShapes =
//       editingIndex != null
//         ? [
//             ...shapes.slice(0, editingIndex),
//             shape,
//             ...shapes.slice(editingIndex + 1),
//           ]
//         : [...shapes, shape];
//     setShapes(updatedShapes);
//     submitToBackend(updatedShapes);
//   };

//   const submitToBackend = async (newShapes) => {
//     if (!roomConfig) {
//       console.warn("⚠️ Room config not loaded yet.");
//       return;
//     }

//     const updatedConfig = {
//       ...roomConfig,
//       Areas: newShapes,
//     };

//     try {
//       const response = await axiosClient.post(
//         "/api/rooms/configure",
//         updatedConfig
//       );

//       if (response.status === 200) {
//         console.log("✅ Room configuration updated");
//       } else {
//         console.warn("⚠️ Unexpected response", response.status);
//       }
//     } catch (error) {
//       console.error("❌ Failed to update config:", error);
//     }
//   };

//   const handleDelete = (i) =>
//     Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => {
//           const newShapes = shapes.filter((_, idx) => idx !== i);
//           setShapes(newShapes);
//           submitToBackend(newShapes);
//           ws.current.send(JSON.stringify({ action: "delete", index: i }));
//         },
//       },
//     ]);

//   const handleCalibrate = (i) => {
//     setCalibratingIndex(i);
//     setCalibrationStates((prev) => ({
//       ...prev,
//       [i]: {
//         bulbs: prev[i]?.bulbs || [false, false, false, false],
//         submitted: false,
//       },
//     }));
//   };

//   const toggleBulb = (i, bulbIdx) => {
//     setCalibrationStates((prev) => {
//       const bulbs = [...(prev[i]?.bulbs || [false, false, false, false])];
//       bulbs[bulbIdx] = !bulbs[bulbIdx];
//       return {
//         ...prev,
//         [i]: {
//           ...prev[i],
//           bulbs,
//           submitted: false,
//         },
//       };
//     });
//   };

//   const handleCalibrationSubmit = () => {
//     if (calibratingIndex === null) return;
//     setCalibrationStates((prev) => ({
//       ...prev,
//       [calibratingIndex]: {
//         ...prev[calibratingIndex],
//         submitted: true,
//       },
//     }));
//     setCalibratingIndex(null);
//   };

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["Light Zone", "Door", "Bed/Table"].map((t) => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => handleShapeSelect(t)}
//           >
//             <Text
//               style={[styles.buttonText, selectedShape === t && styles.activeText]}
//             >
//               {t.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <TextInput
//         placeholder="Shape Name"
//         style={styles.input}
//         placeholderTextColor="#999"
//         value={shapeName}
//         onChangeText={setShapeName}
//       />
//       {selectedShape === "Light Zone" && (
//         <>
//           <TextInput
//             placeholder="Center (x,y)"
//             style={styles.input}
//             value={inputs.center || ""}
//             onChangeText={(t) => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius (mm)"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius || ""}
//             onChangeText={(t) => handleInputChange("radius", t)}
//           />
//         </>
//       )}
//       {selectedShape === "Door" &&
//         [1, 2].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`lineCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       {selectedShape === "Bed/Table" &&
//         [1, 2, 3, 4].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`rectCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}>
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Room Blueprint</Text>
//       <View
//         style={styles.svgContainer}
//         onLayout={(e) => {
//           setCanvasWidth(e.nativeEvent.layout.width);
//           setCanvasHeight(e.nativeEvent.layout.height);
//         }}
//       >
//         {canvasWidth > 0 && (
//           <Svg width={canvasWidth} height={canvasHeight}>
//             {/* background */}
//             <Rect
//               x={0}
//               y={0}
//               width={canvasWidth}
//               height={canvasHeight}
//               fill="#ccffcc"
//             />
//             {/* axes */}
//             <Line
//               x1={originX}
//               y1={0}
//               x2={originX}
//               y2={canvasHeight}
//               stroke="gray"
//               strokeWidth={1}
//             />
//             <Line x1={0} y1={0} x2={canvasWidth} y2={0} stroke="gray" strokeWidth={1} />
//             {/* sensor semicircle */}
//             <Path
//               d={`
//                 M ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
//                 A ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
//                   ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}
//               `}
//               fill="rgba(0,255,0,0.1)"
//               stroke="green"
//               strokeWidth={2}
//             />
//             {/* user-defined shapes */}
//             {shapes.map((s, i) => {
//               if (s.type === "point") {
//                 const c = parseCircleEquation(s.equation);
//                 if (!c) return null;
//                 return (
//                   <Circle
//                     key={i}
//                     cx={toPxX(c.h)}
//                     cy={toPxY(c.k)}
//                     r={c.r * scale}
//                     fill="rgba(255,68,0,0.6)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Door") {
//                 const l = parseLineEquation(s.equation);
//                 if (!l) return null;
//                 const xMin = -REAL_WORLD_RADIUS;
//                 const xMax = REAL_WORLD_RADIUS;
//                 const y1 = l.m * xMin + l.b;
//                 const y2 = l.m * xMax + l.b;
//                 return (
//                   <Line
//                     key={i}
//                     x1={toPxX(xMin)}
//                     y1={toPxY(y1)}
//                     x2={toPxX(xMax)}
//                     y2={toPxY(y2)}
//                     stroke="cyan"
//                     strokeWidth={2}
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               if (s.type === "Bed/Table") {
//                 const xMin = Math.min(...s.x);
//                 const xMax = Math.max(...s.x);
//                 const yMin = Math.min(...s.y);
//                 const yMax = Math.max(...s.y);
//                 return (
//                   <Rect
//                     key={i}
//                     x={toPxX(xMin)}
//                     y={toPxY(yMax)}
//                     width={(xMax - xMin) * scale}
//                     height={(yMax - yMin) * scale}
//                     stroke="purple"
//                     strokeWidth={2}
//                     fill="rgba(128,0,128,0.3)"
//                     onPress={() => openModalForEdit(i)}
//                   />
//                 );
//               }
//               return null;
//             })}
//             {/* live user dot */}
//             <Circle
//               cx={toPxX(liveCoords.x)}
//               cy={toPxY(liveCoords.y)}
//               r={4}
//               fill="red"
//             />
//           </Svg>
//         )}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>Add Room Feature</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             {/* Shape Name */}
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>

//             {/* Action Buttons */}
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>🛠️ Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>🗑️ Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleCalibrate(i)}>
//                 <Text style={styles.calibrateBtn}>🔧 Calibrate</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Show calibration result if submitted */}
//             {calibrationStates[i]?.submitted && (
//               <Text style={styles.calibrationResult}>
//                 🔆 Bulbs ON:{" "}
//                 {calibrationStates[i].bulbs
//                   .map((on, idx) => (on ? `Bulb ${idx + 1}` : null))
//                   .filter(Boolean)
//                   .join(", ") || "None"}
//               </Text>
//             )}
//           </View>
//         ))}
//         <RuleManager shapes={shapes} />
//       </ScrollView>

//       {/* Add / Update Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>{renderInputs()}</ScrollView>
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//                 <Text style={styles.submitText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, styles.cancelBtn]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.submitText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Instruction Modal */}
//       <Modal
//         visible={instructionVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setInstructionVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={{ color: "#FFD700", marginBottom: 20, fontSize: 16 }}>
//               {instructionText}
//             </Text>
//             <TouchableOpacity
//               style={styles.submitBtn}
//               onPress={() => setInstructionVisible(false)}
//             >
//               <Text style={styles.submitText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Calibration Modal */}
//       <Modal
//         visible={calibratingIndex !== null}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setCalibratingIndex(null)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.calibrationTitle}>Calibrate Bulbs</Text>

//             <View style={styles.bulbRow}>
//               {[0, 1, 2, 3].map((bulbIdx) => (
//                 <TouchableOpacity
//                   key={bulbIdx}
//                   onPress={() => toggleBulb(calibratingIndex, bulbIdx)}
//                   style={[
//                     styles.bulb,
//                     calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] && styles.bulbOn,
//                   ]}
//                 >
//                   <Text style={styles.bulbText}>
//                     💡{" "}
//                     {calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx]
//                       ? "ON"
//                       : "OFF"}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.submitBtn}
//                 onPress={handleCalibrationSubmit}
//               >
//                 <Text style={styles.submitText}>Submit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, styles.cancelBtn]}
//                 onPress={() => setCalibratingIndex(null)}
//               >
//                 <Text style={styles.submitText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
//   heading: { color: "#FFD700", fontSize: 24, marginVertical: 12 },

//   svgContainer: {
//     width: "90%",
//     aspectRatio: 2, // 2:1 rectangle
//     borderRadius: 6,
//     overflow: "hidden",
//   },

//   list: {
//     width: "90%",
//     marginTop: 12,
//   },

//   listItem: {
//     flexDirection: "column",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },

//   itemText: {
//     color: "#FFD700",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   actions: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginTop: 8,
//     marginBottom: 6,
//   },

//   updateBtn: {
//     color: "#0af",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   deleteBtn: {
//     color: "#f55",
//     marginRight: 12,
//     fontWeight: "bold",
//   },

//   calibrateBtn: {
//     color: "#0f0",
//     fontWeight: "bold",
//   },

//   calibrationResult: {
//     color: "#FFD700",
//     marginTop: 6,
//     fontStyle: "italic",
//     alignSelf: "flex-start",
//   },

//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },

//   addBtnText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   input: {
//     backgroundColor: "#222",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },

//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 12,
//     textDecorationLine: "underline",
//   },

//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },

//   button: {
//     padding: 8,
//     margin: 4,
//     backgroundColor: "#222",
//     borderRadius: 6,
//   },

//   activeBtn: {
//     backgroundColor: "#FFD700",
//   },

//   buttonText: {
//     color: "#FFD700",
//   },

//   activeText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modalContent: {
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 10,
//     width: "85%",
//     maxHeight: "80%",
//     alignItems: "center",
//   },

//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: 16,
//   },

//   calibrationTitle: {
//     color: "#FFD700",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//     textAlign: "center",
//   },

//   bulbRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     flexWrap: "wrap",
//     marginVertical: 16,
//   },

//   bulb: {
//     padding: 12,
//     backgroundColor: "#555",
//     borderRadius: 8,
//     margin: 6,
//   },

//   bulbOn: {
//     backgroundColor: "#00ff00",
//   },

//   bulbText: {
//     color: "#000",
//     fontWeight: "bold",
//   },

//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },

//   cancelBtn: {
//     backgroundColor: "#555",
//   },

//   submitText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });



import { useLocalSearchParams } from "expo-router"; // add this
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import axiosClient from "../../../utils/axiosClient"; // make sure path is correct
import RuleManager from "./RuleManager";

const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

export default function ShapeSelector() {
  const [instructionVisible, setInstructionVisible] = useState(false);
  const [instructionText, setInstructionText] = useState("");
  const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShape, setSelectedShape] = useState("round");
  const [shapeName, setShapeName] = useState("");
  const [inputs, setInputs] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const ws = useRef(null);
  const [calibrationStates, setCalibrationStates] = useState({});
  const [calibratingIndex, setCalibratingIndex] = useState(null);

  // dimensions of our 2:1 SVG container in pixels
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const { roomName, username } = useLocalSearchParams(); // from route
  // fallback if null
  const ROOM_NAME = roomName || "Bathroom";
  const USERNAME = username || "Tharindu";

  // 1) Fetch the IP from backend, then open WebSocket connection
  useEffect(() => {
    let wsInstance = null;

    const fetchIpAndConnect = async () => {
      try {
        const response = await axiosClient.get(
          `/api/backend/websocketIp?username=${USERNAME}&roomName=${ROOM_NAME}`
        );
        console.log("WebSocket IP response:", response.data);
        if (response.status === 200 && response.data && response.data.ipaddress) {
          //const ip = response.data.ipaddress; // e.g. "192.168.8.101"
          const ip = "192.168.8.100";
          const wsUrl = `ws://${ip}:81`;

          wsInstance = new WebSocket(wsUrl);
          ws.current = wsInstance;

          wsInstance.onopen = () => {
            console.log("✅ WebSocket connected to", wsUrl);
            // If your server expects an initial message, send it here:
            wsInstance.send(JSON.stringify({ username: USERNAME }));
          };

          wsInstance.onmessage = (e) => {
            try {
              const data = JSON.parse(e.data);
              console.log("📥 WS Received:", data);
              if (data.command === "coordinates" && data.payload) {
                const { x, y } = data.payload;
                if (typeof x === "number" && typeof y === "number") {
                  setLiveCoords({ x, y });
                }
              }
            } catch (err) {
              console.warn("❌ WS JSON error:", err);
            }
          };

          wsInstance.onerror = (err) => {
            console.error("WS error", err.message);
          };

          wsInstance.onclose = () => {
            console.log("WebSocket closed");
          };
        } else {
          console.warn("⚠️ No ipaddress in response", response.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch WebSocket IP:", err);
      }
    };

    fetchIpAndConnect();

    return () => {
      // Clean up on unmount
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [USERNAME, ROOM_NAME]);

  // 2) Fetch room configuration (areas, etc.)
  const [roomConfig, setRoomConfig] = useState(null);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axiosClient.get(
          `/api/rooms/configure?username=${USERNAME}&roomName=${ROOM_NAME}`
        );

        if (response.status === 200 && response.data) {
          setRoomConfig(response.data);
          setShapes(response.data.Areas || []);
          console.log("✅ Room config loaded");
        } else {
          console.warn("⚠️ No config found in response");
        }
      } catch (err) {
        console.error("❌ Failed to fetch config:", err);
      }
    };

    fetchConfig();
  }, [USERNAME, ROOM_NAME]);

  // Helper math for converting real-world coords to SVG pixels
  const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
  const originX = canvasWidth / 2;
  const originY = 0;
  const toPxX = (x) => originX + x * scale;
  const toPxY = (y) => originY + -y * scale; // y is negative downwards

  // Parsing helpers
  /**
 * Parses ANY equation of the form
 *    (x ± H)^2 + (y ± K)^2 = R_squared
 * and returns { h, k, r }.  If it fails, returns null.
 */
const parseCircleEquation = (eq) => {
  // remove ALL whitespace
  const clean = eq.replace(/\s+/g, "");
  // look for "(x±H)^2+(y±K)^2=R"  where ± can be + or –, H,K,R can be floats/ints
  const m = clean.match(
    /\(x([+-]\d+(\.\d+)?)\)\^2\+\(y([+-]\d+(\.\d+)?)\)\^2=(\d+(\.\d+)?)/
  );
  if (!m) return null;

  // m[1] is either "+1000" or "-1500"; so the actual center H = –(±…)
  const rawHs = m[1];           // e.g. "+1000"  or "-2500"
  const rawKs = m[3];           // e.g. "+3000" or "-2000"
  const rawR2 = m[5];           // e.g. "1600000"

  // If equation is "(x+1000)^2" then the circle center is h = –1000.
  const h = -parseFloat(rawHs);
  const k = -parseFloat(rawKs);
  const r = Math.sqrt(parseFloat(rawR2));
  return { h, k, r };
};


  /**
 * Returns an object indicating:
 *  – if it’s a purely horizontal line ("y = C"),
 *  – or a sloped line ("y = m x + b").
 * If it fails to parse, returns null.
 */
const parseLineEquation = (eq) => {
  const clean = eq.replace(/\s+/g, ""); // strip all whitespace

  // 1) Try to match a horizontal line: "y=C"  (no "x" term)
  let m = clean.match(/^y=([+-]?\d+(\.\d+)?)$/);
  if (m) {
    // horizontal line at y = constant
    return {
      horizontal: true,
      m: 0,
      b: parseFloat(m[1]),
    };
  }

  // 2) Otherwise try to match "y=mx+b" exactly
  m = clean.match(/^y=([+-]?\d+(\.\d+)?)[x](\+|\-)(\d+(\.\d+)?)$/i);
  if (!m) return null;

  const rawM = m[1];       // e.g. "1.5"  or "-2"
  const signB = m[3];      // either "+" or "-"
  const rawB = m[4];       // e.g. "300.0"  or "0"
  const mNum = parseFloat(rawM);
  const bNum = parseFloat(rawB) * (signB === "-" ? -1 : 1);

  return {
    horizontal: false,
    m: mNum,
    b: bNum,
  };
};


  const parsePair = (s) => {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
  };

  // Input, autofill, validate, modal handlers
  const handleInputChange = (k, v) =>
    setInputs((prev) => ({ ...prev, [k]: v }));
  const autofill = (k) =>
    handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);
  const validate = () => {
    if (!shapeName.trim()) return false;
    if (selectedShape === "Light Zone") return inputs.center && inputs.radius;
    if (selectedShape === "Door")
      return inputs.lineCorner1 && inputs.lineCorner2;
    if (selectedShape === "Bed/Table")
      return (
        inputs.rectCorner1 &&
        inputs.rectCorner2 &&
        inputs.rectCorner3 &&
        inputs.rectCorner4
      );
    return true;
  };

  const handleShapeSelect = (type) => {
    let message = "";
    if (type === "Light Zone") {
      message =
        "1. Give a name for Light Zone (eg. Light1)\n2. Sit at the center of the light zone and click 'Use Current Pos'\n3. Then press the Save button.";
    } else if (type === "Door") {
      message =
        "1. Give a name for the Door (eg. Door1)\n2. Sit at the two corners of the door and click 'Use Current Pos'\n3. Then press the Save button.";
    } else if (type === "Bed/Table") {
      message =
        "1. Give a name for the Bed or Table (eg. Bed1/Table1)\n2. Sit at the four corners of the bed or table and click 'Use Current Pos'\n3. Then press the Save button.";
    }

    setSelectedShape(type);
    setInstructionText(message);
    setInstructionVisible(true);
  };

  const openModalForNew = () => {
    setEditingIndex(null);
    setShapeName("");
    setInputs({});
    setSelectedShape("Light Zone");
    setModalVisible(true);
  };

  const openModalForEdit = (i) => {
    const s = shapes[i];
    setShapeName(s.name);
    setSelectedShape(s.type === "point" ? "Light Zone" : s.type);
    const ni = {};
    if (s.type === "point") {
      const c = parseCircleEquation(s.equation);
      if (c) {
        ni.center = `${c.h},${c.k}`;
        ni.radius = String(c.r);
      }
    } else if (s.type === "Door") {
      ni.lineCorner1 = `${s.x[0]},${s.y[0]}`;
      ni.lineCorner2 = `${s.x[1]},${s.y[1]}`;
    } else {
      s.x.forEach((_, idx) => {
        ni[`rectCorner${idx + 1}`] = `${s.x[idx]},${s.y[idx]}`;
      });
    }
    setInputs(ni);
    setEditingIndex(i);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert("Error", "Fill name & all fields.");
      return;
    }
    let shape = {
      type: selectedShape === "Light Zone" ? "point" : selectedShape,
      name: shapeName.trim(),
    };
    if (selectedShape === "Light Zone") {
      const { x, y } = parsePair(inputs.center);
      const r = +inputs.radius;
      shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
      shape.x = [x];
      shape.y = [y];
    } else if (selectedShape === "Door") {
      const p1 = parsePair(inputs.lineCorner1);
      const p2 = parsePair(inputs.lineCorner2);
      const m = ((p2.y - p1.y) / (p2.x - p1.x)).toFixed(3);
      const b = (p1.y - m * p1.x).toFixed(1);
      shape.equation = `y = ${m}x ${b >= 0 ? "+" + b : b}`;
      shape.x = [p1.x, p2.x];
      shape.y = [p1.y, p2.y];
    } else {
      const corners = [1, 2, 3, 4].map((n) =>
        parsePair(inputs[`rectCorner${n}`])
      );
      shape.equation = `Rectangle with corners ${corners
        .map((p) => `(${p.x},${p.y})`)
        .join(", ")}`;
      shape.x = corners.map((p) => p.x);
      shape.y = corners.map((p) => p.y);
    }

    // Send over WebSocket
    ws.current.send(
      JSON.stringify({
        action: editingIndex != null ? "update" : "add",
        index: editingIndex,
        shape,
      })
    );

    setModalVisible(false);

    // Update local shapes immediately
    const updatedShapes =
      editingIndex != null
        ? [
            ...shapes.slice(0, editingIndex),
            shape,
            ...shapes.slice(editingIndex + 1),
          ]
        : [...shapes, shape];
    setShapes(updatedShapes);
    submitToBackend(updatedShapes);
  };

  const submitToBackend = async (newShapes) => {
    if (!roomConfig) {
      console.warn("⚠️ Room config not loaded yet.");
      return;
    }

    const updatedConfig = {
      ...roomConfig,
      Areas: newShapes,
    };

    try {
      const response = await axiosClient.post(
        "/api/rooms/configure",
        updatedConfig
      );

      if (response.status === 200) {
        console.log("✅ Room configuration updated");
      } else {
        console.warn("⚠️ Unexpected response", response.status);
      }
    } catch (error) {
      console.error("❌ Failed to update config:", error);
    }
  };

  const handleDelete = (i) =>
    Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newShapes = shapes.filter((_, idx) => idx !== i);
          setShapes(newShapes);
          submitToBackend(newShapes);
          ws.current.send(JSON.stringify({ action: "delete", index: i }));
        },
      },
    ]);

  const handleCalibrate = (i) => {
    setCalibratingIndex(i);
    setCalibrationStates((prev) => ({
      ...prev,
      [i]: {
        bulbs: prev[i]?.bulbs || [false, false, false, false],
        submitted: false,
      },
    }));
  };

  const toggleBulb = (i, bulbIdx) => {
    setCalibrationStates((prev) => {
      const bulbs = [...(prev[i]?.bulbs || [false, false, false, false])];
      bulbs[bulbIdx] = !bulbs[bulbIdx];
      return {
        ...prev,
        [i]: {
          ...prev[i],
          bulbs,
          submitted: false,
        },
      };
    });
  };

  const handleCalibrationSubmit = () => {
    if (calibratingIndex === null) return;
    setCalibrationStates((prev) => ({
      ...prev,
      [calibratingIndex]: {
        ...prev[calibratingIndex],
        submitted: true,
      },
    }));
    setCalibratingIndex(null);
  };

  const renderInputs = () => (
    <>
      <View style={styles.buttonContainer}>
        {["Light Zone", "Door", "Bed/Table"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.button, selectedShape === t && styles.activeBtn]}
            onPress={() => handleShapeSelect(t)}
          >
            <Text
              style={[styles.buttonText, selectedShape === t && styles.activeText]}
            >
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Shape Name"
        style={styles.input}
        placeholderTextColor="#999"
        value={shapeName}
        onChangeText={setShapeName}
      />
      {selectedShape === "Light Zone" && (
        <>
          <TextInput
            placeholder="Center (x,y)"
            style={styles.input}
            value={inputs.center || ""}
            onChangeText={(t) => handleInputChange("center", t)}
          />
          <TouchableOpacity onPress={() => autofill("center")}>
            <Text style={styles.fillBtn}>Use Current Pos</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Radius (mm)"
            style={styles.input}
            keyboardType="numeric"
            value={inputs.radius || ""}
            onChangeText={(t) => handleInputChange("radius", t)}
          />
        </>
      )}
      {selectedShape === "Door" &&
        [1, 2].map((n) => (
          <View key={n}>
            <TextInput
              placeholder={`Corner ${n} (x,y)`}
              style={styles.input}
              value={inputs[`lineCorner${n}`] || ""}
              onChangeText={(t) => handleInputChange(`lineCorner${n}`, t)}
            />
            <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
              <Text style={styles.fillBtn}>Use Current Pos</Text>
            </TouchableOpacity>
          </View>
        ))}
      {selectedShape === "Bed/Table" &&
        [1, 2, 3, 4].map((n) => (
          <View key={n}>
            <TextInput
              placeholder={`Corner ${n} (x,y)`}
              style={styles.input}
              value={inputs[`rectCorner${n}`] || ""}
              onChangeText={(t) => handleInputChange(`rectCorner${n}`, t)}
            />
            <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}>
              <Text style={styles.fillBtn}>Use Current Pos</Text>
            </TouchableOpacity>
          </View>
        ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Room Blueprint</Text>
      <View
        style={styles.svgContainer}
        onLayout={(e) => {
          setCanvasWidth(e.nativeEvent.layout.width);
          setCanvasHeight(e.nativeEvent.layout.height);
        }}
      >
        {canvasWidth > 0 && (
          <Svg width={canvasWidth} height={canvasHeight}>
            {/* background */}
            <Rect
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill="#ccffcc"
            />
            {/* axes */}
            <Line
              x1={originX}
              y1={0}
              x2={originX}
              y2={canvasHeight}
              stroke="gray"
              strokeWidth={1}
            />
            <Line x1={0} y1={0} x2={canvasWidth} y2={0} stroke="gray" strokeWidth={1} />
            {/* sensor semicircle */}
            <Path
              d={`
                M ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
                A ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
                  ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}
              `}
              fill="rgba(0,255,0,0.1)"
              stroke="green"
              strokeWidth={2}
            />
            {/* user-defined shapes */}
            {shapes.map((s, i) => {
              if (s.type === "point") {
                const c = parseCircleEquation(s.equation);
                if (!c) return null;
                return (
                  <Circle
                    key={i}
                    cx={toPxX(c.h)}
                    cy={toPxY(c.k)}
                    r={c.r * scale}
                    fill="rgba(255,68,0,0.6)"
                    onPress={() => openModalForEdit(i)}
                  />
                );
              }
              if (s.type === "Door") {
                const l = parseLineEquation(s.equation);
                if (!l) return null;
                const xMin = -REAL_WORLD_RADIUS;
                const xMax = REAL_WORLD_RADIUS;
                const y1 = l.m * xMin + l.b;
                const y2 = l.m * xMax + l.b;
                return (
                  <Line
                    key={i}
                    x1={toPxX(xMin)}
                    y1={toPxY(y1)}
                    x2={toPxX(xMax)}
                    y2={toPxY(y2)}
                    stroke="cyan"
                    strokeWidth={2}
                    onPress={() => openModalForEdit(i)}
                  />
                );
              }
              if (s.type === "Bed/Table") {
                const xMin = Math.min(...s.x);
                const xMax = Math.max(...s.x);
                const yMin = Math.min(...s.y);
                const yMax = Math.max(...s.y);
                return (
                  <Rect
                    key={i}
                    x={toPxX(xMin)}
                    y={toPxY(yMax)}
                    width={(xMax - xMin) * scale}
                    height={(yMax - yMin) * scale}
                    stroke="purple"
                    strokeWidth={2}
                    fill="rgba(128,0,128,0.3)"
                    onPress={() => openModalForEdit(i)}
                  />
                );
              }
              return null;
            })}
            {/* live user dot */}
            <Circle
              cx={toPxX(liveCoords.x)}
              cy={toPxY(liveCoords.y)}
              r={4}
              fill="red"
            />
          </Svg>
        )}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
        <Text style={styles.addBtnText}>Add Room Feature</Text>
      </TouchableOpacity>

      <ScrollView style={styles.list}>
        {shapes.map((s, i) => (
          <View key={i} style={styles.listItem}>
            {/* Shape Name */}
            <Text style={styles.itemText}>
              {s.name} ({s.type})
            </Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModalForEdit(i)}>
                <Text style={styles.updateBtn}>🛠️ Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(i)}>
                <Text style={styles.deleteBtn}>🗑️ Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCalibrate(i)}>
                <Text style={styles.calibrateBtn}>🔧 Calibrate</Text>
              </TouchableOpacity>
            </View>

            {/* Show calibration result if submitted */}
            {calibrationStates[i]?.submitted && (
              <Text style={styles.calibrationResult}>
                🔆 Bulbs ON:{" "}
                {calibrationStates[i].bulbs
                  .map((on, idx) => (on ? `Bulb ${idx + 1}` : null))
                  .filter(Boolean)
                  .join(", ") || "None"}
              </Text>
            )}
          </View>
        ))}
        <RuleManager shapes={shapes} />
      </ScrollView>

      {/* Add / Update Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>{renderInputs()}</ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.submitText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Instruction Modal */}
      <Modal
        visible={instructionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInstructionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: "#FFD700", marginBottom: 20, fontSize: 16 }}>
              {instructionText}
            </Text>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => setInstructionVisible(false)}
            >
              <Text style={styles.submitText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calibration Modal */}
      <Modal
        visible={calibratingIndex !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setCalibratingIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.calibrationTitle}>Calibrate Bulbs</Text>

            <View style={styles.bulbRow}>
              {[0, 1, 2, 3].map((bulbIdx) => (
                <TouchableOpacity
                  key={bulbIdx}
                  onPress={() => toggleBulb(calibratingIndex, bulbIdx)}
                  style={[
                    styles.bulb,
                    calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] && styles.bulbOn,
                  ]}
                >
                  <Text style={styles.bulbText}>
                    💡{" "}
                    {calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx]
                      ? "ON"
                      : "OFF"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleCalibrationSubmit}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, styles.cancelBtn]}
                onPress={() => setCalibratingIndex(null)}
              >
                <Text style={styles.submitText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  heading: { color: "#FFD700", fontSize: 24, marginVertical: 12 },

  svgContainer: {
    width: "90%",
    aspectRatio: 2, // 2:1 rectangle
    borderRadius: 6,
    overflow: "hidden",
  },

  list: {
    width: "90%",
    marginTop: 12,
  },

  listItem: {
    flexDirection: "column",
    backgroundColor: "#111",
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
  },

  itemText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    marginBottom: 6,
  },

  updateBtn: {
    color: "#0af",
    marginRight: 12,
    fontWeight: "bold",
  },

  deleteBtn: {
    color: "#f55",
    marginRight: 12,
    fontWeight: "bold",
  },

  calibrateBtn: {
    color: "#0f0",
    fontWeight: "bold",
  },

  calibrationResult: {
    color: "#FFD700",
    marginTop: 6,
    fontStyle: "italic",
    alignSelf: "flex-start",
  },

  addBtn: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },

  addBtnText: {
    color: "#000",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#222",
    color: "#FFD700",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },

  fillBtn: {
    color: "#FFD700",
    marginBottom: 12,
    textDecorationLine: "underline",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  button: {
    padding: 8,
    margin: 4,
    backgroundColor: "#222",
    borderRadius: 6,
  },

  activeBtn: {
    backgroundColor: "#FFD700",
  },

  buttonText: {
    color: "#FFD700",
  },

  activeText: {
    color: "#000",
    fontWeight: "bold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxHeight: "80%",
    alignItems: "center",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },

  calibrationTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  bulbRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: 16,
  },

  bulb: {
    padding: 12,
    backgroundColor: "#555",
    borderRadius: 8,
    margin: 6,
  },

  bulbOn: {
    backgroundColor: "#00ff00",
  },

  bulbText: {
    color: "#000",
    fontWeight: "bold",
  },

  submitBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  cancelBtn: {
    backgroundColor: "#555",
  },

  submitText: {
    color: "#000",
    fontWeight: "bold",
  },
});
