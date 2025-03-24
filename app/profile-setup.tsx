import { AnimatedLikeButton } from "@/components/AnimatedLikeButton";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Image, TextInput, Alert } from "react-native";

export default function ProfileSetupScreen() {
  const [profile, setProfile] = useState({ name: "", age: 16 });
  const [inputName, setInputName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [stage, setStage] = useState(2);

  const primaryColor = "#282828";
  const accentColor = "#e56766";

  function handleOnPressName() {
    if (inputName.trim() === "") {
      Alert.alert("Toonder is not for nameless.", "Please enter your name.");

      return;
    }

    setTimeout(() => {
      setProfile((prev) => ({ ...prev, name: inputName }));
      setStage(1);
    }, 500);
  }

  function handleOnPressAge() {
    if (inputAge.trim() === "") {
      Alert.alert("Toonder is not for ageless.", "Please enter your age.");

      return;
    }

    const age = parseInt(inputAge);

    if (age < 16) {
      Alert.alert("Toonder is not for you!", "Get out of here kid. 🚓");
      return;
    }

    if (age > 99) {
      Alert.alert(
        "Okay. Stop!",
        "You know what, it doesn't matter. You're fine. I actually don't care."
      );

      Alert.alert("Toonder is not for you!", "Go away, old person.");

      setProfile((prev) => ({ ...prev, age: age }));

      setTimeout(() => {
        router.replace("/character-selection");

        return;
      }, 1000);
    }

    setProfile((prev) => ({ ...prev, age: age }));

    setTimeout(() => {
      router.replace("/character-selection");
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Toonder</Text>
      <Image
        source={{
          uri: "https://cdn3d.iconscout.com/3d/premium/thumb/love-robot-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--bot-cute-intelligence-pack-robotics-illustrations-6649234.png",
        }}
        style={styles.heart}
      />

      {stage == 2 && (
        <>
          <Text style={styles.tagline}>Tell us your name!</Text>

          <View style={styles.note}>
            <Text style={styles.heartDecor}>💘💘</Text>
            <TextInput
              style={{ marginHorizontal: 15, color: "white", fontSize: 18 }}
              placeholder="0-16 Characters"
              placeholderTextColor={"#a3a2b9"}
              autoFocus
              cursorColor={"#F08887"}
              inputMode="text"
              maxLength={16}
              value={inputName}
              onChangeText={setInputName}
            />
          </View>

          <AnimatedLikeButton
            primary={inputName.trim() === "" ? primaryColor : accentColor}
            accent={inputName.trim() === "" ? primaryColor : accentColor}
            onPress={handleOnPressName}
          />
        </>
      )}

      {stage == 1 && (
        <>
          <Text style={styles.tagline}>How old are you?</Text>

          <View style={styles.note}>
            <Text style={styles.heartDecor}>💘</Text>
            <TextInput
              style={{ marginHorizontal: 15, color: "white", fontSize: 18 }}
              placeholder="16-99"
              placeholderTextColor={"#a3a2b9"}
              autoFocus
              cursorColor={"#F08887"}
              inputMode="numeric"
              maxLength={3}
              value={inputAge}
              onChangeText={setInputAge}
            />
          </View>

          <AnimatedLikeButton
            primary={
              inputAge.trim() === "" || parseInt(inputAge, 10) < 16
                ? primaryColor
                : accentColor
            }
            accent={
              inputAge.trim() === "" || parseInt(inputAge, 10) < 16
                ? primaryColor
                : accentColor
            }
            onPress={handleOnPressAge}
          />
        </>
      )}
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
    paddingBottom: 10,
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 15,
    justifyContent: "center",
  },
  heartDecor: {
    marginTop: -14,
    fontSize: 25,
  },
  heart: {
    height: 180,
    width: 180,
    margin: 25,
    opacity: 0.7,
  },
  mainText: {
    fontSize: 24,
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
