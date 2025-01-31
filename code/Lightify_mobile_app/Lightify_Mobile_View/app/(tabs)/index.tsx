import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Welcome to Lightify</Text>
      <Text style={styles.subtitle}>Your smart IoT lighting solution.</Text>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Explore"
          onPress={() => router.push("/explore")}
        />
        <View style={styles.buttonSpacing}>
          <Button
            title="Go to Login"
            onPress={() => router.push("/Login")}
          />
        </View>
        <View style={styles.buttonSpacing}>
          <Button
            title="Add Light"
            onPress={() => router.push("/AddLight")}
          />
        </View>
        <View style={styles.buttonSpacing}>
          <Button
            title="Sign Up"
            onPress={() => router.push("/SignUp")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttonSpacing: {
    marginTop: 10,
    width: "100%",
  },
});
