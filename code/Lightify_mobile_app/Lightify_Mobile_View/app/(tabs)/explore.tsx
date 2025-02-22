import { View, Text, StyleSheet } from "react-native";
// import SignupScreen from "@/components/Authentication/SignUp"
// import Login from "@/components/Authentication/Login"

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Features</Text>
      <Text style={styles.subtitle}>
        Discover the various lighting options.
      </Text>
      {/* <Login/>
      <SignupScreen/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
});
