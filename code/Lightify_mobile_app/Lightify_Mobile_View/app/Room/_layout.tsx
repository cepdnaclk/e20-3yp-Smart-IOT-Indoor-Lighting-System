import { Stack } from "expo-router";

export default function RoomLayout() {
  return (
    <Stack>
      <Stack.Screen name="addRoom" options={{ title: "AddRoom" }} />
      <Stack.Screen name="addSchedule" options={{ title: "AddSchedule" }} />
    </Stack>
    
  );
}
