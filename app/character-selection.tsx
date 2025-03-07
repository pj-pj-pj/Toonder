import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import characters from "../constants/characters.json";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

export default function CharacterSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>

      <View style={styles.chatlist}>
        <Text style={styles.subtitle}>♡ Chatbots</Text>
        <FlatList
          data={characters}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/chat-screen",
                params: {
                  name: item.name,
                  imgUrl: item["img-url"],
                  show: item.show,
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.characterCard}>
                <Image
                  source={{ uri: item["img-url"] }}
                  style={styles.characterImage}
                />
                <View style={styles.characterInfo}>
                  {item.show ? (
                    <>
                      <Text style={styles.characterName}>{item.name}</Text>
                      <Text style={styles.characterShow}>{item.show}</Text>
                    </>
                  ) : (
                    <Text style={styles.characterName}>{item.name}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7C7B9B",
  },
  header: {
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
    fontFamily: "titleFont",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    paddingHorizontal: 40,
    padding: 10,
    paddingTop: 8,
    marginTop: -25,
    margin: "auto",
    marginBottom: 14,
    zIndex: 999999,
    textAlign: "center",
    backgroundColor: "#F08887",
    borderRadius: 20,
    fontFamily: "contentFont",
  },
  characterCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  characterImage: {
    width: 59,
    height: 59,
    borderRadius: 29,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#7C7B9B",
    fontFamily: "contentFont",
  },
  characterShow: {
    paddingTop: 3,
    fontSize: 14,
    color: "#666",
  },
  chatlist: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 14,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "white",
    height: "100%",
  },
});
