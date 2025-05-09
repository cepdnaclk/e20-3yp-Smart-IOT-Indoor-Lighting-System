// import React, { useEffect, useState } from 'react';

// // Main component
// const RadarDataReceiver = () => {
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');

//   useEffect(() => {
//     const ws = new WebSocket('ws://<ESP32-IP>:81'); // Replace <ESP32-IP> with actual IP

//     ws.onopen = () => {
//       console.log('✅ Connected to ESP32 WebSocket server');
//       setConnectionStatus('Connected');
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log('📡 Incoming Data:', data);

//         if (typeof data.x === 'number' && typeof data.y === 'number') {
//           setCoordinates({ x: data.x, y: data.y });
//         }

//         if (Array.isArray(data.shapes)) {
//           setShapes(data.shapes);
//         }
//       } catch (error) {
//         console.error('❌ Error parsing WebSocket message:', error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('❌ WebSocket Error:', error);
//       setConnectionStatus('Error');
//     };

//     ws.onclose = () => {
//       console.warn('⚠️ WebSocket closed');
//       setConnectionStatus('Disconnected');
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Radar Target Data Viewer</h1>
//       <p>Status: <strong>{connectionStatus}</strong></p>

//       <section style={styles.section}>
//         <h2>📍 Live Coordinates:</h2>
//         <p>X: <strong>{coordinates.x}</strong> &nbsp; Y: <strong>{coordinates.y}</strong></p>
//       </section>

//       <section style={styles.section}>
//         <h2>📐 Saved Shapes:</h2>
//         {shapes.length > 0 ? (
//           <ul>
//             {shapes.map((shape, index) => (
//               <li key={index} style={styles.shapeCard}>
//                 <p><b>{shape.name}</b> (<i>{shape.type}</i>)</p>
//                 <p>Equation: <code>{shape.equation}</code></p>
//                 <div>
//                   <p><u>Coordinates:</u></p>
//                   <ul>
//                     {shape.x.map((xVal, i) => (
//                       <li key={i}>X: {xVal}, Y: {shape.y[i]}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No shapes saved yet.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//     backgroundColor: '#f4f4f4',
//     minHeight: '100vh',
//   },
//   title: {
//     color: '#333',
//   },
//   section: {
//     marginTop: '20px',
//     backgroundColor: '#fff',
//     padding: '15px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//   },
//   shapeCard: {
//     marginBottom: '15px',
//     padding: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     backgroundColor: '#fafafa',
//   },
// };

// export default RadarDataReceiver;




// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";

// const RadarDataReceiver = () => {
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [status, setStatus] = useState("Connecting...");

//   useEffect(() => {
//     const ws = new WebSocket("ws://10.40.19.142:81"); // replace <ESP32-IP>

//     ws.onopen = () => {
//       setStatus("Connected");
//       console.log("✅ WebSocket Connected");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setCoordinates({ x: data.x, y: data.y });
//         }
//         if (Array.isArray(data.shapes)) {
//           setShapes(data.shapes);
//         }
//       } catch (err) {
//         console.error("Error parsing message:", err);
//       }
//     };

//     ws.onerror = () => setStatus("Error");
//     ws.onclose = () => setStatus("Disconnected");

//     return () => ws.close();
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Radar Target Data</Text>
//       <Text>Status: {status}</Text>

//       <Text style={styles.subheading}>Live Coordinates:</Text>
//       <Text>X: {coordinates.x} Y: {coordinates.y}</Text>

//       <Text style={styles.subheading}>Saved Shapes:</Text>
//       {shapes.length === 0 ? (
//         <Text>No shapes saved.</Text>
//       ) : (
//         shapes.map((shape, index) => (
//           <View key={index} style={styles.shapeCard}>
//             <Text style={styles.shapeTitle}>
//               {shape.name} ({shape.type})
//             </Text>
//             <Text>Equation: {shape.equation}</Text>
//             <Text>Coordinates:</Text>
//             {shape.x.map((xVal, i) => (
//               <Text key={i}>
//                 X: {xVal}, Y: {shape.y[i]}
//               </Text>
//             ))}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subheading: {
//     marginTop: 15,
//     fontWeight: "bold",
//   },
//   shapeCard: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },
//   shapeTitle: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
// });

// export default RadarDataReceiver;




// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";

// const RadarDataReceiver = () => {
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [status, setStatus] = useState("Connecting...");
//   const [lastUpdated, setLastUpdated] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://192.168.7.115:81"); // Replace with your ESP32 IP

//     ws.onopen = () => {
//       setStatus("Connected");
//       console.log("✅ WebSocket Connected");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setCoordinates({ x: data.x, y: data.y });
//           setLastUpdated(new Date().toLocaleTimeString());
//         }
//         if (Array.isArray(data.shapes)) {
//           setShapes(data.shapes);
//         }
//       } catch (err) {
//         console.error("Error parsing message:", err);
//       }
//     };

//     ws.onerror = () => {
//       setStatus("Error");
//     };

//     ws.onclose = () => {
//       setStatus("Disconnected");
//     };

//     return () => ws.close(); // Clean up on unmount
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Radar Target Data</Text>
//       <Text>Status: {status}</Text>

//       <Text style={styles.subheading}>Live Coordinates:</Text>
//       <Text>X: {coordinates.x} Y: {coordinates.y}</Text>
//       <Text style={styles.timestamp}>
//         Last Updated: {lastUpdated || "Waiting..."}
//       </Text>

//       <Text style={styles.subheading}>Saved Shapes:</Text>
//       {shapes.length === 0 ? (
//         <Text>No shapes saved.</Text>
//       ) : (
//         shapes.map((shape, index) => (
//           <View key={index} style={styles.shapeCard}>
//             <Text style={styles.shapeTitle}>
//               {shape.name} ({shape.type})
//             </Text>
//             <Text>Equation: {shape.equation}</Text>
//             <Text>Coordinates:</Text>
//             {shape.x.map((xVal, i) => (
//               <Text key={i}>
//                 X: {xVal}, Y: {shape.y[i]}
//               </Text>
//             ))}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subheading: {
//     marginTop: 15,
//     fontWeight: "bold",
//   },
//   timestamp: {
//     color: "#666",
//     marginTop: 4,
//     fontStyle: "italic",
//   },
//   shapeCard: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },
//   shapeTitle: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
// });

// export default RadarDataReceiver;














// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import Svg, { Circle, Line, Rect } from "react-native-svg";

// const RadarDataReceiver = () => {
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [status, setStatus] = useState("Connecting...");
//   const [lastUpdated, setLastUpdated] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://10.40.19.142:81"); // Replace with ESP32 IP

//     ws.onopen = () => {
//       setStatus("Connected");
//       console.log("✅ WebSocket Connected");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (typeof data.x === "number" && typeof data.y === "number") {
//           setCoordinates({ x: data.x, y: data.y });
//           setLastUpdated(new Date().toLocaleTimeString());
//         }
//         if (Array.isArray(data.shapes)) {
//           setShapes(data.shapes);
//         }
//       } catch (err) {
//         console.error("Error parsing message:", err);
//       }
//     };

//     ws.onerror = () => {
//       setStatus("Error");
//     };

//     ws.onclose = () => {
//       setStatus("Disconnected");
//     };

//     return () => ws.close();
//   }, []);

//   const scale = 0.05;
//   const center = 150;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Radar Target Data</Text>
//       <Text>Status: {status}</Text>

//       <Text style={styles.subheading}>Live Coordinates:</Text>
//       <Text>X: {coordinates.x} Y: {coordinates.y}</Text>
//       <Text style={styles.timestamp}>
//         Last Updated: {lastUpdated || "Waiting..."}
//       </Text>

//       <Svg height="300" width="300" style={styles.canvas}>
//         {/* Axes */}
//         <Line x1={center} y1={0} x2={center} y2={300} stroke="#ccc" strokeWidth="1" />
//         <Line x1={0} y1={center} x2={300} y2={center} stroke="#ccc" strokeWidth="1" />

//         {/* Live point */}
//         <Circle
//           cx={center + coordinates.x * scale}
//           cy={center - coordinates.y * scale}
//           r="4"
//           fill="red"
//         />

//         {/* Shapes */}
//         {shapes.map((shape, idx) => {
//           if (shape.type === "point") {
//             return (
//               <Circle
//                 key={idx}
//                 cx={center + shape.x[0] * scale}
//                 cy={center - shape.y[0] * scale}
//                 r={shape.radius * scale || 10}
//                 fill="rgba(0,255,0,0.3)"
//               />
//             );
//           } else if (shape.type === "line") {
//             return (
//               <Line
//                 key={idx}
//                 x1={center + shape.x[0] * scale}
//                 y1={center - shape.y[0] * scale}
//                 x2={center + shape.x[1] * scale}
//                 y2={center - shape.y[1] * scale}
//                 stroke="blue"
//                 strokeWidth="2"
//               />
//             );
//           } else if (shape.type === "rectangle") {
//             const x = Math.min(...shape.x);
//             const y = Math.min(...shape.y);
//             const width = Math.abs(shape.x[1] - shape.x[0]);
//             const height = Math.abs(shape.y[2] - shape.y[1]);
//             return (
//               <Rect
//                 key={idx}
//                 x={center + x * scale}
//                 y={center - (y + height) * scale}
//                 width={width * scale}
//                 height={height * scale}
//                 stroke="purple"
//                 strokeWidth="2"
//                 fill="rgba(128,0,128,0.2)"
//               />
//             );
//           }
//           return null;
//         })}
//       </Svg>

