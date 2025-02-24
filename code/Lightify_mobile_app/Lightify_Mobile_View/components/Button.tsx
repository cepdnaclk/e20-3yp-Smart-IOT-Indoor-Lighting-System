// import React from 'react';
// import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

// interface ButtonProps {
//   title: string;
//   onPress: () => void;
//   loading?: boolean;
// }

// const ReusableButton: React.FC<ButtonProps> = ({ title, onPress, loading = false }) => {
//   return (
//     <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
//       {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{title}</Text>}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ReusableButton;


import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const ReusableButton = ({ title, onPress, loading = false }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReusableButton;
