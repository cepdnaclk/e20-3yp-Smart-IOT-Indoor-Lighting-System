// import "../global.css";

// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/useColorScheme";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack>
//         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" /> */}

        
//         {/* <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
//         <Stack.Screen name="auth/login" options={{ headerShown: false }} /> */}
        
//         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }


import { Slot } from "expo-router";
import FlashMessage from "react-native-flash-message";

export default function RoomListScreen() {
  return (
    <>
      {/* this renders all your screens */}
      <Slot />

      {/* this must live at the root so toasts can overlay anything */}
      <FlashMessage position="top" />
    </>
  );
}