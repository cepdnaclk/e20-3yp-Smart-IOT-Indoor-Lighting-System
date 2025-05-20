// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import axiosClient from "../../../utils/axiosClient";

// // Hardcoded fallback room data
// const fallbackRooms = [
//   {
//     room: "Living Room",
//     devices: [{ deviceId: "dev001" }],
//   },
//   {
//     room: "Kitchen",
//     devices: [{ deviceId: "dev002" }, { deviceId: "dev003" }],
//   },
// ];

// export default function RoomListScreen() {
//   const router = useRouter();
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRooms = async () => {
//     try {
//       const response = await axiosClient.get("/api/rooms");
//       if (response.status === 200 && Array.isArray(response.data.rooms)) {
//         setRooms(response.data.rooms);
//       } else {
//         throw new Error("Invalid response, using fallback data.");
//       }
//     } catch (err) {
//       console.warn("⚠️ Backend not available. Using hardcoded rooms.");
//       setRooms(fallbackRooms);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Add Room</Text>
//         <TouchableOpacity
//           style={styles.plusButton}
//           onPress={() => router.push("/Room/RoomCreationScreen")}
//         >
//           <Ionicons name="add" size={28} color="#FFD700" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.roomList}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#FFD700" />
//         ) : rooms.length === 0 ? (
//           <Text style={styles.noRooms}>No rooms found.</Text>
//         ) : (
//           rooms.map((room, index) => (
//             <View key={index} style={styles.roomCard}>
//               <Text style={styles.roomName}>{room.room}</Text>
//               <TouchableOpacity>
//                 <Text style={styles.menuDots}>⋯</Text>
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 22,
//     color: "#FFD700",
//     fontWeight: "bold",
//   },
//   plusButton: {
//     padding: 6,
//   },
//   roomList: {
//     paddingBottom: 20,
//   },
//   roomCard: {
//     backgroundColor: "#111",
//     borderColor: "#FFD700",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   roomName: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   menuDots: {
//     color: "#FFD700",
//     fontSize: 24,
//   },
//   noRooms: {
//     color: "#888",
//     textAlign: "center",
//     marginTop: 30,
//   },
// });




// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import axiosClient from "../../../utils/axiosClient";

// // Hardcoded fallback room data
// const fallbackRooms = [
//   {
//     room: "Living Room",
//     devices: [{ deviceId: "dev001" }],
//   },
//   {
//     room: "Kitchen",
//     devices: [{ deviceId: "dev002" }, { deviceId: "dev003" }],
//   },
// ];

// export default function RoomListScreen() {
//   const router = useRouter();
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
//   const [showOptionsModal, setShowOptionsModal] = useState(false);

//   const fetchRooms = async () => {
//     try {
//       const response = await axiosClient.get("/api/rooms");
//       if (response.status === 200 && Array.isArray(response.data.rooms)) {
//         setRooms(response.data.rooms);
//       } else {
//         throw new Error("Invalid response, using fallback data.");
//       }
//     } catch (err) {
//       console.warn("⚠️ Backend not available. Using hardcoded rooms.");
//       setRooms(fallbackRooms);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Add Room</Text>
//         <TouchableOpacity
//           style={styles.plusButton}
//           onPress={() => router.push("/Room/AddRoom")}
//         >
//           <Ionicons name="add" size={28} color="#FFD700" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.roomList}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#FFD700" />
//         ) : rooms.length === 0 ? (
//           <Text style={styles.noRooms}>No rooms found.</Text>
//         ) : (
//           rooms.map((room, index) => (
//             <View key={index} style={styles.roomCard}>
//               <Text style={styles.roomName}>{room.room}</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedRoomIndex(index);
//                   setShowOptionsModal(true);
//                 }}
//               >
//                 <Text style={styles.menuDots}>⋯</Text>
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Room options modal */}
//       {showOptionsModal && selectedRoomIndex !== null && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 const roomId = rooms[selectedRoomIndex]._id || "N/A";
//                 setShowOptionsModal(false);
//                 router.push(`/Room/EditRoomScreen?id=${roomId}`);
//               }}
//             >
//               <Text style={styles.modalButtonText}>Modify</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.modalButton, { backgroundColor: "#700" }]}
//               onPress={() => {
//                 const updated = rooms.filter((_, i) => i !== selectedRoomIndex);
//                 setRooms(updated);
//                 setShowOptionsModal(false);
//               }}
//             >
//               <Text style={styles.modalButtonText}>Delete</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setShowOptionsModal(false)}
//               style={[styles.modalButton, { backgroundColor: "#555" }]}
//             >
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 22,
//     color: "#FFD700",
//     fontWeight: "bold",
//   },
//   plusButton: {
//     padding: 6,
//   },
//   roomList: {
//     paddingBottom: 20,
//   },
//   roomCard: {
//     backgroundColor: "#111",
//     borderColor: "#FFD700",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   roomName: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   menuDots: {
//     color: "#FFD700",
//     fontSize: 24,
//   },
//   noRooms: {
//     color: "#888",
//     textAlign: "center",
//     marginTop: 30,
//   },
//   modalOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 100,
//   },
//   modalBox: {
//     backgroundColor: "#222",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//   },
//   modalButton: {
//     padding: 12,
//     backgroundColor: "#FFD700",
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });



