import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import React from "react";
import back from "../assets/images/back.png";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Image
          style={styles.arrow}
          source={back}
        ></Image>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 23,
  },
  button: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  arrow: {
    width: 30,
    height: 30,
  },
});
