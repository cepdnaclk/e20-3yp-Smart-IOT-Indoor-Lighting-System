import { Ionicons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosClient from "../../../utils/axiosClient";

const USERNAME = "Tharindu";

// ----------------------------------------------------------------------------
// publishDirectLightSet → now uses dynamic roomName from sections
// ----------------------------------------------------------------------------
const publishDirectLightSet = async (allSections, sectionIndex) => {
  const { section: roomName, devices } = allSections[sectionIndex];

  const messageArray = devices.map((dev) => ({
    bulb_id: dev.id,
    brightness: dev.value,
  }));
  const automationArray = [{ schedule_type: "permanent", schedule_working_period: null }];

  const payload = {
    command: "direct_light_set",
    payload: {
      room_name: roomName,
      message: messageArray,
      automation: automationArray,
    },
  };

  const fullUrl = `/mqtt/publish?username=${USERNAME}&roomName=${roomName}`;

  try {
    await axiosClient.post(fullUrl, payload);
    // console.log("✅ direct_light_set sent:", payload);
  } catch (err) {
    // console.error("❌ Error sending direct_light_set:", err);
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
    paddingBottom: 10,
    backgroundColor: "#000",
  },
  bulbIcon: {
    marginRight: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
    fontStyle: "italic",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  container: {
    width: "85%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  value: {
    fontSize: 24,
    marginVertical: 10,
    color: "#FFD700",
  },
  gaugeBackground: {
    position: "absolute",
    height: 200,
    width: 70,
    backgroundColor: "rgba(17,17,17,0.5)",
    borderRadius: 35,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  gaugeFill: {
    backgroundColor: "#FFD700",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconButton: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 8,
  },
  closeText: {
    marginTop: 20,
    color: "#FFD700",
    fontWeight: "bold",
  },
});

const SmartHomeDashboard = () => {
  const router = useRouter();

  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [sections, setSections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBulb, setSelectedBulb] = useState(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [deviceInput, setDeviceInput] = useState("");
  const [deviceNameInput, setDeviceNameInput] = useState("");

  // ----------------------------------------------------------------------------
  // load clock + wishlist rooms + initial room states
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
      setDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    };

    const fetchWishlist = async () => {
      try {
        const res = await axiosClient.get(`/api/rooms/wishlist?username=${USERNAME}`);
        const wishlistRooms = res.data.filter((r) => r.wishlist);

        // initialize sections with 4 bulbs each
        const initial = wishlistRooms.map((r) => ({
          section: r.roomName,
          devices: [
            { name: "Bulb 1", id: 1, type: "lamp", value: 0, isOn: false },
            { name: "Bulb 2", id: 2, type: "lamp", value: 0, isOn: false },
            { name: "Bulb 3", id: 3, type: "lamp", value: 0, isOn: false },
            { name: "Bulb 4", id: 4, type: "lamp", value: 0, isOn: false },
          ],
        }));
        setSections(initial);

        // fetch each room's real state
        wishlistRooms.forEach(async (room, idx) => {
          await axiosClient.post(
            `/api/backend/requestRoomState?username=${USERNAME}&roomName=${room.roomName}`
          );
          const state = await axiosClient.get(
            `/api/backend/roomState?username=${USERNAME}&roomName=${room.roomName}`
          );
          const msgArray = state.data.message || [];

          setSections((prev) =>
            prev.map((sec, i) => {
              if (i !== idx) return sec;
              return {
                ...sec,
                devices: sec.devices.map((dev) => {
                  const m = msgArray.find((x) => x.bulb_id === dev.id);
                  return m
                    ? { ...dev, value: m.brightness, isOn: m.brightness > 0 }
                    : dev;
                }),
              };
            })
          );
        });
      } catch (err) {
        // console.error("Error fetching wishlist rooms:", err);
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    fetchWishlist();
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------------------------------
  // toggle on/off
  // ----------------------------------------------------------------------------
  const handleToggle = (si, di) => {
  // 1) build the updated sections array
  const newSections = sections.map((sec, i) =>
    i === si
      ? {
          ...sec,
          devices: sec.devices.map((dev, j) =>
            j === di
              ? {
                  ...dev,
                  isOn: !dev.isOn,
                  value: dev.isOn ? 0 : 100,  // toggles value
                }
              : dev
          ),
        }
      : sec
  );

  // 2) update state
  setSections(newSections);
  setModalVisible(false);

  // 3) publish immediately using the UPDATED data
  publishDirectLightSet(newSections, si);
};

  // ----------------------------------------------------------------------------
  // change brightness
  // ----------------------------------------------------------------------------
  const handleSliderChange = (si, di, newValue) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === si
          ? {
              ...sec,
              devices: sec.devices.map((dev, j) =>
                j === di ? { ...dev, value: Math.round(newValue) } : dev
              ),
            }
          : sec
      )
    );
    setTimeout(() => publishDirectLightSet(sections, si), 0);
  };

  // ----------------------------------------------------------------------------
  // open detail modal
  // ----------------------------------------------------------------------------
  const openBulbModal = (si, di) => {
    const dev = sections[si].devices[di];
    setSelectedBulb({ ...dev, sectionIndex: si, deviceIndex: di });
    setModalVisible(true);
  };

  // ----------------------------------------------------------------------------
  // add new device
  // ----------------------------------------------------------------------------
  const handleAddDevice = async () => {
    const cleaned = deviceInput.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
    if (cleaned.length !== 12) {
      alert("Please enter a valid 12-character hex string.");
      return;
    }
    if (!deviceNameInput.trim()) {
      alert("Please enter a device name.");
      return;
    }
    const formatted = cleaned.match(/.{1,2}/g).join(":");
    try {
      await axiosClient.post("/api/devices", {
        username: USERNAME,
        macAddress: formatted,
        deviceName: deviceNameInput.trim(),
      });
      alert("Device added successfully!");
      setShowAddDeviceModal(false);
      setDeviceInput("");
      setDeviceNameInput("");
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device.");
    }
  };

  // ----------------------------------------------------------------------------
  // render
  // ----------------------------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerContainer}>
          <Ionicons name="bulb-outline" size={40} color="#FFD700" style={styles.bulbIcon} />
          <Text style={styles.logoText}>LIGHTIFY</Text>
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              backgroundColor: "#FFD700",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 6,
            }}
            onPress={() => setShowAddDeviceModal(true)}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>
              + Add Device
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clock */}
        <View
          style={{
            backgroundColor: "#2b2b2b",
            margin: 20,
            padding: 20,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFD700", fontSize: 28, fontWeight: "bold" }}>
            {time}
          </Text>
          <Text style={{ color: "#ccc", fontSize: 18, marginTop: 4 }}>{day}</Text>
          <Text style={{ color: "#ccc", fontSize: 16 }}>{date}</Text>
        </View>

        {sections.map((section, si) => (
          <View key={si} style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
                {section.section}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFA500",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                  onPress={() => router.push("/Room/RadarDataReceiver")}
                >
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>
                    Calibrate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                   style={{
                     backgroundColor: "#00D1B2",
                     paddingVertical: 8,
                     paddingHorizontal: 12,
                     borderRadius: 6,
                     marginRight: 10,
                   }}
                   onPress={() =>
                     router.push({
                       pathname: "/shape-selector/ShapeSelector",
                       params: { roomName: "Bathroom", username: "Tharindu" },
                     })
                   }
                 >
                   <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>
                     Shapes
                   </Text>
                 </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFD700",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                  }}
                  onPress={() => router.push("/Room/AddSchedule")}
                >
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 14 }}>
                    + Add Schedule
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {section.devices.map((device, di) => (
                <View
                  key={di}
                  style={{
                    width: "48%",
                    backgroundColor: "#2D2D2D",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => openBulbModal(si, di)}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <MaterialCommunityIcons name="cog-outline" size={20} color="#FFD700" />
                  </TouchableOpacity>

                  <Text style={{ color: "white", fontWeight: "bold" }}>{device.name}</Text>
                  <TouchableOpacity onPress={() => openBulbModal(si, di)}>
                    <MaterialCommunityIcons
                      name={device.isOn ? "lightbulb-on" : "lightbulb-outline"}
                      size={50}
                      color={device.isOn ? "#FFD700" : "#555"}
                      style={{ marginBottom: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* + Add Room Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFD700",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={() => router.push("/Room/AddRoomHome")}
          >
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
              + Add Room
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bulb Detail Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            {selectedBulb && (
              <>
                <Text style={modalStyles.title}>{selectedBulb.name}</Text>
                <Text style={modalStyles.value}>{selectedBulb.value}%</Text>

                <View style={{ height: 220, justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
                  <View style={modalStyles.gaugeBackground}>
                    <View style={[modalStyles.gaugeFill, { height: `${selectedBulb.value}%` }]} />
                  </View>
                  <View
                    style={{
                      transform: [{ rotate: "-90deg" }],
                      position: "absolute",
                      height: 200,
                      width: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* White border track */}
                    <View
                      style={{
                        position: "absolute",
                        width: 180,         // slightly smaller than slider width
                        height: 4,          // height of the border line
                        backgroundColor: "transparent",
                        borderColor: "white",
                        borderWidth: 2,
                        borderRadius: 2,
                      }}
                    />

                    <Slider
                      style={{ width: 200, height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={selectedBulb.value}
                      minimumTrackTintColor="transparent"
                      maximumTrackTintColor="transparent"
                      thumbTintColor="transparent"
                      onValueChange={(newValue) => {
                        handleSliderChange(
                          selectedBulb.sectionIndex,
                          selectedBulb.deviceIndex,
                          newValue
                        );
                        setSelectedBulb({
                          ...selectedBulb,
                          value: Math.round(newValue),
                        });
                      }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                  <TouchableOpacity
                    style={modalStyles.iconButton}
                    onPress={() => handleToggle(selectedBulb.sectionIndex, selectedBulb.deviceIndex)}
                  >
                    <MaterialCommunityIcons name="power" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Device Modal */}
      <Modal visible={showAddDeviceModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Enter Device ID</Text>
            <TextInput
              placeholder="Example: 9454C5B7E32C"
              value={deviceInput}
              onChangeText={setDeviceInput}
              style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 }}
              autoCapitalize="characters"
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Enter Device Name</Text>
            <TextInput
              placeholder="e.g., Living Room Bulb"
              value={deviceNameInput}
              onChangeText={setDeviceNameInput}
              style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 }}
            />
            <TouchableOpacity style={{ backgroundColor: "#FFD700", padding: 12, borderRadius: 8, alignItems: "center" }} onPress={handleAddDevice}>
              <Text style={{ fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddDeviceModal(false)} style={{ marginTop: 15, alignItems: "center" }}>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SmartHomeDashboard;