import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import axiosClient from "../../../utils/axiosClient";

// Hardcoded fallback room data (each with only one device)
const fallbackRooms = [
  {
    room: "Living Room",
    devices: [{ deviceId: "dev001" }],
  },
  {
    room: "Kitchen",
    devices: [{ deviceId: "dev002" }],
  },
];

export default function RoomListScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await axiosClient.get("/api/rooms");
      if (response.status === 200 && Array.isArray(response.data.rooms)) {
        // Ensure only one device per room
        const limitedRooms = response.data.rooms.map(room => ({
          ...room,
          devices: room.devices && room.devices.length > 0 ? [room.devices[0]] : [],
        }));
        setRooms(limitedRooms);
      } else {
        throw new Error("Invalid response, using fallback data.");
      }
    } catch (err) {
      console.warn("⚠️ Backend not available. Using hardcoded rooms.");
      setRooms(fallbackRooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Room</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => router.push("/Room/AddRoom")}
        >
          <Ionicons name="add" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.roomList}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : rooms.length === 0 ? (
          <Text style={styles.noRooms}>No rooms found.</Text>
        ) : (
          rooms.map((room, index) => (
            <TouchableOpacity
              key={index}
              style={styles.roomCard}
              onPress={() => router.push(`/Room/RoomModes?roomId=${room._id || room.room}`)}
            >
              <Text style={styles.roomName}>{room.room}</Text>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedRoomIndex(index);
                  setShowOptionsModal(true);
                }}
              >
                <Text style={styles.menuDots}>⋯</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Room options modal */}
      {showOptionsModal && selectedRoomIndex !== null && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                const roomId = rooms[selectedRoomIndex]._id || "N/A";
                setShowOptionsModal(false);
                router.push(`/Room/EditRoomScreen?id=${roomId}`);
              }}
            >
              <Text style={styles.modalButtonText}>Modify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#700" }]}
              onPress={() => {
                const updated = rooms.filter((_, i) => i !== selectedRoomIndex);
                setRooms(updated);
                setShowOptionsModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowOptionsModal(false)}
              style={[styles.modalButton, { backgroundColor: "#555" }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: "#FFD700",
    fontWeight: "bold",
  },
  plusButton: {
    padding: 6,
  },
  roomList: {
    paddingBottom: 20,
  },
  roomCard: {
    backgroundColor: "#111",
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: {
    color: "#FFF",
    fontSize: 16,
  },
  menuDots: {
    color: "#FFD700",
    fontSize: 24,
  },
  noRooms: {
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalButton: {
    padding: 12,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});