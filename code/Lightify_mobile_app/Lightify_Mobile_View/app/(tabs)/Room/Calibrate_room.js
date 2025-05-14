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




import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";

const ShapeSelector = () => {
  const [selectedShape, setSelectedShape] = useState("round");
  const [inputs, setInputs] = useState({});

  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
  };

  const renderShape = () => {
    switch (selectedShape) {
      case "round":
        return <View style={styles.circle} />;
      case "rectangle":
        return <View style={styles.rectangle} />;
      case "line":
        return <View style={styles.line} />;
      default:
        return null;
    }
  };

  const renderInstructions = () => {
    switch (selectedShape) {
      case "round":
        return (
          <>
            <Text style={styles.instruction}>
              Please sit on the center of the circle.
            </Text>
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
        );
      case "line":
        return (
          <>
            <Text style={styles.instruction}>
              Please sit each two corners of the line and submit the coordinates.
            </Text>
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
        );
      case "rectangle":
        return (
          <>
            <Text style={styles.instruction}>
              Please sit 4 corners and obtain the coordinate and submit it.
            </Text>
            <TextInput
              placeholder="Corner 1 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("rectCorner1", text)}
              value={inputs.rectCorner1}
            />
            <TextInput
              placeholder="Corner 2 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("rectCorner2", text)}
              value={inputs.rectCorner2}
            />
            <TextInput
              placeholder="Corner 3 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("rectCorner3", text)}
              value={inputs.rectCorner3}
            />
            <TextInput
              placeholder="Corner 4 (x,y)"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("rectCorner4", text)}
              value={inputs.rectCorner4}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Shape</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedShape("round")}
        >
          <Text style={styles.buttonText}>Round</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedShape("line")}
        >
          <Text style={styles.buttonText}>Line</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedShape("rectangle")}
        >
          <Text style={styles.buttonText}>Rectangle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shapeContainer}>{renderShape()}</View>

      <View style={{ padding: 10, width: "90%" }}>{renderInstructions()}</View>
    </SafeAreaView>
  );
};

export default ShapeSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  shapeContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
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
  instruction: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#555",
    borderWidth: 1,
  },
});


