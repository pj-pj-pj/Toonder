import { AnimatedLikeButton } from "@/components/AnimatedLikeButton";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileSetupScreen() {
  const [profile, setProfile] = useState({ name: "", age: "" });
  const [inputName, setInputName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [stage, setStage] = useState(2);

  useEffect(() => {
    if (profile.name && profile.age) {
      saveProfile();
    }
  }, [profile]);

  function handleOnPressName() {
    if (inputName.trim() === "") {
      Alert.alert("Toonder is not for nameless.", "Please enter your name.");

      return;
    }

    setProfile((prev) => ({ ...prev, name: inputName }));
    setStage(1);
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

    setProfile((prev) => ({ ...prev, age: inputAge }));
  }

  const saveProfile = async () => {
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    await AsyncStorage.setItem("examTries", "3");

    Alert.alert(
      "Toonder Profile saved!",
      `Your name is ${profile.name} and you are ${profile.age} years old. ${
        parseInt(profile.age) > 70 ? `(Aren't you way too old? Anyway...)` : ""
      }`,
      [{ text: "OK", onPress: () => router.replace("/character-selection") }]
    );
  };

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
              style={{ marginHorizontal: 40, color: "white", fontSize: 16 }}
              placeholder="0-16 Characters"
              placeholderTextColor={"#a3a2b9"}
              autoFocus
              cursorColor={"#F08887"}
              inputMode="text"
              maxLength={16}
              value={inputName}
              onChangeText={setInputName}
              onSubmitEditing={handleOnPressName}
            />
          </View>
        </>
      )}

      {stage == 1 && (
        <>
          <Text style={styles.tagline}>How old are you?</Text>

          <View style={styles.note}>
            <Text style={styles.heartDecor}>💘</Text>
            <TextInput
              style={{ marginHorizontal: 25, color: "white", fontSize: 18 }}
              placeholder="16-99+"
              placeholderTextColor={"#a3a2b9"}
              autoFocus
              cursorColor={"#F08887"}
              inputMode="numeric"
              maxLength={3}
              value={inputAge}
              onChangeText={setInputAge}
              onSubmitEditing={handleOnPressAge}
            />
          </View>
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
    marginTop: 50,
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