//       <Text style={styles.subheading}>Saved Shapes:</Text>
//       {shapes.length === 0 ? (
//         <Text>No shapes saved.</Text>
//       ) : (
//         shapes.map((shape, index) => (
//           <View key={index} style={styles.shapeCard}>
//             <Text style={styles.shapeTitle}>
//               {shape.name} ({shape.type})
//             </Text>
//             <Text>Equation: {shape.equation}</Text>
//             <Text>Coordinates:</Text>
//             {shape.x.map((xVal, i) => (
//               <Text key={i}>
//                 X: {xVal}, Y: {shape.y[i]}
//               </Text>
//             ))}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subheading: {
//     marginTop: 15,
//     fontWeight: "bold",
//   },
//   timestamp: {
//     color: "#666",
//     marginTop: 4,
//     fontStyle: "italic",
//   },
//   canvas: {
//     borderWidth: 1,
//     borderColor: "#000",
//     marginTop: 20,
//   },
//   shapeCard: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },
//   shapeTitle: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
// });

// export default RadarDataReceiver;

// -----------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import Svg, { Circle, Line, Rect } from "react-native-svg";

// const RadarDataReceiver = () => {
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   useEffect(() => {
//     // Simulate live coordinate updates
//     const interval = setInterval(() => {
//       const x = Math.floor(Math.random() * 3000 - 1500);
//       const y = Math.floor(Math.random() * 2000 - 1000);
//       setCoordinates({ x, y });
//       setLastUpdated(new Date().toLocaleTimeString());
//     }, 1000);

//     // Dummy shape data
//     setShapes([
//       {
//         name: "Main Light",
//         type: "point",
//         equation: "(x - 500)^2 + (y - 600)^2 = 4000000",
//         x: [500],
//         y: [-2000],
//         radius: 2000,
//       },
//       {
//         name: "Door Area",
//         type: "line",
//         equation: "y = -11.8x -5941.2",
//         x: [-2500, -800],
//         y: [-3000, -5000],
//       },
//       {
//         name: "Bed Zone",
//         type: "rectangle",
//         equation: "Rectangle with corners (100,-100), (2200,-100), (2200,-2200), (100,-2200)",
//         x: [100, 2200, 2200, 100],
//         y: [-100, -100, -2200, -2200],
//       },
//     ]);

//     return () => clearInterval(interval);
//   }, []);

//   const scale = 0.05;
//   const center = 150;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Radar Target Data</Text>
//       <Text>Status: Simulated</Text>

//       <Text style={styles.subheading}>Live Coordinates:</Text>
//       <Text>X: {coordinates.x} Y: {coordinates.y}</Text>
//       <Text style={styles.timestamp}>
//         Last Updated: {lastUpdated || "Waiting..."}
//       </Text>

//       <Svg height="300" width="300" style={styles.canvas}>
//         {/* Axes */}
//         <Line x1={center} y1={0} x2={center} y2={300} stroke="#ccc" strokeWidth="1" />
//         <Line x1={0} y1={center} x2={300} y2={center} stroke="#ccc" strokeWidth="1" />

//         {/* Live point */}
//         <Circle
//           cx={center + coordinates.x * scale}
//           cy={center - coordinates.y * scale}
//           r="4"
//           fill="red"
//         />

//         {/* Shapes */}
//         {shapes.map((shape, idx) => {
//           if (shape.type === "point") {
//             return (
//               <Circle
//                 key={idx}
//                 cx={center + shape.x[0] * scale}
//                 cy={center - shape.y[0] * scale}
//                 r={(shape.radius || 1000) * scale}
//                 fill="rgba(0,255,0,0.3)"
//               />
//             );
//           } else if (shape.type === "line") {
//             return (
//               <Line
//                 key={idx}
//                 x1={center + shape.x[0] * scale}
//                 y1={center - shape.y[0] * scale}
//                 x2={center + shape.x[1] * scale}
//                 y2={center - shape.y[1] * scale}
//                 stroke="blue"
//                 strokeWidth="2"
//               />
//             );
//           } else if (shape.type === "rectangle") {
//             const x = Math.min(...shape.x);
//             const y = Math.min(...shape.y);
//             const width = Math.abs(shape.x[1] - shape.x[0]);
//             const height = Math.abs(shape.y[2] - shape.y[1]);
//             return (
//               <Rect
//                 key={idx}
//                 x={center + x * scale}
//                 y={center - (y + height) * scale}
//                 width={width * scale}
//                 height={height * scale}
//                 stroke="purple"
//                 strokeWidth="2"
//                 fill="rgba(128,0,128,0.2)"
//               />
//             );
//           }
//           return null;
//         })}
//       </Svg>

//       <Text style={styles.subheading}>Saved Shapes:</Text>
//       {shapes.length === 0 ? (
//         <Text>No shapes saved.</Text>
//       ) : (
//         shapes.map((shape, index) => (
//           <View key={index} style={styles.shapeCard}>
//             <Text style={styles.shapeTitle}>
//               {shape.name} ({shape.type})
//             </Text>
//             <Text>Equation: {shape.equation}</Text>
//             <Text>Coordinates:</Text>
//             {shape.x.map((xVal, i) => (
//               <Text key={i}>
//                 X: {xVal}, Y: {shape.y[i]}
//               </Text>
//             ))}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subheading: {
//     marginTop: 15,
//     fontWeight: "bold",
//   },
//   timestamp: {
//     color: "#666",
//     marginTop: 4,
//     fontStyle: "italic",
//   },
//   canvas: {
//     borderWidth: 1,
//     borderColor: "#000",
//     marginTop: 20,
//   },
//   shapeCard: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },
//   shapeTitle: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
// });

// export default RadarDataReceiver;


// -----------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
// } from "react-native";
// import Svg, { Circle, Rect, Line } from "react-native-svg";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [inputs, setInputs] = useState({});
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);

//   // Simulated live coordinate updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const x = Math.floor(Math.random() * 3000 - 1500);
//       const y = Math.floor(Math.random() * 2000 - 1000);
//       setLiveCoords({ x, y });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleInputChange = (key, value) => {
//     setInputs((prev) => ({ ...prev, [key]: value }));
//   };

//   const autofill = (key) => {
//     handleInputChange(key, `${liveCoords.x},${liveCoords.y}`);
//   };

//   const validateInputs = () => {
//     if (selectedShape === "round") {
//       return inputs.center && inputs.radius;
//     } else if (selectedShape === "line") {
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     } else if (selectedShape === "rectangle") {
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     }
//     return false;
//   };

//   const parseCoord = (str) => {
//     const parts = str.split(",").map((p) => parseInt(p.trim(), 10));
//     return { x: parts[0], y: parts[1] };
//   };

//   const handleSubmit = () => {
//     if (!validateInputs()) {
//       Alert.alert("Error", "Please complete all required fields.");
//       return;
//     }

//     let shape = { type: selectedShape };
//     if (selectedShape === "round") {
//       const { x, y } = parseCoord(inputs.center);
//       shape = { ...shape, x: [x], y: [y], radius: parseInt(inputs.radius, 10) };
//     } else if (selectedShape === "line") {
//       const p1 = parseCoord(inputs.lineCorner1);
//       const p2 = parseCoord(inputs.lineCorner2);
//       shape = { ...shape, x: [p1.x, p2.x], y: [p1.y, p2.y] };
//     } else if (selectedShape === "rectangle") {
//       const corners = [
//         parseCoord(inputs.rectCorner1),
//         parseCoord(inputs.rectCorner2),
//         parseCoord(inputs.rectCorner3),
//         parseCoord(inputs.rectCorner4),
//       ];
//       shape = {
//         ...shape,
//         x: corners.map((p) => p.x),
//         y: corners.map((p) => p.y),
//       };
//     }
//     setShapes((prev) => [...prev, shape]);
//     Alert.alert("Success", "Shape saved.");
//     setInputs({});
//   };

//   const renderSVGShapes = () => {
//     const scale = 0.05;
//     const center = 150;

//     return shapes.map((shape, idx) => {
//       if (shape.type === "round") {
//         return (
//           <Circle
//             key={idx}
//             cx={center + shape.x[0] * scale}
//             cy={center - shape.y[0] * scale}
//             r={shape.radius * scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         );
//       } else if (shape.type === "line") {
//         return (
//           <Line
//             key={idx}
//             x1={center + shape.x[0] * scale}
//             y1={center - shape.y[0] * scale}
//             x2={center + shape.x[1] * scale}
//             y2={center - shape.y[1] * scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         );
//       } else if (shape.type === "rectangle") {
//         const x = Math.min(...shape.x);
//         const y = Math.min(...shape.y);
//         const width = Math.abs(shape.x[1] - shape.x[0]);
//         const height = Math.abs(shape.y[2] - shape.y[1]);
//         return (
//           <Rect
//             key={idx}
//             x={center + x * scale}
//             y={center - (y + height) * scale}
//             width={width * scale}
//             height={height * scale}
//             stroke="purple"
//             strokeWidth={2}
//             fill="rgba(128,0,128,0.2)"
//           />
//         );
//       }
//       return null;
//     });
//   };

