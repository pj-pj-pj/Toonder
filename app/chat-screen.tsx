import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { name, imgUrl, show } = useLocalSearchParams();
  const img = imgUrl as string; // TO REMOVE ANNOYING ERRORS GRR TS

  return (
    <View style={styles.biggerContainer}>
      <View style={styles.container}>
        <View style={styles.characterDetail}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/character-selection");
            }}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={28}
              color="white"
            />
          </TouchableOpacity>
          <Image
            source={{ uri: img }}
            style={styles.characterImage}
          />
          <Text style={styles.characterName}>{name}</Text>
        </View>
      </View>
      <View style={styles.chatWindow}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  biggerContainer: {
    backgroundColor: "#7F7B9C",
    flex: 1,
  },
  container: {
    paddingHorizontal: 25,
    paddingVertical: 13,
  },
  characterImage: {
    width: 45,
    height: 45,
    borderRadius: 29,
    marginRight: 8,
    marginLeft: 20,
  },
  characterName: {
    fontSize: 17,
    fontWeight: 500,
    color: "white",
  },
  characterDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatWindow: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});
