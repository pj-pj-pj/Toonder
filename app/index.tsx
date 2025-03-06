import { Text, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useEffect } from "react";

export default function HomeScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/CharacterSelectionScreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>[toonder-icon]</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>pj-pj-pj</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBB5B6",
  },
  mainText: {
    fontSize: 24,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
