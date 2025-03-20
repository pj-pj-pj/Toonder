import { Text, View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

const taglines = [
  "Fall in love with your favorite cartoons—one message at a time.",
  "Where cartoon crushes come to life.",
  "Flirt, chat, and dream with your animated soulmates.",
  "Romance reimagined—chat with your cartoon fantasies.",
  "Your favorite characters, your love story.",
  "Love letters from your animated crushes.",
  "Chat with cartoons, spark a romance.",
  "Where cartoons meet romance.",
  "Unleash your inner cartoon lover.",
  "Flirty chats with your favorite animated characters.",
];
const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

export default function HomeScreen() {
  useEffect(() => {
    Alert.alert(
      "Welcome to Toonder!",
      "Stay connected to the internet ❤️ if there's no response, you may have hit the message limit.",
      [
        {
          text: "Got it!",
          onPress: () => {
            const timer = setTimeout(() => {
              router.replace("/character-selection");
            }, 1700);

            return () => clearTimeout(timer);
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn3d.iconscout.com/3d/premium/thumb/love-robot-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--bot-cute-intelligence-pack-robotics-illustrations-6649234.png",
        }}
        style={styles.heart}
      />
      <Text style={styles.mainText}>Toonder</Text>
      <Text style={styles.tagline}>{randomTagline}</Text>

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
    backgroundColor: "#7F7B9C",
  },
  heart: {
    height: 200,
    width: 200,
    margin: 25,
    opacity: 0.7,
  },
  mainText: {
    fontSize: 19,
    color: "#F08887",
    fontWeight: "bold",
  },
  tagline: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 35,
    paddingVertical: 7,
    textAlign: "center",
    textAlignVertical: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#F08887",
  },
});
