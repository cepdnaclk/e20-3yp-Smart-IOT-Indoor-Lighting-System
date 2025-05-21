
// // Final code


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

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);

//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.8.100:81");
//     ws.current.onopen = () => {
//       console.log("WebSocket Connected");
//       const orig = ws.current.send.bind(ws.current);
//       ws.current.send = (data) => {
//         console.log("→ WS SEND:", data);
//         orig(data);
//       };
//     };
//     ws.current.onmessage = ({ data }) => {
//   try {
//     const msg = JSON.parse(data);
//     console.log("📥 Parsed JSON:\n", JSON.stringify(msg, null, 2));

//     if (typeof msg.x === "number" && typeof msg.y === "number") {
//       setLiveCoords({ x: msg.x, y: msg.y });
//     }

//     if (Array.isArray(msg.shapes)) {
//       setShapes(prev => {
//         const merged = [...prev];
//         msg.shapes.forEach(s => {
//           const idx = merged.findIndex(
//             ps => ps.name === s.name && ps.equation === s.equation
//           );
//           if (idx >= 0) {
//             merged[idx] = s;
//           } else {
//             merged.push(s);
//           }
//         });
//         return merged;
//       });
//     }
//   } catch (err) {
//     console.warn("❌ Error parsing JSON from WS:", err.message);
//     console.warn("Raw Data:", data);
//   }
// };
//     // ws.current.onmessage = ({ data }) => {
//     //   console.log("← WS RECV:", data);
//     //   try {
//     //     const msg = JSON.parse(data);
//     //     // update live position
//     //     if (typeof msg.x === "number" && typeof msg.y === "number") {
//     //       setLiveCoords({ x: msg.x, y: msg.y });
//     //     }
//     //     // merge incoming shapes with local state
//     //     if (Array.isArray(msg.shapes)) {
//     //       setShapes(prev => {
//     //         const merged = [...prev];
//     //         msg.shapes.forEach(s => {
//     //           // try to find existing by name & equation
//     //           const idx = merged.findIndex(
//     //             ps => ps.name === s.name && ps.equation === s.equation
//     //           );
//     //           if (idx >= 0) {
//     //             merged[idx] = s;     // update existing
//     //           } else {
//     //             merged.push(s);      // append new
//     //           }
//     //         });
//     //         return merged;
//     //       });
//     //     }
//     //   } catch {
//     //     console.warn("Malformed WS message", data);
//     //   }
//     // };
//     ws.current.onerror = (e) => console.error("WS Error:", e.message);
//     ws.current.onclose = () => console.log("WebSocket Closed");
//     return () => ws.current && ws.current.close();
//   }, []);

