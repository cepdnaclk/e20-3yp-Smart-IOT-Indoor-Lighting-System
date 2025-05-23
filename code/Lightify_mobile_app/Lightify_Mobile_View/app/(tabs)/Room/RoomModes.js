
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export default function RoomModesScreen() {
//   const { roomId } = useLocalSearchParams();
//   const router = useRouter();
//   const [modes, setModes] = useState([
//     { name: 'Normal Mode', active: true },
//     { name: 'Night Mode', active: false },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [newModeName, setNewModeName] = useState('');

//   const toggleMode = (index) => {
//   setModes((prevModes) => {
//     const isCurrentlyActive = prevModes[index].active;
//     const anyOtherActive = prevModes.some((mode, i) => i !== index && mode.active);

//     if (!isCurrentlyActive && anyOtherActive) {
//       Alert.alert("Error", "Only one mode can be active at a time.");
//       return prevModes; // No change
//     }

//     return prevModes.map((mode, i) =>
//       i === index ? { ...mode, active: !mode.active } : mode
//     );
//   });
// };


//   const handleAddMode = () => {
//     if (!newModeName.trim()) {
//       Alert.alert('Error', 'Please enter a mode name');
//       return;
//     }
//     setModes([...modes, { name: newModeName.trim(), active: false }]);
//     setNewModeName('');
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.roomTitle}>{roomId || 'Room'}</Text>
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.modeList}>
//         {modes.map((mode, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.modeCard}
//             onPress={() =>
//               router.push({
//                 pathname: 'Room/RadarDataReceiver',
//                 params: {
//                   roomId: roomId || 'Default_Room',
//                   mode: mode.name,
//                 },
//               })
//   }

//           >
//             <Text style={styles.modeText}>{mode.name}</Text>
//             <Switch
//               value={mode.active}
//               onValueChange={() => toggleMode(index)}
//               trackColor={{ false: '#444', true: '#FFD70055' }}
//               thumbColor={mode.active ? '#FFD700' : '#888'}
//             />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add New Mode</Text>
//             <TextInput
//               placeholder="Enter mode name"
//               style={styles.input}
//               value={newModeName}
//               onChangeText={setNewModeName}
//               placeholderTextColor="#AAA"
//             />
//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.modalBtn} onPress={handleAddMode}>
//                 <Text style={styles.modalBtnText}>Add</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: '#777' }]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.modalBtnText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   roomTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFD700',
//   },
//   modeList: {
//     paddingBottom: 20,
//   },
//   modeCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderColor: '#FFD700',
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#111',
//   },
//   modeText: {
//     fontSize: 18,
//     color: '#FFD700',
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#111',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontWeight: 'bold',
//     color: '#FFD700',
//   },
//   input: {
//     width: '100%',
//     borderColor: '#FFD700',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 15,
//     color: '#FFF',
//     backgroundColor: '#222',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalBtn: {
//     flex: 1,
//     backgroundColor: '#FFD700',
//     padding: 10,
//     borderRadius: 6,
//     marginHorizontal: 5,
//     alignItems: 'center',
//   },
//   modalBtnText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
// });




import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosClient from '../../../utils/axiosClient';

export default function RoomModesScreen() {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();
  const [modes, setModes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModeName, setNewModeName] = useState('');

  // 🔄 Fetch modes from backend
  // useEffect(() => {
  //   const fetchModes = async () => {
  //     try {
  //       const res = await axiosClient.get(`/api/modes?roomId=${roomId}`);
  //       if (Array.isArray(res.data.modes)) {
  //         setModes(res.data.modes);
  //       }
  //     } catch (err) {
  //       console.error('❌ Failed to fetch modes:', err);
  //     }
  //   };

  //   if (roomId) {
  //     fetchModes();
  //   }
  // }, [roomId]);


  useEffect(() => {
  const fetchModes = async () => {
    try {
      const res = await axiosClient.get(`/api/modes?roomId=${roomId}`);
      if (Array.isArray(res.data.modes)) {
        setModes(res.data.modes);
      } else {
        throw new Error("Invalid data");
      }
    } catch (err) {
      console.warn('⚠️ Backend not ready, using fallback modes');
      // Hardcoded fallback modes
      setModes([
        { _id: 'm1', name: 'Normal Mode', active: true },
        { _id: 'm2', name: 'Night Mode', active: false },
        { _id: 'm3', name: 'Energy Saver', active: false },
      ]);
    }
  };

  if (roomId) {
    fetchModes();
  }
}, [roomId]);


  // 🔁 Update active state for modes (only one active at a time)
  const toggleMode = async (index) => {
    const isCurrentlyActive = modes[index].active;
    const anyOtherActive = modes.some((mode, i) => i !== index && mode.active);

    if (!isCurrentlyActive && anyOtherActive) {
      Alert.alert("Error", "Only one mode can be active at a time.");
      return;
    }

    const updatedModes = modes.map((mode, i) =>
      i === index ? { ...mode, active: !mode.active } : mode
    );

    setModes(updatedModes);

    try {
      await axiosClient.patch(`/api/modes/${modes[index]._id}`, {
        active: !isCurrentlyActive,
      });
    } catch (err) {
      console.error("Failed to update mode:", err);
    }
  };

  // ➕ Add new mode to backend
  const handleAddMode = async () => {
    if (!newModeName.trim()) {
      Alert.alert('Error', 'Please enter a mode name');
      return;
    }

    const newMode = {
      roomId,
      name: newModeName.trim(),
      active: false,
    };

    try {
      const res = await axiosClient.post('/api/modes', newMode);
      if (res.status === 201 || res.data) {
        setModes(prev => [...prev, res.data || newMode]);
        setNewModeName('');
        setModalVisible(false);
      }
    } catch (err) {
      console.error("❌ Error adding mode:", err);
      Alert.alert("Error", "Failed to add mode");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomId || 'Room'}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.modeList}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={styles.modeCard}
            onPress={() =>
              router.push({
                pathname: 'Room/RadarDataReceiver',
                params: {
                  roomId: roomId || 'Default_Room',
                  mode: mode.name,
                },
              })
            }
          >
            <Text style={styles.modeText}>{mode.name}</Text>
            <Switch
              value={mode.active}
              onValueChange={() => toggleMode(index)}
              trackColor={{ false: '#444', true: '#FFD70055' }}
              thumbColor={mode.active ? '#FFD700' : '#888'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Mode</Text>
            <TextInput
              placeholder="Enter mode name"
              style={styles.input}
              value={newModeName}
              onChangeText={setNewModeName}
              placeholderTextColor="#AAA"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddMode}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#777' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  modeList: {
    paddingBottom: 20,
  },
  modeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#FFD700',
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#111',
  },
  modeText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  input: {
    width: '100%',
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#FFF',
    backgroundColor: '#222',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