//   const renderShapeInputs = () => {
//     switch (selectedShape) {
//       case "round":
//         return (
//           <>
//             <Text style={styles.instruction}>Sit at the center of the circle.</Text>
//             <TextInput
//               placeholder="Center (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs.center || ""}
//               onChangeText={(t) => handleInputChange("center", t)}
//             />
//             <TouchableOpacity onPress={() => autofill("center")}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//             <TextInput
//               placeholder="Radius"
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs.radius || ""}
//               onChangeText={(t) => handleInputChange("radius", t)}
//               keyboardType="numeric"
//             />
//           </>
//         );
//       case "line":
//         return [1, 2].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`lineCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ));
//       case "rectangle":
//         return [1, 2, 3, 4].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`rectCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ));
//       default:
//         return null;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>

//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map((shape) => (
//           <TouchableOpacity
//             key={shape}
//             style={[styles.button, selectedShape === shape && styles.activeBtn]}
//             onPress={() => {
//               setSelectedShape(shape);
//               setInputs({});
//             }}
//           >
//             <Text
//               style={[styles.buttonText, selectedShape === shape && styles.activeText]}
//             >
//               {shape.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         <Circle
//           cx={150 + liveCoords.x * 0.05}
//           cy={150 - liveCoords.y * 0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       <ScrollView contentContainerStyle={styles.scroll}>{renderShapeInputs()}</ScrollView>

//       <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//         <Text style={styles.submitText}>Submit Shape</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#111", alignItems: "center" },
//   heading: { color: "#fff", fontSize: 24, marginTop: 20 },
//   buttonContainer: { flexDirection: "row", marginVertical: 10 },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     marginHorizontal: 5,
//     backgroundColor: "#444",
//     borderRadius: 6,
//   },
//   activeBtn: { backgroundColor: "#FFD700" },
//   buttonText: { color: "#ccc" },
//   activeText: { color: "#000", fontWeight: "bold" },
//   input: {
//     backgroundColor: "#222",
//     color: "#fff",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//   },
//   fillBtn: {
//     color: "#0af",
//     marginBottom: 8,
//     textDecorationLine: "underline",
//   },
//   scroll: {
//     width: "90%",
//     paddingBottom: 20,
//   },
//   svgCanvas: {
//     backgroundColor: "#fff",
//     marginVertical: 20,
//     borderRadius: 6,
//   },
//   submitBtn: {
//     backgroundColor: "#28a745",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//     marginBottom: 30,
//   },
//   submitText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// // ------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
// } from "react-native";
// import Svg, { Circle, Rect, Line } from "react-native-svg";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);

//   // Simulated live coordinate updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const x = Math.floor(Math.random() * 3000 - 1500);
//       const y = Math.floor(Math.random() * 2000 - 1000);
//       setLiveCoords({ x, y });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleInputChange = (key, value) => {
//     setInputs((prev) => ({ ...prev, [key]: value }));
//   };

//   const autofill = (key) => {
//     handleInputChange(key, `${liveCoords.x},${liveCoords.y}`);
//   };

//   const validateInputs = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "round") {
//       return inputs.center && inputs.radius;
//     } else if (selectedShape === "line") {
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     } else if (selectedShape === "rectangle") {
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     }
//     return false;
//   };

//   const parseCoord = (str) => {
//     const parts = str.split(",").map((p) => parseInt(p.trim(), 10));
//     return { x: parts[0], y: parts[1] };
//   };

//   const handleSubmit = () => {
//     if (!validateInputs()) {
//       Alert.alert("Error", "Please provide a name and complete all required fields.");
//       return;
//     }

//     let shape = { type: selectedShape, name: shapeName.trim() };
//     if (selectedShape === "round") {
//       const { x, y } = parseCoord(inputs.center);
//       shape = { ...shape, x: [x], y: [y], radius: parseInt(inputs.radius, 10) };
//     } else if (selectedShape === "line") {
//       const p1 = parseCoord(inputs.lineCorner1);
//       const p2 = parseCoord(inputs.lineCorner2);
//       shape = { ...shape, x: [p1.x, p2.x], y: [p1.y, p2.y] };
//     } else if (selectedShape === "rectangle") {
//       const corners = [
//         parseCoord(inputs.rectCorner1),
//         parseCoord(inputs.rectCorner2),
//         parseCoord(inputs.rectCorner3),
//         parseCoord(inputs.rectCorner4),
//       ];
//       shape = {
//         ...shape,
//         x: corners.map((p) => p.x),
//         y: corners.map((p) => p.y),
//       };
//     }

//     if (editingIndex !== null) {
//       const updated = [...shapes];
//       updated[editingIndex] = shape;
//       setShapes(updated);
//       Alert.alert("Success", "Shape updated.");
//     } else {
//       setShapes((prev) => [...prev, shape]);
//       Alert.alert("Success", "Shape saved.");
//     }

//     // reset form
//     setShapeName("");
//     setInputs({});
//     setEditingIndex(null);
//   };

//   const handleDelete = (idx) => {
//     Alert.alert(
//       "Confirm Delete",
//       `Delete shape \"${shapes[idx].name}\"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             setShapes((prev) => prev.filter((_, i) => i !== idx));
//           },
//         },
//       ]
//     );
//   };

//   const handleEdit = (idx) => {
//     const shape = shapes[idx];
//     setSelectedShape(shape.type);
//     setShapeName(shape.name);
//     const newInputs = {};
//     if (shape.type === "round") {
//       newInputs.center = `${shape.x[0]},${shape.y[0]}`;
//       newInputs.radius = String(shape.radius);
//     } else if (shape.type === "line") {
//       newInputs.lineCorner1 = `${shape.x[0]},${shape.y[0]}`;
//       newInputs.lineCorner2 = `${shape.x[1]},${shape.y[1]}`;
//     } else if (shape.type === "rectangle") {
//       newInputs.rectCorner1 = `${shape.x[0]},${shape.y[0]}`;
//       newInputs.rectCorner2 = `${shape.x[1]},${shape.y[1]}`;
//       newInputs.rectCorner3 = `${shape.x[2]},${shape.y[2]}`;
//       newInputs.rectCorner4 = `${shape.x[3]},${shape.y[3]}`;
//     }
//     setInputs(newInputs);
//     setEditingIndex(idx);
//   };

//   const renderSVGShapes = () => {
//     const scale = 0.05;
//     const center = 150;

//     return shapes.map((shape, idx) => {
//       if (shape.type === "round") {
//         return (
//           <Circle
//             key={idx}
//             cx={center + shape.x[0] * scale}
//             cy={center - shape.y[0] * scale}
//             r={shape.radius * scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         );
//       } else if (shape.type === "line") {
//         return (
//           <Line
//             key={idx}
//             x1={center + shape.x[0] * scale}
//             y1={center - shape.y[0] * scale}
//             x2={center + shape.x[1] * scale}
//             y2={center - shape.y[1] * scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         );
//       } else if (shape.type === "rectangle") {
//         const x = Math.min(...shape.x);
//         const y = Math.min(...shape.y);
//         const width = Math.abs(shape.x[1] - shape.x[0]);
//         const height = Math.abs(shape.y[2] - shape.y[1]);
//         return (
//           <Rect
//             key={idx}
//             x={center + x * scale}
//             y={center - (y + height) * scale}
//             width={width * scale}
//             height={height * scale}
//             stroke="purple"
//             strokeWidth={2}
//             fill="rgba(128,0,128,0.2)"
//           />
//         );
//       }
//       return null;
//     });
//   };

//   const renderShapeInputs = () => {
//     return (
//       <>
//         <TextInput
//           placeholder="Shape Name"
//           style={styles.input}
//           placeholderTextColor="#999"
//           value={shapeName}
//           onChangeText={setShapeName}
//         />
//         {selectedShape === "round" && (
//           <>
//             <Text style={styles.instruction}>Sit at the center of the circle.</Text>
//             <TextInput
//               placeholder="Center (x,y)"
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs.center || ""}
//               onChangeText={(t) => handleInputChange("center", t)}
//             />
//             <TouchableOpacity onPress={() => autofill("center")}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//             <TextInput
//               placeholder="Radius"
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs.radius || ""}
//               onChangeText={(t) => handleInputChange("radius", t)}
//               keyboardType="numeric"
//             />
//           </>
//         )}
//         {selectedShape === "line" && [1, 2].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`lineCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`lineCorner${n}`)}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//         {selectedShape === "rectangle" && [1, 2, 3, 4].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={(t) => handleInputChange(`rectCorner${n}`, t)}
//             />
//             <TouchableOpacity onPress={() => autofill(`rectCorner${n}`)}> 
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>

