import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { Link, router } from "expo-router";
import characters from "../constants/characters.json";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Foundation from "@expo/vector-icons/Foundation";
import { Searchbar } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CharacterSelectionScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef<TextInput>(null);
  const [profile, setProfile] = useState<any>(null);

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile !== null) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.subtitleInactive}
          onPress={() => router.replace("/love-exam")}
        >
          <Foundation
            name="clipboard-pencil"
            size={14}
            color="#e6e6e6"
          />
          <Text style={{ color: "#e6e6e6", fontSize: 15 }}>Love Exam</Text>
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={14}
            color="white"
          />
          <Text style={{ color: "white", fontSize: 15 }}>Chatbots</Text>
        </View>
        <TouchableOpacity
          style={styles.subtitleInactive}
          onPress={() => router.replace("/play-cards")}
        >
          <MaterialCommunityIcons
            name="cards-playing-outline"
            size={14}
            color="#e6e6e6"
          />
          <Text style={{ color: "#e6e6e6", fontSize: 15 }}>Play Cards</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatlist}>
        <Searchbar
          ref={searchBarRef}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          iconColor="#7C7B9B"
          placeholderTextColor="#a3a2b9"
          onClearIconPress={() => {
            setSearchQuery("");
            searchBarRef.current?.blur();
          }}
          inputStyle={{
            padding: -10,
            marginVertical: -20,
            marginHorizontal: -10,
          }}
          style={{
            height: 38,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        />
        <FlatList
          data={filteredCharacters}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/chat-screen",
                params: {
                  name: item.name,
                  imgUrl: item["img-url"],
                  show: item.show,
                  userName: profile?.name || "Unknown",
                  userAge: profile?.age || "Unknown",
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
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "auto",
    alignItems: "center",
    paddingBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F08887",
    marginLeft: 12,
    fontFamily: "titleFont",
  },
  subtitle: {
    color: "white",
    paddingHorizontal: 15,
    paddingTop: 9,
    paddingBottom: 10,
    marginTop: -10,
    marginBottom: -52,
    zIndex: 999999,
    textAlign: "center",
    backgroundColor: "#F08887",
    borderRadius: 18,
    fontFamily: "subtitleFont",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  subtitleInactive: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "center",
    borderRadius: 18,
    fontFamily: "subtitleFont",
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 10,
    alignItems: "center",
    gap: 5,
  },
  characterCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 29,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    color: "#73719f",
    fontFamily: "contentFont",
  },
  characterShow: {
    fontSize: 14,
    color: "#a3a2b9",
  },
  chatlist: {
    paddingHorizontal: 8,
    paddingBottom: 80,
    paddingTop: 26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "white",
    height: "100%",
  },
});
