import { Text, View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

export default function HomeScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/character-selection");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn3d.iconscout.com/3d/premium/thumb/love-robot-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--bot-cute-intelligence-pack-robotics-illustrations-6649234.png",
        }}
        style={styles.heart}
      />
      <View style={styles.footer}>
        <Text style={styles.mainText}>Toonder</Text>
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
    backgroundColor: "#7F7B9C",
  },
  heart: {
    height: 200,
    width: 200,
    margin: 15,
    opacity: 0.7,
  },
  mainText: {
    fontSize: 17,
    color: "#F08887",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#fff",
  },
});