//       <View style={styles.buttonContainer}>
//         {['round', 'line', 'rectangle'].map((shape) => (
//           <TouchableOpacity
//             key={shape}
//             style={[styles.button, selectedShape === shape && styles.activeBtn]}
//             onPress={() => {
//               setSelectedShape(shape);
//               setInputs({});
//               setEditingIndex(null);
//               setShapeName("");
//             }}
//           >
//             <Text
//               style={[styles.buttonText, selectedShape === shape && styles.activeText]}
//             >
//               {shape.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         <Circle
//           cx={150 + liveCoords.x * 0.05}
//           cy={150 - liveCoords.y * 0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       <ScrollView contentContainerStyle={styles.scroll}>
//         {renderShapeInputs()}
//       </ScrollView>

//       <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//         <Text style={styles.submitText}>{editingIndex !== null ? 'Update Shape' : 'Submit Shape'}</Text>
//       </TouchableOpacity>

//       {shapes.length > 0 && (
//         <View style={styles.listContainer}>
//           {shapes.map((shape, idx) => (
//             <View key={idx} style={styles.listItem}>
//               <Text style={styles.itemText}>{shape.name} ({shape.type})</Text>
//               <View style={styles.actionBtns}>
//                 <TouchableOpacity onPress={() => handleEdit(idx)}>
//                   <Text style={styles.editBtn}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDelete(idx)}>
//                   <Text style={styles.deleteBtn}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",  // pure black
//     alignItems: "center",
//   },
//   heading: {
//     color: "#FFD700",            // dark yellow
//     fontSize: 24,
//     marginTop: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginVertical: 10,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     marginHorizontal: 5,
//     backgroundColor: "#111111",  // very dark gray
//     borderRadius: 6,
//   },
//   activeBtn: {
//     backgroundColor: "#FFD700",  // dark yellow
//   },
//   buttonText: {
//     color: "#FFD700",            // ensure text stands out
//   },
//   activeText: {
//     color: "#000000",            // black on yellow
//     fontWeight: "bold",
//   },
//   input: {
//     backgroundColor: "#111111",  // match button
//     color: "#FFD700",            // dark yellow text
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//     width: 250,
//   },
//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 8,
//     textDecorationLine: "underline",
//   },
//   scroll: {
//     width: "90%",
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   svgCanvas: {
//     backgroundColor: "#000000",  // black canvas
//     marginVertical: 20,
//     borderRadius: 6,
//   },
//   submitBtn: {
//     backgroundColor: "#FFD700",  // dark yellow
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   submitText: {
//     color: "#000000",            // black on yellow
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   listContainer: {
//     width: "90%",
//     marginTop: 10,
//   },
//   listItem: {
//     backgroundColor: "#111111",  // dark gray
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   itemText: {
//     color: "#FFD700",
//     fontSize: 16,
//   },
//   actionBtns: {
//     flexDirection: "row",
//   },
//   editBtn: {
//     color: "#FFD700",
//     marginRight: 12,
//   },
//   deleteBtn: {
//     color: "#FFD700",
//   },
//   instruction: {
//     color: "#FFD700",
//     marginBottom: 4,
//   },
// });





// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
// } from "react-native";
// import Svg, { Circle, Rect, Line } from "react-native-svg";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const ws = useRef(null);

//   // —— Replace dummy coords with real data from WebSocket ——
//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.7.115:81"); // your ESP32 address

//     ws.current.onopen = () => {
//       console.log("🔌 WebSocket Connected");
//     };

//     ws.current.onmessage = ({ data }) => {
//       try {
//         const msg = JSON.parse(data);
//         // if incoming message has x,y coords:
//         if (
//           typeof msg.x === "number" &&
//           typeof msg.y === "number"
//         ) {
//           setLiveCoords({ x: msg.x, y: msg.y });
//         }
//         // if you're also streaming saved shapes from ESP:
//         if (Array.isArray(msg.shapes)) {
//           setShapes(msg.shapes);
//         }
//       } catch (e) {
//         console.warn("⚠ MALFORMED WS MSG:", data);
//       }
//     };

//     ws.current.onerror = (e) => {
//       console.error("WS Error:", e.message);
//     };

//     ws.current.onclose = (e) => {
//       console.log("WebSocket Closed", e.code, e.reason);
//     };

//     return () => {
//       ws.current && ws.current.close();
//     };
//   }, []);

//   const handleInputChange = (key, value) =>
//     setInputs((prev) => ({ ...prev, [key]: value }));

//   const autofill = (key) =>
//     handleInputChange(key, `${liveCoords.x},${liveCoords.y}`);

//   const validateInputs = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "round")
//       return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     return false;
//   };

//   const parseCoord = (str) => {
//     const [x, y] = str.split(",").map((s) => parseInt(s.trim(), 10));
//     return { x, y };
//   };

//   const handleSubmit = () => {
//     if (!validateInputs()) {
//       Alert.alert(
//         "Error",
//         "Please provide a name and complete all required fields."
//       );
//       return;
//     }

//     let shape = { type: selectedShape, name: shapeName.trim() };
//     if (selectedShape === "round") {
//       const { x, y } = parseCoord(inputs.center);
//       shape = { ...shape, x: [x], y: [y], radius: +inputs.radius };
//     } else if (selectedShape === "line") {
//       const p1 = parseCoord(inputs.lineCorner1);
//       const p2 = parseCoord(inputs.lineCorner2);
//       shape = { ...shape, x: [p1.x, p2.x], y: [p1.y, p2.y] };
//     } else {
//       const corners = [
//         parseCoord(inputs.rectCorner1),
//         parseCoord(inputs.rectCorner2),
//         parseCoord(inputs.rectCorner3),
//         parseCoord(inputs.rectCorner4),
//       ];
//       shape = {
//         ...shape,
//         x: corners.map((p) => p.x),
//         y: corners.map((p) => p.y),
//       };
//     }

//     if (editingIndex != null) {
//       const updated = [...shapes];
//       updated[editingIndex] = shape;
//       setShapes(updated);
//       Alert.alert("Success", "Shape updated.");
//     } else {
//       setShapes((prev) => [...prev, shape]);
//       Alert.alert("Success", "Shape saved.");
//     }

//     setShapeName("");
//     setInputs({});
//     setEditingIndex(null);
//   };

//   const handleDelete = (i) =>
//     Alert.alert(
//       "Confirm Delete",
//       `Delete shape "${shapes[i].name}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () =>
//             setShapes((prev) => prev.filter((_, idx) => idx !== i)),
//         },
//       ]
//     );

//   const handleEdit = (i) => {
//     const s = shapes[i];
//     setSelectedShape(s.type);
//     setShapeName(s.name);
//     const ni = {};
//     if (s.type === "round") {
//       ni.center = `${s.x[0]},${s.y[0]}`;
//       ni.radius = String(s.radius);
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
//   };

//   const renderSVGShapes = () => {
//     const scale = 0.05,
//       center = 150;
//     return shapes.map((s, i) => {
//       if (s.type === "round")
//         return (
//           <Circle
//             key={i}
//             cx={center + s.x[0] * scale}
//             cy={center - s.y[0] * scale}
//             r={s.radius * scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         );
//       if (s.type === "line")
//         return (
//           <Line
//             key={i}
//             x1={center + s.x[0] * scale}
//             y1={center - s.y[0] * scale}
//             x2={center + s.x[1] * scale}
//             y2={center - s.y[1] * scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         );
//       // rectangle
//       const x0 = Math.min(...s.x),
//         y0 = Math.min(...s.y),
//         w = Math.abs(s.x[1] - s.x[0]),
//         h = Math.abs(s.y[2] - s.y[1]);
//       return (
//         <Rect
//           key={i}
//           x={center + x0 * scale}
//           y={center - (y0 + h) * scale}
//           width={w * scale}
//           height={h * scale}
//           stroke="purple"
//           strokeWidth={2}
//           fill="rgba(128,0,128,0.2)"
//         />
//       );
//     });
//   };

//   const renderShapeInputs = () => (
//     <>
//       <TextInput
//         placeholder="Shape Name"
//         style={styles.input}
//         placeholderTextColor="#999"
//         value={shapeName}
//         onChangeText={setShapeName}
//       />
//       {selectedShape === "round" && (
//         <>
//           <Text style={styles.instruction}>
//             Sit at the center of the circle.
//           </Text>
//           <TextInput
//             placeholder="Center (x,y)"
//             style={styles.input}
//             placeholderTextColor="#999"
//             value={inputs.center || ""}
//             onChangeText={(t) => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Position</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius"
//             style={styles.input}
//             placeholderTextColor="#999"
//             value={inputs.radius || ""}
//             onChangeText={(t) => handleInputChange("radius", t)}
//             keyboardType="numeric"
//           />
//         </>
//       )}
//       {selectedShape === "line" &&
//         [1, 2].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={(t) =>
//                 handleInputChange(`lineCorner${n}`, t)
//               }
//             />
//             <TouchableOpacity
//               onPress={() => autofill(`lineCorner${n}`)}
//             >
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       {selectedShape === "rectangle" &&
//         [1, 2, 3, 4].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               placeholderTextColor="#999"
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={(t) =>
//                 handleInputChange(`rectCorner${n}`, t)
//               }
//             />
//             <TouchableOpacity
//               onPress={() => autofill(`rectCorner${n}`)}
//             >
//               <Text style={styles.fillBtn}>Use Current Position</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>

//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map((shape) => (
//           <TouchableOpacity
//             key={shape}
//             style={[
//               styles.button,
//               selectedShape === shape && styles.activeBtn,
//             ]}
//             onPress={() => {
//               setSelectedShape(shape);
//               setInputs({});
//               setEditingIndex(null);
//               setShapeName("");
//             }}
//           >
//             <Text
//               style={[
//                 styles.buttonText,
//                 selectedShape === shape && styles.activeText,
//               ]}
//             >
//               {shape.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         {/* live red dot from WS */}
//         <Circle
//           cx={150 + liveCoords.x * 0.05}
//           cy={150 - liveCoords.y * 0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       <ScrollView contentContainerStyle={styles.scroll}>
//         {renderShapeInputs()}
//       </ScrollView>

//       <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//         <Text style={styles.submitText}>
//           {editingIndex != null ? "Update Shape" : "Submit Shape"}
//         </Text>
//       </TouchableOpacity>

//       {shapes.length > 0 && (
//         <View style={styles.listContainer}>
//           {shapes.map((s, i) => (
//             <View key={i} style={styles.listItem}>
//               <Text style={styles.itemText}>
//                 {s.name} ({s.type})
//               </Text>
//               <View style={styles.actionBtns}>
//                 <TouchableOpacity onPress={() => handleEdit(i)}>
//                   <Text style={styles.editBtn}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDelete(i)}>
//                   <Text style={styles.deleteBtn}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",
//     alignItems: "center",
//   },
//   heading: {
//     color: "#FFD700",
//     fontSize: 24,
//     marginTop: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginVertical: 10,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     marginHorizontal: 5,
//     backgroundColor: "#111111",
//     borderRadius: 6,
//   },
//   activeBtn: {
//     backgroundColor: "#FFD700",
//   },
//   buttonText: {
//     color: "#FFD700",
//   },
//   activeText: {
//     color: "#000000",
//     fontWeight: "bold",
//   },
//   input: {
//     backgroundColor: "#111111",
//     color: "#FFD700",
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 6,
//     width: 250,
//   },
//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 8,
//     textDecorationLine: "underline",
//   },
//   scroll: {
//     width: "90%",
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   svgCanvas: {
//     backgroundColor: "#000000",
//     marginVertical: 20,
//     borderRadius: 6,
//   },
//   submitBtn: {
//     backgroundColor: "#FFD700",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   submitText: {
//     color: "#000000",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   listContainer: {
//     width: "90%",
//     marginTop: 10,
//   },
//   listItem: {
//     backgroundColor: "#111111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   itemText: {
//     color: "#FFD700",
//     fontSize: 16,
//   },
//   actionBtns: {
//     flexDirection: "row",
//   },
//   editBtn: {
//     color: "#FFD700",
//     marginRight: 12,
//   },
//   deleteBtn: {
//     color: "#FFD700",
//   },
//   instruction: {
//     color: "#FFD700",
//     marginBottom: 4,
//   },
// });



// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
//   Modal,
// } from "react-native";
// import Svg, { Circle, Rect, Line } from "react-native-svg";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const ws = useRef(null);

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.7.115:81");
//     ws.current.onmessage = ({ data }) => {
//       try {
//         const msg = JSON.parse(data);
//         if (typeof msg.x === "number" && typeof msg.y === "number") {
//           setLiveCoords({ x: msg.x, y: msg.y });
//         }
//       } catch {}
//     };
//     return () => ws.current && ws.current.close();
//   }, []);

//   const handleInputChange = (k, v) =>
//     setInputs((p) => ({ ...p, [k]: v }));
//   const autofill = (k) =>
//     handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);

//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "round")
//       return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
//       return (
//         inputs.rectCorner1 &&
//         inputs.rectCorner2 &&
//         inputs.rectCorner3 &&
//         inputs.rectCorner4
//       );
//     return false;
//   };

//   const parse = (s) => {
//     const [x, y] = s.split(",").map((n) => parseInt(n, 10));
//     return { x, y };
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = (i) => {
//     const s = shapes[i];
//     setSelectedShape(s.type);
//     setShapeName(s.name);
//     const ni = {};
//     if (s.type === "round") {
//       ni.center = `${s.x[0]},${s.y[0]}`;
//       ni.radius = String(s.radius);
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
//     let shape = { type: selectedShape, name: shapeName.trim() };
//     if (selectedShape === "round") {
//       const { x, y } = parse(inputs.center);
//       shape = { ...shape, x: [x], y: [y], radius: +inputs.radius };
//     } else if (selectedShape === "line") {
//       const p1 = parse(inputs.lineCorner1),
//         p2 = parse(inputs.lineCorner2);
//       shape = { ...shape, x: [p1.x, p2.x], y: [p1.y, p2.y] };
//     } else {
//       const corners = [
//         parse(inputs.rectCorner1),
//         parse(inputs.rectCorner2),
//         parse(inputs.rectCorner3),
//         parse(inputs.rectCorner4),
//       ];
//       shape = {
//         ...shape,
//         x: corners.map((p) => p.x),
//         y: corners.map((p) => p.y),
//       };
//     }
//     const updated = [...shapes];
//     if (editingIndex != null) {
//       updated[editingIndex] = shape;
//       Alert.alert("Success", "Shape updated.");
//     } else {
//       updated.push(shape);
//       Alert.alert("Success", "Shape added.");
//     }
//     setShapes(updated);
//     setModalVisible(false);
//   };

//   const handleDelete = (i) =>
//     Alert.alert(
//       "Confirm Delete",
//       `Delete "${shapes[i].name}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () =>
//             setShapes((prev) => prev.filter((_, idx) => idx !== i)),
//         },
//       ]
//     );

//   const renderSVGShapes = () => {
//     const scale = 0.05,
//       center = 150;
//     return shapes.map((s, i) => (
//       <React.Fragment key={i}>
//         {s.type === "round" && (
//           <Circle
//             onPress={() => openModalForEdit(i)}
//             cx={center + s.x[0] * scale}
//             cy={center - s.y[0] * scale}
//             r={s.radius * scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         )}
//         {s.type === "line" && (
//           <Line
//             onPress={() => openModalForEdit(i)}
//             x1={center + s.x[0] * scale}
//             y1={center - s.y[0] * scale}
//             x2={center + s.x[1] * scale}
//             y2={center - s.y[1] * scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         )}
//         {s.type === "rectangle" && (() => {
//           const x0 = Math.min(...s.x),
//             y0 = Math.min(...s.y),
//             w = Math.abs(s.x[1] - s.x[0]),
//             h = Math.abs(s.y[2] - s.y[1]);
//           return (
//             <Rect
//               onPress={() => openModalForEdit(i)}
//               x={center + x0 * scale}
//               y={center - (y0 + h) * scale}
//               width={w * scale}
//               height={h * scale}
//               stroke="purple"
//               strokeWidth={2}
//               fill="rgba(128,0,128,0.2)"
//             />
//           );
//         })()}
//       </React.Fragment>
//     ));
//   };

//   const renderInputs = () => (
//     <>
//       {/* Shape Type Picker */}
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map((t) => (
//           <TouchableOpacity
//             key={t}
//             style={[
//               styles.button,
//               selectedShape === t && styles.activeBtn,
//             ]}
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

//       {/* Name & Coords */}
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
//             onChangeText={(t) => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius || ""}
//             onChangeText={(t) => handleInputChange("radius", t)}
//           />
//         </>
//       )}
//       {selectedShape === "line" &&
//         [1, 2].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`lineCorner${n}`] || ""}
//               onChangeText={(t) =>
//                 handleInputChange(`lineCorner${n}`, t)
//               }
//             />
//             <TouchableOpacity
//               onPress={() => autofill(`lineCorner${n}`)}
//             >
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       {selectedShape === "rectangle" &&
//         [1, 2, 3, 4].map((n) => (
//           <View key={n}>
//             <TextInput
//               placeholder={`Corner ${n} (x,y)`}
//               style={styles.input}
//               value={inputs[`rectCorner${n}`] || ""}
//               onChangeText={(t) =>
//                 handleInputChange(`rectCorner${n}`, t)
//               }
//             />
//             <TouchableOpacity
//               onPress={() => autofill(`rectCorner${n}`)}
//             >
//               <Text style={styles.fillBtn}>Use Current Pos</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>

//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         <Circle
//           cx={150 + liveCoords.x * 0.05}
//           cy={150 - liveCoords.y * 0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       {/* + Add Shape */}
//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       {/* List of shapes with Delete */}
//       <ScrollView style={styles.listContainer}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <TouchableOpacity onPress={() => handleDelete(i)}>
//               <Text style={styles.deleteBtn}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Modal */}
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
//               <TouchableOpacity
//                 style={styles.submitBtn}
//                 onPress={handleSubmit}
//               >
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
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
//   heading: { color: "#FFD700", fontSize: 24, margin: 20 },
//   svgCanvas: { backgroundColor: "#000", borderRadius: 6 },
//   addBtn: {
//     backgroundColor: "#FFD700",
//     padding: 12,
//     borderRadius: 6,
//     marginVertical: 10,
//   },
//   addBtnText: { color: "#000", fontWeight: "bold" },
//   listContainer: { width: "90%" },
//   listItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },
//   itemText: { color: "#FFD700" },
//   deleteBtn: { color: "#f55" },

//   // Modal styles
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
//   button: {
//     padding: 8,
//     margin: 4,
//     backgroundColor: "#222",
//     borderRadius: 6,
//   },
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
//   fillBtn: {
//     color: "#FFD700",
//     marginBottom: 12,
//     textDecorationLine: "underline",
//   },
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




// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
//   Modal,
// } from "react-native";
// import Svg, { Circle, Rect, Line } from "react-native-svg";

// const ShapeSelector = () => {
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);           // ← comes from WS
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const ws = useRef(null);

//   // ── Open WS & listen for shapes array ──
//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.7.115:81");

//     ws.current.onopen = () => {
//       console.log("WebSocket Connected");

//       // Monkey-patch send to log every outgoing payload
//       const originalSend = ws.current.send.bind(ws.current);
//       ws.current.send = (data) => {
//         console.log("→ WS SEND:", data);
//         originalSend(data);
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
//           setShapes(msg.shapes);    // ← redraw all shapes from server
//         }
//       } catch {
//         console.warn("Malformed WS message", data);
//       }
//     };

//     ws.current.onerror = (e) => console.error("WS Error:", e.message);
//     ws.current.onclose = () => console.log("WebSocket Closed");

//     return () => ws.current && ws.current.close();
//   }, []);

//   const handleInputChange = (k, v) =>
//     setInputs((p) => ({ ...p, [k]: v }));
//   const autofill = (k) =>
//     handleInputChange(k, `${liveCoords.x},${liveCoords.y}`);

//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "round")
//       return inputs.center && inputs.radius;
//     if (selectedShape === "line")
//       return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
//       return inputs.rectCorner1 &&
//              inputs.rectCorner2 &&
//              inputs.rectCorner3 &&
//              inputs.rectCorner4;
//     return false;
//   };

//   const parse = (s) => {
//     const [x, y] = s.split(",").map((n) => parseInt(n, 10));
//     return { x, y };
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("round");
//     setModalVisible(true);
//   };
//   const openModalForEdit = (i) => {
//     const s = shapes[i];
//     setSelectedShape(s.type);
//     setShapeName(s.name);
//     const ni = {};
//     if (s.type === "round") {
//       ni.center = `${s.x[0]},${s.y[0]}`;
//       ni.radius = String(s.radius);
//     } else if (s.type === "line") {
//       ni.lineCorner1 = `${s.x[0]},${s.y[0]}`;
//       ni.lineCorner2 = `${s.x[1]},${s.y[1]}`;
//     } else {
//       s.x.forEach((_, idx) => {
//         ni[`rectCorner${idx+1}`] = `${s.x[idx]},${s.y[idx]}`;
//       });
//     }
//     setInputs(ni);
//     setEditingIndex(i);
//     setModalVisible(true);
//   };

//   // ── Send create/update over WS ──
//   const handleSubmit = () => {
//     if (!validate()) {
//       Alert.alert("Error", "Fill name & all fields.");
//       return;
//     }
//     let shape = { type: selectedShape, name: shapeName.trim() };
//     if (selectedShape === "round") {
//       const { x, y } = parse(inputs.center);
//       shape = { ...shape, x: [x], y: [y], radius: +inputs.radius };
//     } else if (selectedShape === "line") {
//       const p1 = parse(inputs.lineCorner1),
//             p2 = parse(inputs.lineCorner2);
//       shape = { ...shape, x: [p1.x,p2.x], y: [p1.y,p2.y] };
//     } else {
//       const corners = [
//         parse(inputs.rectCorner1),
//         parse(inputs.rectCorner2),
//         parse(inputs.rectCorner3),
//         parse(inputs.rectCorner4),
//       ];
//       shape = {
//         ...shape,
//         x: corners.map((p) => p.x),
//         y: corners.map((p) => p.y),
//       };
//     }

//     const action = editingIndex != null ? "update" : "add";
//     const payload = {
//       action,
//       index: editingIndex,
//       shape
//     };
//     ws.current.send(JSON.stringify(payload));
//     setModalVisible(false);
//   };

//   const handleDelete = (i) =>
//     Alert.alert(
//       "Confirm Delete",
//       `Delete "${shapes[i].name}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             const del = { action: "delete", index: i };
//             ws.current.send(JSON.stringify(del));
//           },
//         },
//       ]
//     );

//   // ── Draw whatever came from WS ──
//   const renderSVGShapes = () => {
//     const scale = 0.05, center = 150;
//     return shapes.map((s, i) => (
//       <React.Fragment key={i}>
//         {s.type === "round" && (
//           <Circle
//             onPress={() => openModalForEdit(i)}
//             cx={center + s.x[0]*scale}
//             cy={center - s.y[0]*scale}
//             r={s.radius*scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         )}
//         {s.type === "line" && (
//           <Line
//             onPress={() => openModalForEdit(i)}
//             x1={center + s.x[0]*scale}
//             y1={center - s.y[0]*scale}
//             x2={center + s.x[1]*scale}
//             y2={center - s.y[1]*scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         )}
//         {s.type === "rectangle" && (() => {
//           const x0 = Math.min(...s.x),
//                 y0 = Math.min(...s.y),
//                 w  = Math.abs(s.x[1]-s.x[0]),
//                 h  = Math.abs(s.y[2]-s.y[1]);
//           return (
//             <Rect
//               onPress={() => openModalForEdit(i)}
//               x={center + x0*scale}
//               y={center - (y0+h)*scale}
//               width={w*scale}
//               height={h*scale}
//               stroke="purple"
//               strokeWidth={2}
//               fill="rgba(128,0,128,0.2)"
//             />
//           );
//         })()}
//       </React.Fragment>
//     ));
//   };

//   // ── Modal inputs ──
//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round","line","rectangle"].map((t) => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape===t&&styles.activeBtn]}
//             onPress={()=>setSelectedShape(t)}
//           >
//             <Text style={[styles.buttonText, selectedShape===t&&styles.activeText]}>
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
//       {selectedShape==="round" && (
//         <>
//           <TextInput
//             placeholder="Center (x,y)"
//             style={styles.input}
//             value={inputs.center||""}
//             onChangeText={(t)=>handleInputChange("center",t)}
//           />
//           <TouchableOpacity onPress={()=>autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius||""}
//             onChangeText={(t)=>handleInputChange("radius",t)}
//           />
//         </>
//       )}
//       {selectedShape==="line" && [1,2].map(n=>(
//         <View key={n}>
//           <TextInput
//             placeholder={`Corner ${n} (x,y)`}
//             style={styles.input}
//             value={inputs[`lineCorner${n}`]||""}
//             onChangeText={(t)=>handleInputChange(`lineCorner${n}`,t)}
//           />
//           <TouchableOpacity onPress={()=>autofill(`lineCorner${n}`)}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//       {selectedShape==="rectangle" && [1,2,3,4].map(n=>(
//         <View key={n}>
//           <TextInput
//             placeholder={`Corner ${n} (x,y)`}
//             style={styles.input}
//             value={inputs[`rectCorner${n}`]||""}
//             onChangeText={(t)=>handleInputChange(`rectCorner${n}`,t)}
//           />
//           <TouchableOpacity onPress={()=>autofill(`rectCorner${n}`)}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.heading}>Shape Selector</Text>
//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         <Circle
//           cx={150 + liveCoords.x*0.05}
//           cy={150 - liveCoords.y*0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.listContainer}>
//         {shapes.map((s,i)=>(
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>{s.name} ({s.type})</Text>
//             <View style={styles.actionBtns}>
//               <TouchableOpacity onPress={()=>openModalForEdit(i)}>
//                 <Text style={styles.updateBtn}>Update</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={()=>handleDelete(i)}>
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
//         onRequestClose={()=>setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>{renderInputs()}</ScrollView>
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//                 <Text style={styles.submitText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn,styles.cancelBtn]}
//                 onPress={()=>setModalVisible(false)}
//               >
//                 <Text style={styles.submitText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: { flex:1, backgroundColor:"#000", alignItems:"center" },
//   heading:   { color:"#FFD700", fontSize:24, margin:20 },
//   svgCanvas: { backgroundColor:"#000", borderRadius:6 },
//   addBtn:    { backgroundColor:"#FFD700", padding:12, borderRadius:6, marginVertical:10 },
//   addBtnText:{ color:"#000", fontWeight:"bold" },
//   listContainer:{ width:"90%" },
//   listItem:  { flexDirection:"row", justifyContent:"space-between", backgroundColor:"#111", padding:12, marginVertical:4, borderRadius:6 },
//   itemText:  { color:"#FFD700" },
//   actionBtns:{ flexDirection:"row" },
//   updateBtn: { color:"#0af", marginRight:12 },
//   deleteBtn: { color:"#f55" },

//   // Modal
//   modalOverlay:{ flex:1, backgroundColor:"rgba(0,0,0,0.6)", justifyContent:"center", alignItems:"center" },
//   modalContent:{ width:"85%", maxHeight:"80%", backgroundColor:"#111", padding:20, borderRadius:8 },
//   buttonContainer:{ flexDirection:"row", justifyContent:"center" },
//   button:    { padding:8, margin:4, backgroundColor:"#222", borderRadius:6 },
//   activeBtn: { backgroundColor:"#FFD700" },
//   buttonText:{ color:"#FFD700" },
//   activeText:{ color:"#000", fontWeight:"bold" },
//   input:     { backgroundColor:"#222", color:"#FFD700", padding:10, marginVertical:6, borderRadius:6 },
//   fillBtn:   { color:"#FFD700", marginBottom:12, textDecorationLine:"underline" },
//   modalActions:{ flexDirection:"row", justifyContent:"space-around", marginTop:12 },
//   submitBtn: { backgroundColor:"#FFD700", paddingVertical:8, paddingHorizontal:20, borderRadius:6 },
//   cancelBtn: { backgroundColor:"#555" },
//   submitText:{ color:"#000", fontWeight:"bold" },
// });





// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
//   Modal,
// } from "react-native";
// import Svg, { Circle, Line, Rect } from "react-native-svg";

// const ShapeSelector = () => {
//   const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
//   const [shapes, setShapes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("round");
//   const [shapeName, setShapeName] = useState("");
//   const [inputs, setInputs] = useState({});
//   const [editingIndex, setEditingIndex] = useState(null);
//   const ws = useRef(null);

//   useEffect(() => {
//     ws.current = new WebSocket("ws://192.168.7.115:81");

//     ws.current.onopen = () => {
//       console.log("WebSocket Connected");
//       const origSend = ws.current.send.bind(ws.current);
//       ws.current.send = (data) => {
//         console.log("→ WS SEND:", data);
//         origSend(data);
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
//           setShapes(msg.shapes);
//         }
//       } catch {
//         console.warn("Malformed WS message", data);
//       }
//     };

//     ws.current.onerror = (e) => console.error("WS Error:", e.message);
//     ws.current.onclose = () => console.log("WebSocket Closed");

//     return () => ws.current && ws.current.close();
//   }, []);

//   // Helpers to parse equations
//   const parseCircleEquation = (eq) => {
//     const m = eq.match(/\(x\s*-\s*([-\d.]+)\)\^2\s*\+\s*\(y\s*-\s*([-\d.]+)\)\^2\s*=\s*([-\d.]+)/);
//     if (!m) return null;
//     const h = parseFloat(m[1]), k = parseFloat(m[2]), r = Math.sqrt(parseFloat(m[3]));
//     return { h, k, r };
//   };
//   const parseLineEquation = (eq) => {
//     const m = eq.match(/y\s*=\s*([-\d.]+)x\s*([+-]\s*[\d.]+)/i);
//     if (!m) return null;
//     return {
//       m: parseFloat(m[1]),
//       b: parseFloat(m[2].replace(/\s+/g, "")),
//     };
//   };

//   const handleInputChange = (key, val) =>
//     setInputs((prev) => ({ ...prev, [key]: val }));
//   const autofill = (key) =>
//     handleInputChange(key, `${liveCoords.x},${liveCoords.y}`);

//   const validate = () => {
//     if (!shapeName.trim()) return false;
//     if (selectedShape === "round") return inputs.center && inputs.radius;
//     if (selectedShape === "line") return inputs.lineCorner1 && inputs.lineCorner2;
//     if (selectedShape === "rectangle")
//       return inputs.rectCorner1 &&
//              inputs.rectCorner2 &&
//              inputs.rectCorner3 &&
//              inputs.rectCorner4;
//     return true;
//   };

//   const parsePair = (s) => {
//     const [x, y] = s.split(",").map((n) => parseInt(n, 10));
//     return { x, y };
//   };

//   const openModalForNew = () => {
//     setEditingIndex(null);
//     setShapeName("");
//     setInputs({});
//     setSelectedShape("round");
//     setModalVisible(true);
//   };

//   const openModalForEdit = (i) => {
//     const s = shapes[i];
//     setSelectedShape(s.type === "point" ? "round" : s.type);
//     setShapeName(s.name);
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
//     } else if (s.type === "rectangle") {
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
//     } else if (selectedShape === "rectangle") {
//       const corners = [1, 2, 3, 4].map((n) => parsePair(inputs[`rectCorner${n}`]));
//       shape.equation = `Rectangle with corners ${corners.map(p => `(${p.x},${p.y})`).join(", ")}`;
//       shape.x = corners.map((p) => p.x);
//       shape.y = corners.map((p) => p.y);
//     }

//     const payload = {
//       action: editingIndex != null ? "update" : "add",
//       index: editingIndex,
//       shape,
//     };

//     ws.current.send(JSON.stringify(payload));
//     setModalVisible(false);
//   };

//   const handleDelete = (i) =>
//     Alert.alert("Confirm Delete", `Delete "${shapes[i].name}"?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => {
//           ws.current.send(JSON.stringify({ action: "delete", index: i }));
//         },
//       },
//     ]);

//   const renderSVGShapes = () => {
//     const scale = 0.05,
//       center = 150;

//     return shapes.map((s, i) => {
//       if (s.type === "point") {
//         const c = parseCircleEquation(s.equation);
//         if (!c) return null;
//         return (
//           <Circle
//             key={i}
//             onPress={() => openModalForEdit(i)}
//             cx={center + c.h * scale}
//             cy={center - c.k * scale}
//             r={c.r * scale}
//             fill="rgba(0,255,0,0.3)"
//           />
//         );
//       }

//       if (s.type === "line") {
//         const l = parseLineEquation(s.equation);
//         if (!l) return null;
//         const xMin = -center / scale;
//         const xMax = (300 - center) / scale;
//         const y1 = l.m * xMin + l.b;
//         const y2 = l.m * xMax + l.b;
//         return (
//           <Line
//             key={i}
//             onPress={() => openModalForEdit(i)}
//             x1={center + xMin * scale}
//             y1={center - y1 * scale}
//             x2={center + xMax * scale}
//             y2={center - y2 * scale}
//             stroke="cyan"
//             strokeWidth={2}
//           />
//         );
//       }

//       if (s.type === "rectangle") {
//         const x0 = Math.min(...s.x),
//           y0 = Math.min(...s.y),
//           w = Math.abs(s.x[1] - s.x[0]),
//           h = Math.abs(s.y[2] - s.y[1]);
//         return (
//           <Rect
//             key={i}
//             onPress={() => openModalForEdit(i)}
//             x={center + x0 * scale}
//             y={center - (y0 + h) * scale}
//             width={w * scale}
//             height={h * scale}
//             stroke="purple"
//             strokeWidth={2}
//             fill="rgba(128,0,128,0.2)"
//           />
//         );
//       }

//       return null;
//     });
//   };

//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map((t) => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.button, selectedShape === t && styles.activeBtn]}
//             onPress={() => setSelectedShape(t)}
//           >
//             <Text style={[styles.buttonText, selectedShape === t && styles.activeText]}>
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
//             onChangeText={(t) => handleInputChange("center", t)}
//           />
//           <TouchableOpacity onPress={() => autofill("center")}>
//             <Text style={styles.fillBtn}>Use Current Pos</Text>
//           </TouchableOpacity>
//           <TextInput
//             placeholder="Radius"
//             style={styles.input}
//             keyboardType="numeric"
//             value={inputs.radius || ""}
//             onChangeText={(t) => handleInputChange("radius", t)}
//           />
//         </>
//       )}

//       {selectedShape === "line" &&
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

//       {selectedShape === "rectangle" &&
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
//       <Text style={styles.heading}>Shape Selector</Text>
//       <Svg height={300} width={300} style={styles.svgCanvas}>
//         {renderSVGShapes()}
//         <Circle
//           cx={150 + liveCoords.x * 0.05}
//           cy={150 - liveCoords.y * 0.05}
//           r={4}
//           fill="red"
//         />
//       </Svg>

//       <TouchableOpacity style={styles.addBtn} onPress={openModalForNew}>
//         <Text style={styles.addBtnText}>+ Add Shape</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.listContainer}>
//         {shapes.map((s, i) => (
//           <View key={i} style={styles.listItem}>
//             <Text style={styles.itemText}>
//               {s.name} ({s.type})
//             </Text>
//             <View style={styles.actionBtns}>
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
// };

// export default ShapeSelector;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
//   heading: { color: "#FFD700", fontSize: 24, margin: 20 },
//   svgCanvas: { backgroundColor: "#000", borderRadius: 6 },
//   addBtn: { backgroundColor: "#FFD700", padding: 12, borderRadius: 6, marginVertical: 10 },
//   addBtnText: { color: "#000", fontWeight: "bold" },
//   listContainer: { width: "90%" },
//   listItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#111",
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 6,
//   },
//   itemText: { color: "#FFD700" },
//   actionBtns: { flexDirection: "row" },
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
//   input: { backgroundColor: "#222", color: "#FFD700", padding: 10, marginVertical: 6, borderRadius: 6 },
//   fillBtn: { color: "#FFD700", marginBottom: 12, textDecorationLine: "underline" },
//   modalActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
//   submitBtn: { backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
//   cancelBtn: { backgroundColor: "#555" },
//   submitText: { color: "#000", fontWeight: "bold" },
// });


// ShapeSelector.js
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Alert,
//   Modal,
// } from "react-native";
// import Svg, { Rect, Line, Circle, Path } from "react-native-svg";

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
//           setShapes(msg.shapes);
//         }
//       } catch {
//         console.warn("Malformed WS message", data);
//       }
//     };
//     ws.current.onerror = (e) => console.error("WS Error:", e.message);
//     ws.current.onclose = () => console.log("WebSocket Closed");
//     return () => ws.current && ws.current.close();
//   }, []);

//   // helper math
//   const scale = canvasWidth / (2 * REAL_WORLD_RADIUS);
//   const originX = canvasWidth / 2;
//   const originY = 0;
//   const toPxX = (x) => originX + x * scale;
//   const toPxY = (y) => originY + (-y) * scale; // y is negative downwards

//   // parse helpers (unchanged)
//   const parseCircleEquation = eq => {
//     const clean = eq.replace(/\s+/g, '');
//     const m = clean.match(/\(x-([-\d.]+)\)\^2\+\(y-([-\d.]+)\)\^2=([-\d.]+)/);
//     if (!m) return null;
//     return { h: +m[1], k: +m[2], r: Math.sqrt(+m[3]) };
//   };
  
//   /** strip spaces and match y=mx±b */
//   const parseLineEquation = eq => {
//     const clean = eq.replace(/\s+/g, '');
//     const m = clean.match(/y=([-\d.]+)x([+-][\d.]+)/i);
//     if (!m) return null;
//     return { m: +m[1], b: +m[2] };
//   };
//   const parsePair = (s) => {
//     const [x, y] = s.split(",").map(Number);
//     return { x, y };
//   };

//   // inputs, autofill, validate, modal handlers all unchanged...
//   const handleInputChange = (k, v) =>
//     setInputs((prev) => ({ ...prev, [k]: v }));
//   const autofill = (k) =>
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
//   const openModalForEdit = (i) => {
//     // ...your existing edit logic
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
//     // ...your existing submit logic
//     if (!validate()) {
//       Alert.alert("Error", "Fill name & all fields.");
//       return;
//     }
//     let shape = { type: selectedShape === "round" ? "point" : selectedShape, name: shapeName.trim() };
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
//       const corners = [1, 2, 3, 4].map((n) => parsePair(inputs[`rectCorner${n}`]));
//       shape.equation = `Rectangle with corners ${corners
//         .map((p) => `(${p.x},${p.y})`)
//         .join(", ")}`;
//       shape.x = corners.map((p) => p.x);
//       shape.y = corners.map((p) => p.y);
//     }
//     ws.current.send(
//       JSON.stringify({
//         action: editingIndex != null ? "update" : "add",
//         index: editingIndex,
//         shape,
//       })
//     );
//     setModalVisible(false);
//   };
//   const handleDelete = (i) =>
//     Alert.alert(
//       "Confirm Delete",
//       `Delete "${shapes[i].name}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () =>
//             ws.current.send(JSON.stringify({ action: "delete", index: i })),
//         },
//       ]
//     );

//   // render the per-shape input fields (unchanged)…
//   const renderInputs = () => (
//     <>
//       <View style={styles.buttonContainer}>
//         {["round", "line", "rectangle"].map((t) => (
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
//       {selectedShape === "line" &&
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
//       {selectedShape === "rectangle" &&
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
//                 M  ${toPxX(-REAL_WORLD_RADIUS)} ${toPxY(0)}
//                 A  ${REAL_WORLD_RADIUS * scale} ${REAL_WORLD_RADIUS * scale} 0 0 1
//                    ${toPxX(REAL_WORLD_RADIUS)} ${toPxY(0)}
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
//                     fill="rgba(255, 68, 0, 0.6)"
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
//     aspectRatio: 2,       // <–– 2:1 rectangle
//     borderRadius: 6,
//     overflow: "hidden",
//   },
//   addBtn: { backgroundColor: "#FFD700", padding: 12, borderRadius: 6, marginTop: 8 },
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
//   submitBtn: { backgroundColor: "#FFD700", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
//   cancelBtn: { backgroundColor: "#555" },
//   submitText: { color: "#000", fontWeight: "bold" },
// });





import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import Svg, { Rect, Line, Circle, Path } from "react-native-svg";

const REAL_WORLD_RADIUS = 6000; // sensor radius in mm

export default function ShapeSelector() {
  const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShape, setSelectedShape] = useState("round");
  const [shapeName, setShapeName] = useState("");
  const [inputs, setInputs] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const ws = useRef(null);

  // dimensions of our 2:1 SVG container in pixels
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.7.115:81");
    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      const orig = ws.current.send.bind(ws.current);
      ws.current.send = (data) => {
        console.log("→ WS SEND:", data);
        orig(data);
      };
    };
    ws.current.onmessage = ({ data }) => {
      console.log("← WS RECV:", data);
      try {
        const msg = JSON.parse(data);
        // update live position
        if (typeof msg.x === "number" && typeof msg.y === "number") {
          setLiveCoords({ x: msg.x, y: msg.y });
        }
        // merge incoming shapes with local state
        if (Array.isArray(msg.shapes)) {
          setShapes(prev => {
            const merged = [...prev];
            msg.shapes.forEach(s => {
              // try to find existing by name & equation
              const idx = merged.findIndex(
                ps => ps.name === s.name && ps.equation === s.equation
              );
              if (idx >= 0) {
                merged[idx] = s;     // update existing
              } else {
                merged.push(s);      // append new
              }
            });
            return merged;
          });
        }
      } catch {
        console.warn("Malformed WS message", data);
      }
    };
    ws.current.onerror = (e) => console.error("WS Error:", e.message);
    ws.current.onclose = () => console.log("WebSocket Closed");
    return () => ws.current && ws.current.close();
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
    if (selectedShape === "round") return inputs.center && inputs.radius;
    if (selectedShape === "line")
      return inputs.lineCorner1 && inputs.lineCorner2;
    if (selectedShape === "rectangle")
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
    setSelectedShape("round");
    setModalVisible(true);
  };

  const openModalForEdit = i => {
    const s = shapes[i];
    setShapeName(s.name);
    setSelectedShape(s.type === "point" ? "round" : s.type);
    const ni = {};
    if (s.type === "point") {
      const c = parseCircleEquation(s.equation);
      if (c) {
        ni.center = `${c.h},${c.k}`;
        ni.radius = String(c.r);
      }
    } else if (s.type === "line") {
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
      type: selectedShape === "round" ? "point" : selectedShape,
      name: shapeName.trim(),
    };
    if (selectedShape === "round") {
      const { x, y } = parsePair(inputs.center);
      const r = +inputs.radius;
      shape.equation = `(x - ${x})^2 + (y - ${y})^2 = ${r * r}`;
      shape.x = [x];
      shape.y = [y];
    } else if (selectedShape === "line") {
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

  const renderInputs = () => (
    <>
      <View style={styles.buttonContainer}>
        {["round", "line", "rectangle"].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.button, selectedShape === t && styles.activeBtn]}
            onPress={() => setSelectedShape(t)}
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
      {selectedShape === "round" && (
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
      {selectedShape === "line" &&
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
      {selectedShape === "rectangle" &&
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
      <Text style={styles.heading}>Shape Selector</Text>
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
              if (s.type === "line") {
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
              if (s.type === "rectangle") {
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
        <Text style={styles.addBtnText}>+ Add Shape</Text>
      </TouchableOpacity>

      <ScrollView style={styles.list}>
        {shapes.map((s, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.itemText}>
              {s.name} ({s.type})
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModalForEdit(i)}>
                <Text style={styles.updateBtn}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(i)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  addBtn: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  addBtnText: { color: "#000", fontWeight: "bold" },
  list: { width: "90%", marginTop: 12 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#111",
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
  },
  itemText: { color: "#FFD700" },
  actions: { flexDirection: "row" },
  updateBtn: { color: "#0af", marginRight: 12 },
  deleteBtn: { color: "#f55" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 8,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "center" },
  button: { padding: 8, margin: 4, backgroundColor: "#222", borderRadius: 6 },
  activeBtn: { backgroundColor: "#FFD700" },
  buttonText: { color: "#FFD700" },
  activeText: { color: "#000", fontWeight: "bold" },
  input: {
    backgroundColor: "#222",
    color: "#FFD700",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  fillBtn: { color: "#FFD700", marginBottom: 12, textDecorationLine: "underline" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  submitBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelBtn: { backgroundColor: "#555" },
  submitText: { color: "#000", fontWeight: "bold" },
});