//   // helper math
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
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
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
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "line") {
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
//       type: selectedShape === "round" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "round") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "line") {
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

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
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
//       {selectedShape === "round" && (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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
//       <Text style={styles.heading}>Shape Selector</Text>
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
//               if (s.type === "line") {
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
//               if (s.type === "rectangle") {
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
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

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
//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   addBtnText: { color: "#000", fontWeight: "bold" },
//   list: { width: "90%", marginTop: 12 },
//   listItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },
//   itemText: { color: "#FFD700" },
//   actions: { flexDirection: "row" },
//   updateBtn: { color: "#0af", marginRight: 12 },
//   deleteBtn: { color: "#f55" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "85%",
//     maxHeight: "80%",
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 8,
//   },
//   buttonContainer: { flexDirection: "row", justifyContent: "center" },
//   button: { padding: 8, margin: 4, backgroundColor: "#222", borderRadius: 6 },
//   activeBtn: { backgroundColor: "#FFD700" },
//   buttonText: { color: "#FFD700" },
//   activeText: { color: "#000", fontWeight: "bold" },
//   input: {
//     backgroundColor: "#222",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },
//   fillBtn: { color: "#FFD700", marginBottom: 12, textDecorationLine: "underline" },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 12,
//   },
//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   cancelBtn: { backgroundColor: "#555" },
//   submitText: { color: "#000", fontWeight: "bold" },
// });















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

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [calibrations, setCalibrations] = useState({}); // index -> { bulbs: [bool], advanced: bool, expanded: bool, saved: bool }
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [canvasWidth, setCanvasWidth] = useState(0); // add missing state
//   const [canvasHeight, setCanvasHeight] = useState(0); // add missing state
//   const ws = useRef(null);

//   // Calibration handlers
//   const handleCalibrate = (i) => {
//     setCalibrations((prev) => {
//       const prevCal = prev[i] || {};
//       return {
//         ...prev,
//         [i]: {
//           bulbs: prevCal.bulbs || [false, false, false, false],
//           advanced: prevCal.advanced || false,
//           expanded: !prevCal.expanded,
//           saved: prevCal.saved || false,
//         },
//       };
//     });
//   };

//   const toggleBulb = (i, idx) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       const newBulbs = [...cal.bulbs];
//       newBulbs[idx] = !newBulbs[idx];
//       return { ...prev, [i]: { ...cal, bulbs: newBulbs } };
//     });
//   };

//   const handleAdvanced = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, advanced: !cal.advanced } };
//     });
//   };

//   const handleSave = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, saved: true } };
//     });
//     Alert.alert("Saved", `Calibration data for "${shapes[i].name}" saved.`);
//   };

//   const allCalibrated =
//     shapes.length > 0 && shapes.every((_, i) => calibrations[i]?.saved);

//   const handleSubmitCalibration = () => {
//     const data = shapes.map((s, i) => [
//       s.name,
//       s.type,
//       s.x.map((x, j) => ({ x, y: s.y[j] })),
//       calibrations[i].bulbs,
//     ]);
//     ws.current.send(
//       JSON.stringify({ action: "submitCalibration", calibrationData: data })
//     );
//     Alert.alert("Submitted", JSON.stringify(data));
//   };

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.7.115:81");
//     ws.current.onopen = () => {
//       console.log("WebSocket Connected");
//       const orig = ws.current.send.bind(ws.current);
//       ws.current.send = (data) => {
//         console.log("→ WS SEND:", data);
//         orig(data);
//       };
//     };
//     ws.current.onmessage = ({ data }) => {
//       console.log("← WS RECV:", data);
//       try {
//         const msg = JSON.parse(data);
//         if (typeof msg.x === "number" && typeof msg.y === "number") {
//           setLiveCoords({ x: msg.x, y: msg.y });
//         }
//         if (Array.isArray(msg.shapes)) {
//           setShapes((prev) => {
//             const merged = [...prev];
//             msg.shapes.forEach((s) => {
//               const idx = merged.findIndex(
//                 (ps) => ps.name === s.name && ps.equation === s.equation
//               );
//               if (idx >= 0) merged[idx] = s;
//               else merged.push(s);
//             });
//             return merged;
//           });
//         }
//       } catch {
//         console.warn("Malformed WS message", data);
//       }
//     };
//     ws.current.onerror = (e) => console.error("WS Error:", e.message);
//     ws.current.onclose = () => console.log("WebSocket Closed");
//     return () => ws.current && ws.current.close();
//   }, []);

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
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
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
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "line") {
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
//       type: selectedShape === "round" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "round") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "line") {
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

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
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
//       {selectedShape === "round" && (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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

//   // ... existing geometry parsing, input handlers, modal code remains unchanged ...

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>
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
//               if (s.type === "line") {
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
//               if (s.type === "rectangle") {
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
//         {/* existing SVG rendering code */}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleCalibrate(i)}>
//                 <Text style={styles.calibrateBtn}>Calibrate</Text>
//               </TouchableOpacity>
//             </View>
//             {calibrations[i]?.expanded && (
//               <View style={styles.calibrationContainer}>
//                 <View style={styles.bulbsRow}>
//                   {calibrations[i].bulbs.map((on, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       onPress={() => toggleBulb(i, idx)}
//                       style={[styles.bulb, on && styles.bulbOn]}
//                     >
//                       <Text style={styles.bulbText}>{idx + 1}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//                 <View style={styles.calibrationActions}>
//                   <TouchableOpacity onPress={() => handleAdvanced(i)}>
//                     <Text style={styles.advancedBtn}>Advanced</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => handleSave(i)}>
//                     <Text
//                       style={[
//                         styles.saveBtn,
//                         calibrations[i].saved && styles.savedBtn,
//                       ]}
//                     >
//                       {calibrations[i].saved ? "Saved" : "Save"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {calibrations[i].advanced && (
//                   <Text style={styles.advancedPlaceholder}>
//                     Advanced options coming soon
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       {allCalibrated && (
//         <TouchableOpacity
//           style={styles.submitCalibBtn}
//           onPress={handleSubmitCalibration}
//         >
//           <Text style={styles.submitCalibText}>Submit All</Text>
//         </TouchableOpacity>
//       )}
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

//       {/* existing Modal code */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // existing styles...
//   calibrateBtn: { color: "#0af", marginHorizontal: 8 },
//   calibrationContainer: {
//     padding: 10,
//     backgroundColor: "#222",
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   bulbsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   bulb: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bulbOn: { backgroundColor: "#FFD700" },
//   bulbText: { color: "#000", fontWeight: "bold" },
//   calibrationActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   advancedBtn: { color: "#0af" },
//   advancedPlaceholder: { color: "#FFD700", marginTop: 8 },
//   saveBtn: { color: "#0f0" },
//   savedBtn: { color: "#0a0" },
//   submitCalibBtn: {
//     backgroundColor: "#28a745",
//     padding: 12,
//     borderRadius: 6,
//     margin: 12,
//   },
//   submitCalibText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
// });






// import { useNavigation } from "@react-navigation/native";
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


// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [calibrations, setCalibrations] = useState({}); // index -> { bulbs: [bool], advanced: bool, expanded: bool, saved: bool }
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [canvasWidth, setCanvasWidth] = useState(0); // add missing state
//   const [canvasHeight, setCanvasHeight] = useState(0); // add missing state
//   const ws = useRef(null);
//   const navigation = useNavigation();


//   // Calibration handlers
//   const handleCalibrate = (i) => {
//     setCalibrations((prev) => {
//       const prevCal = prev[i] || {};
//       return {
//         ...prev,
//         [i]: {
//           bulbs: prevCal.bulbs || [false, false, false, false],
//           advanced: prevCal.advanced || false,
//           expanded: !prevCal.expanded,
//           saved: prevCal.saved || false,
//         },
//       };
//     });
//   };

//   const toggleBulb = (i, idx) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       const newBulbs = [...cal.bulbs];
//       newBulbs[idx] = !newBulbs[idx];
//       return { ...prev, [i]: { ...cal, bulbs: newBulbs } };
//     });
//   };

//   const handleAdvanced = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, advanced: !cal.advanced } };
//     });
//   };

//   const handleSave = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, saved: true } };
//     });
//     Alert.alert("Saved", `Calibration data for "${shapes[i].name}" saved.`);
//   };

//   const allCalibrated =
//     shapes.length > 0 && shapes.every((_, i) => calibrations[i]?.saved);

//   const handleSubmitCalibration = () => {
//     const data = shapes.map((s, i) => [
//       s.name,
//       s.type,
//       s.x.map((x, j) => ({ x, y: s.y[j] })),
//       calibrations[i].bulbs,
//     ]);
//     ws.current.send(
//       JSON.stringify({ action: "submitCalibration", calibrationData: data })
//     );
//     Alert.alert("Submitted", JSON.stringify(data));
//   };

// useEffect(() => {
//   ws.current = new WebSocket("ws://192.168.8.100:81");

//   ws.current.onopen = () => {
//     console.log("WebSocket Connected");
//   };

//   ws.current.onmessage = ({ data }) => {
//     try {
//       const msg = JSON.parse(data);
//       console.log("📥 Received:", msg);

//       if (typeof msg.x === "number" && typeof msg.y === "number") {
//         setLiveCoords({ x: msg.x, y: msg.y });
//       }

//       if (Array.isArray(msg.shapes)) {
//         setShapes((prev) => {
//           const merged = [...prev];
//           msg.shapes.forEach((s) => {
//             const idx = merged.findIndex(
//               (ps) => ps.name === s.name && ps.equation === s.equation
//             );
//             if (idx >= 0) merged[idx] = s;
//             else merged.push(s);
//           });
//           return merged;
//         });
//       }
//     } catch (err) {
//       console.warn("❌ Error parsing message:", err.message);
//       console.warn("Raw Data:", data);
//     }
//   };

//   ws.current.onerror = (e) => {
//     console.error("WebSocket Error:", e.message);
//     Alert.alert("Connection Failed", "Cannot connect to device.", [
//       {
//         text: "Go Back",
//         onPress: () => navigation.goBack(),
//       },
//     ]);
//   };

//   ws.current.onclose = () => {
//     console.log("WebSocket Closed");
//     Alert.alert("Connection Lost", "WebSocket connection closed.", [
//       {
//         text: "Go Back",
//         onPress: () => navigation.goBack(),
//       },
//     ]);
//   };

//   return () => ws.current && ws.current.close();
// }, []);


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
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
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
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "line") {
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
//       type: selectedShape === "round" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "round") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "line") {
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

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
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
//       {selectedShape === "round" && (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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

//   // ... existing geometry parsing, input handlers, modal code remains unchanged ...

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>
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
//               if (s.type === "line") {
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
//               if (s.type === "rectangle") {
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
//         {/* existing SVG rendering code */}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleCalibrate(i)}>
//                 <Text style={styles.calibrateBtn}>Calibrate</Text>
//               </TouchableOpacity>
//             </View>
//             {calibrations[i]?.expanded && (
//               <View style={styles.calibrationContainer}>
//                 <View style={styles.bulbsRow}>
//                   {calibrations[i].bulbs.map((on, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       onPress={() => toggleBulb(i, idx)}
//                       style={[styles.bulb, on && styles.bulbOn]}
//                     >
//                       <Text style={styles.bulbText}>{idx + 1}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//                 <View style={styles.calibrationActions}>
//                   <TouchableOpacity onPress={() => handleAdvanced(i)}>
//                     <Text style={styles.advancedBtn}>Advanced</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => handleSave(i)}>
//                     <Text
//                       style={[
//                         styles.saveBtn,
//                         calibrations[i].saved && styles.savedBtn,
//                       ]}
//                     >
//                       {calibrations[i].saved ? "Saved" : "Save"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {calibrations[i].advanced && (
//                   <Text style={styles.advancedPlaceholder}>
//                     Advanced options coming soon
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       {allCalibrated && (
//         <TouchableOpacity
//           style={styles.submitCalibBtn}
//           onPress={handleSubmitCalibration}
//         >
//           <Text style={styles.submitCalibText}>Submit All</Text>
//         </TouchableOpacity>
//       )}
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

//       {/* existing Modal code */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // existing styles...
//   calibrateBtn: { color: "#0af", marginHorizontal: 8 },
//   calibrationContainer: {
//     padding: 10,
//     backgroundColor: "#222",
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   bulbsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   bulb: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bulbOn: { backgroundColor: "#FFD700" },
//   bulbText: { color: "#000", fontWeight: "bold" },
//   calibrationActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   advancedBtn: { color: "#0af" },
//   advancedPlaceholder: { color: "#FFD700", marginTop: 8 },
//   saveBtn: { color: "#0f0" },
//   savedBtn: { color: "#0a0" },
//   submitCalibBtn: {
//     backgroundColor: "#28a745",
//     padding: 12,
//     borderRadius: 6,
//     margin: 12,
//   },
//   submitCalibText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
// });














// import { useNavigation } from "@react-navigation/native";
// import { useState } from "react";
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


// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [calibrations, setCalibrations] = useState({}); // index -> { bulbs: [bool], advanced: bool, expanded: bool, saved: bool }
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [canvasWidth, setCanvasWidth] = useState(0); // add missing state
//   const [canvasHeight, setCanvasHeight] = useState(0); // add missing state
//   const ws = useRef(null);
//   const navigation = useNavigation();


//   // Calibration handlers
//   const handleCalibrate = (i) => {
//     setCalibrations((prev) => {
//       const prevCal = prev[i] || {};
//       return {
//         ...prev,
//         [i]: {
//           bulbs: prevCal.bulbs || [false, false, false, false],
//           advanced: prevCal.advanced || false,
//           expanded: !prevCal.expanded,
//           saved: prevCal.saved || false,
//         },
//       };
//     });
//   };

//   const toggleBulb = (i, idx) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       const newBulbs = [...cal.bulbs];
//       newBulbs[idx] = !newBulbs[idx];
//       return { ...prev, [i]: { ...cal, bulbs: newBulbs } };
//     });
//   };

//   const handleAdvanced = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, advanced: !cal.advanced } };
//     });
//   };

//   const handleSave = (i) => {
//     setCalibrations((prev) => {
//       const cal = prev[i];
//       return { ...prev, [i]: { ...cal, saved: true } };
//     });
//     Alert.alert("Saved", `Calibration data for "${shapes[i].name}" saved.`);
//   };

//   const allCalibrated =
//     shapes.length > 0 && shapes.every((_, i) => calibrations[i]?.saved);

//   const handleSubmitCalibration = () => {
//     const data = shapes.map((s, i) => [
//       s.name,
//       s.type,
//       s.x.map((x, j) => ({ x, y: s.y[j] })),
//       calibrations[i].bulbs,
//     ]);
//     ws.current.send(
//       JSON.stringify({ action: "submitCalibration", calibrationData: data })
//     );
//     Alert.alert("Submitted", JSON.stringify(data));
//   };

// useEffect(() => {
//   const dummyData = {
//     x: 1234,
//     y: 5678,
//     shapes: [
//       {
//         name: "ZoneA",
//         type: "point",
//         x: [1000],
//         y: [1500],
//         equation: "(x - 1000)^2 + (y - 1500)^2 = 1000000"
//       },
//       {
//         name: "LinePath",
//         type: "line",
//         x: [0, 2000],
//         y: [1000, 3000],
//         equation: "y = 1x + 1000"
//       },
//       {
//         name: "SafeArea",
//         type: "rectangle",
//         x: [1000, 2000, 2000, 1000],
//         y: [1000, 1000, 2000, 2000],
//         equation: "Rectangle with corners (1000,1000), (2000,1000), (2000,2000), (1000,2000)"
//       }
//     ]
//   };

//   setLiveCoords({ x: dummyData.x, y: dummyData.y });
//   setShapes(dummyData.shapes);
// }, []);


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
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
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
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "line") {
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
//       type: selectedShape === "round" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "round") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "line") {
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

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
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
//       {selectedShape === "round" && (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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

//   // ... existing geometry parsing, input handlers, modal code remains unchanged ...

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>
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
//               if (s.type === "line") {
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
//               if (s.type === "rectangle") {
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
//         {/* existing SVG rendering code */}
//       </View>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleCalibrate(i)}>
//                 <Text style={styles.calibrateBtn}>Calibrate</Text>
//               </TouchableOpacity>
//             </View>
//             {calibrations[i]?.expanded && (
//               <View style={styles.calibrationContainer}>
//                 <View style={styles.bulbsRow}>
//                   {calibrations[i].bulbs.map((on, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       onPress={() => toggleBulb(i, idx)}
//                       style={[styles.bulb, on && styles.bulbOn]}
//                     >
//                       <Text style={styles.bulbText}>{idx + 1}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//                 <View style={styles.calibrationActions}>
//                   <TouchableOpacity onPress={() => handleAdvanced(i)}>
//                     <Text style={styles.advancedBtn}>Advanced</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => handleSave(i)}>
//                     <Text
//                       style={[
//                         styles.saveBtn,
//                         calibrations[i].saved && styles.savedBtn,
//                       ]}
//                     >
//                       {calibrations[i].saved ? "Saved" : "Save"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {calibrations[i].advanced && (
//                   <Text style={styles.advancedPlaceholder}>
//                     Advanced options coming soon
//                   </Text>
//                 )}
//               </View>
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       {allCalibrated && (
//         <TouchableOpacity
//           style={styles.submitCalibBtn}
//           onPress={handleSubmitCalibration}
//         >
//           <Text style={styles.submitCalibText}>Submit All</Text>
//         </TouchableOpacity>
//       )}
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

//       {/* existing Modal code */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // existing styles...
//   calibrateBtn: { color: "#0af", marginHorizontal: 8 },
//   calibrationContainer: {
//     padding: 10,
//     backgroundColor: "#222",
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   bulbsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   bulb: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bulbOn: { backgroundColor: "#FFD700" },
//   bulbText: { color: "#000", fontWeight: "bold" },
//   calibrationActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   advancedBtn: { color: "#0af" },
//   advancedPlaceholder: { color: "#FFD700", marginTop: 8 },
//   saveBtn: { color: "#0f0" },
//   savedBtn: { color: "#0a0" },
//   submitCalibBtn: {
//     backgroundColor: "#28a745",
//     padding: 12,
//     borderRadius: 6,
//     margin: 12,
//   },
//   submitCalibText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
// });










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

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);

//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.8.107:81");

//     ws.current.onopen = () => {
//       console.log("✅ WebSocket connected");
//       // Send authentication payload
//       ws.current.send(JSON.stringify({ username: "myUser" }));
//     };

//     ws.current.onmessage = (e) => {
//       try {
//         const data = JSON.parse(e.data);
//         console.log("📥 Received:", data);

//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setLiveCoords({ x: data.x, y: data.y });
//         }

//         if (Array.isArray(data.shapes)) {
//           setShapes(prev => {
//             const merged = [...prev];
//             data.shapes.forEach(s => {
//               const idx = merged.findIndex(
//                 ps => ps.name === s.name && ps.equation === s.equation
//               );
//               if (idx >= 0) {
//                 merged[idx] = s;
//               } else {
//                 merged.push(s);
//               }
//             });
//             return merged;
//           });
//         }
//       } catch (err) {
//         console.warn("❌ JSON parse error:", err);
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error("WS error", e.message);
//     };

//     ws.current.onclose = () => {
//       console.log("WebSocket closed");
//     };

//     return () => {
//       ws.current && ws.current.close();
//     };
//   }, []);

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
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
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
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = i => {
//     const s = shapes[i];
//     setShapeName(s.name);
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     const ni = {};
//     if (s.type === "point") {
//       const c = parseCircleEquation(s.equation);
//       if (c) {
//         ni.center = `${c.h},${c.k}`;
//         ni.radius = String(c.r);
//       }
//     } else if (s.type === "line") {
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
//       type: selectedShape === "round" ? "point" : selectedShape,
//       name: shapeName.trim(),
//     };
//     if (selectedShape === "round") {
//       const { x, y } = parsePair(inputs.center);
//       const r = +inputs.radius;
//       shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
//       shape.x = [x];
//       shape.y = [y];
//     } else if (selectedShape === "line") {
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
//   const shape = shapes[i];
//   Alert.alert("Calibrate", `Starting calibration for ${shape.name}`);
//   // TODO: Implement actual calibration logic here
//   // Example: send WebSocket message
//   ws.current.send(
//     JSON.stringify({
//       action: "calibrate",
//       index: i,
//       name: shape.name,
//     })
//   );
// };

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
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
//       {selectedShape === "round" && (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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
//       <Text style={styles.heading}>Shape Selector</Text>
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
//               if (s.type === "line") {
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
//               if (s.type === "rectangle") {
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
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.list}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(i)}>
//                 <Text style={styles.deleteBtn}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleCalibrate(i)}>
//                 <Text style={styles.calibrateBtn}>Calibrate</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

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
//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   addBtnText: { color: "#000", fontWeight: "bold" },
//   list: { width: "90%", marginTop: 12 },
//   listItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },
//   itemText: { color: "#FFD700" },
//   actions: { flexDirection: "row" },
//   updateBtn: { color: "#0af", marginRight: 12 },
//   deleteBtn: { color: "#f55" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "85%",
//     maxHeight: "80%",
//     backgroundColor: "#111",
//     padding: 20,
//     borderRadius: 8,
//   },
//   buttonContainer: { flexDirection: "row", justifyContent: "center" },
//   button: { padding: 8, margin: 4, backgroundColor: "#222", borderRadius: 6 },
//   activeBtn: { backgroundColor: "#FFD700" },
//   buttonText: { color: "#FFD700" },
//   activeText: { color: "#000", fontWeight: "bold" },
//   input: {
//     backgroundColor: "#222",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },
//   fillBtn: { color: "#FFD700", marginBottom: 12, textDecorationLine: "underline" },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 12,
//   },
//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   cancelBtn: { backgroundColor: "#555" },
//   submitText: { color: "#000", fontWeight: "bold" },
//   calibrateBtn: { color: "#0f0", marginLeft: 12 },

// });







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

// const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

// export default function ShapeSelector() {
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


//   // dimensions of our 2:1 SVG container in pixels
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.8.102:81");

//     ws.current.onopen = () => {
//       console.log("✅ WebSocket connected");
//       // Send authentication payload
//       ws.current.send(JSON.stringify({ username: "myUser" }));
//     };

//     ws.current.onmessage = (e) => {
//       try {
//         const data = JSON.parse(e.data);
//         console.log("📥 Received:", data);

//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setLiveCoords({ x: data.x, y: data.y });
//         }

//         if (Array.isArray(data.shapes)) {
//           setShapes(prev => {
//             const merged = [...prev];
//             data.shapes.forEach(s => {
//               const idx = merged.findIndex(
//                 ps => ps.name === s.name && ps.equation === s.equation
//               );
//               if (idx >= 0) {
//                 merged[idx] = s;
//               } else {
//                 merged.push(s);
//               }
//             });
//             return merged;
//           });
//         }
//       } catch (err) {
//         console.warn("❌ JSON parse error:", err);
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error("WS error", e.message);
//     };

//     ws.current.onclose = () => {
//       console.log("WebSocket closed");
//     };

//     return () => {
//       ws.current && ws.current.close();
//     };
//   }, []);

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
//             onPress={() => setSelectedShape(t)}
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















// --------------------------------------------------------------------------------------------


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

  

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.8.102:81");

//     ws.current.onopen = () => {
//       console.log("✅ WebSocket connected");
//       // Send authentication payload
//       ws.current.send(JSON.stringify({ username: "myUser" }));
//     };

//     ws.current.onmessage = (e) => {
//       try {
//         const data = JSON.parse(e.data);
//         console.log("📥 Received:", data);

//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setLiveCoords({ x: data.x, y: data.y });
//         }

//         if (Array.isArray(data.shapes)) {
//           setShapes(prev => {
//             const merged = [...prev];
//             data.shapes.forEach(s => {
//               const idx = merged.findIndex(
//                 ps => ps.name === s.name && ps.equation === s.equation
//               );
//               if (idx >= 0) {
//                 merged[idx] = s;
//               } else {
//                 merged.push(s);
//               }
//             });
//             return merged;
//           });
//         }
//       } catch (err) {
//         console.warn("❌ JSON parse error:", err);
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error("WS error", e.message);
//     };

//     ws.current.onclose = () => {
//       console.log("WebSocket closed");
//     };

//     return () => {
//       ws.current && ws.current.close();
//     };
//   }, []);

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
  const [calibratingIndex, setCalibratingIndex] = useState(null); // modal state

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


  // dimensions of our 2:1 SVG container in pixels
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.8.100:81");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
      // Send authentication payload
      ws.current.send(JSON.stringify({ username: "Topic" }));
    };

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("📥 Received:", data);

        if (typeof data.x === "number" && typeof data.y === "number") {
          setLiveCoords({ x: data.x, y: data.y });
        }

        if (Array.isArray(data.shapes)) {
          setShapes(prev => {
            const merged = [...prev];
            data.shapes.forEach(s => {
              const idx = merged.findIndex(
                ps => ps.name === s.name && ps.equation === s.equation
              );
              if (idx >= 0) {
                merged[idx] = s;
              } else {
                merged.push(s);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn("❌ JSON parse error:", err);
      }
    };

    ws.current.onerror = (e) => {
      console.error("WS error", e.message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, []);

    // helper math
  const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
  const originX = canvasWidth / 2;
  const originY = 0;
  const toPxX = x => originX + x * scale;
  const toPxY = y => originY + (-y) * scale; // y is negative downwards

  // parse helpers
  const parseCircleEquation = eq => {
    const clean = eq.replace(/\s+/g, "");
    const m = clean.match(/\(x-([-\d.]+)\)\^2\+\(y-([-\d.]+)\)\^2=([-\d.]+)/);
    if (!m) return null;
    return { h: +m[1], k: +m[2], r: Math.sqrt(+m[3]) };
  };

  const parseLineEquation = eq => {
    const clean = eq.replace(/\s+/g, "");
    const m = clean.match(/y=([-\d.]+)x([+-][\d.]+)/i);
    if (!m) return null;
    return { m: +m[1], b: +m[2] };
  };

  const parsePair = s => {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
  };

  // input, autofill, validate, modal handlers
  const handleInputChange = (k, v) =>
    setInputs(prev => ({ ...prev, [k]: v }));
  const autofill = k =>
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

  const openModalForNew = () => {
    setEditingIndex(null);
    setShapeName("");
    setInputs({});
    setSelectedShape("Light Zone");
    setModalVisible(true);
  };

  const openModalForEdit = i => {
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
      const corners = [1, 2, 3, 4].map(n =>
        parsePair(inputs[`rectCorner${n}`])
      );
      shape.equation = `Rectangle with corners ${corners
        .map(p => `(${p.x},${p.y})`)
        .join(", ")}`;
      shape.x = corners.map(p => p.x);
      shape.y = corners.map(p => p.y);
    }

    ws.current.send(
      JSON.stringify({
        action: editingIndex != null ? "update" : "add",
        index: editingIndex,
        shape,
      })
    );

    // **Immediately** reflect it locally, so it never disappears
    setShapes(prev => {
      if (editingIndex != null) {
        const copy = [...prev];
        copy[editingIndex] = shape;
        return copy;
      }
      return [...prev, shape];
    });

    setModalVisible(false);
  };

  const handleDelete = i =>
    Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          ws.current.send(JSON.stringify({ action: "delete", index: i })),
      },
    ]);

  const handleCalibrate = (i) => {
    setCalibratingIndex(i); // open modal
    setCalibrationStates(prev => ({
      ...prev,
      [i]: {
        bulbs: prev[i]?.bulbs || [false, false, false, false],
        submitted: false,
      },
    }));
  };


const toggleBulb = (i, bulbIdx) => {
  setCalibrationStates(prev => {
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
  setCalibrationStates(prev => ({
    ...prev,
    [calibratingIndex]: {
      ...prev[calibratingIndex],
      submitted: true,
    },
  }));
  setCalibratingIndex(null); // close modal
};



  const renderInputs = () => (
    <>
      <View style={styles.buttonContainer}>
        {["Light Zone", "Door", "Bed/Table"].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.button, selectedShape === t && styles.activeBtn]}
            onPress={() => handleShapeSelect(t)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedShape === t && styles.activeText,
              ]}
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
            onChangeText={t => handleInputChange("center", t)}
          />
          <TouchableOpacity onPress={() => autofill("center")}>
            <Text style={styles.fillBtn}>Use Current Pos</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Radius (mm)"
            style={styles.input}
            keyboardType="numeric"
            value={inputs.radius || ""}
            onChangeText={t => handleInputChange("radius", t)}
          />
        </>
      )}
      {selectedShape === "Door" &&
        [1, 2].map(n => (
          <View key={n}>
            <TextInput
              placeholder={`Corner ${n} (x,y)`}
              style={styles.input}
              value={inputs[`lineCorner${n}`] || ""}
              onChangeText={t => handleInputChange(`lineCorner${n}`, t)}
            />
            <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}>
              <Text style={styles.fillBtn}>Use Current Pos</Text>
            </TouchableOpacity>
          </View>
        ))}
      {selectedShape === "Bed/Table" &&
        [1, 2, 3, 4].map(n => (
          <View key={n}>
            <TextInput
              placeholder={`Corner ${n} (x,y)`}
              style={styles.input}
              value={inputs[`rectCorner${n}`] || ""}
              onChangeText={t => handleInputChange(`rectCorner${n}`, t)}
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
        onLayout={e => {
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
            <Line
              x1={0}
              y1={0}
              x2={canvasWidth}
              y2={0}
              stroke="gray"
              strokeWidth={1}
            />
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
      {/* ✅ Shape Name */}
      <Text style={styles.itemText}>
        {s.name} ({s.type})
      </Text>

      {/* ✅ Action Buttons */}
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

      {/* 🔆 Show only the submitted result here */}
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
              💡 {calibrationStates[calibratingIndex]?.bulbs?.[bulbIdx] ? "ON" : "OFF"}
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
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },

  heading: {
    color: "#FFD700",
    fontSize: 24,
    marginVertical: 12,
  },

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

  // 🔲 Modal Styles
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