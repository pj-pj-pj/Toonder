import { Text, View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { AnimatedLikeButton } from "@/components/AnimatedLikeButton";

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
  const [showInstruction, setShowInstruction] = useState(false);
  const primaryColor = "#000000";
  const accentColor = "#e54645";

  function handleOnPress() {
    setTimeout(() => {
      router.replace("/character-selection");
    }, 1000);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setShowInstruction(true);
    }, 2000);

    return () => clearInterval(timer);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Toonder</Text>
      <Text style={styles.tagline}>
        Stay connected to the internet. If there's no response, you may have hit
        the message limit.
      </Text>
      <Image
        source={{
          uri: "https://cdn3d.iconscout.com/3d/premium/thumb/love-robot-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--bot-cute-intelligence-pack-robotics-illustrations-6649234.png",
        }}
        style={styles.heart}
      />

      <View style={styles.note}>
        <Text style={styles.heartDecor}>💘💘💘</Text>
        <Text style={styles.tagline}>{randomTagline}</Text>
      </View>
      <AnimatedLikeButton
        primary={primaryColor}
        accent={accentColor}
        onPress={handleOnPress}
      />
      {showInstruction && (
        <Text style={styles.tagline}>Click the 💗 Button to get started!</Text>
      )}
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
  note: {
    alignItems: "center",
    backgroundColor: "#6b6691",
    borderRadius: 10,
    paddingBottom: 15,
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 15,
  },
  heartDecor: {
    marginTop: -14,
    fontSize: 25,
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
