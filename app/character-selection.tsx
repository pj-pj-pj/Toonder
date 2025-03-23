import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import characters from "../constants/characters.json";
import { Blocks, BotMessageSquare, Grid, ScanHeart } from "lucide-react-native";
import { Searchbar } from "react-native-paper";
import { useRef, useState } from "react";

export default function CharacterSelectionScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef<TextInput>(null);

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity>
          <Text style={styles.subtitleInactive}>
            <ScanHeart
              size={15}
              strokeWidth={1.5}
              color={"#e6e6e6"}
              style={{ paddingHorizontal: 15 }}
            />
            Love Exam
          </Text>
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <BotMessageSquare
            size={15}
            strokeWidth={1.5}
            color={"white"}
          />
          <Text style={{ color: "white", fontSize: 16 }}>Chatbots</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.subtitleInactive}>
            <Grid
              size={15}
              strokeWidth={1.5}
              color={"#e6e6e6"}
              style={{ paddingHorizontal: 15 }}
            />
            Play Cards
          </Text>
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
  },
  subtitleInactive: {
    fontSize: 16,
    color: "#e6e6e6",
    textAlign: "center",
    borderRadius: 18,
    fontFamily: "subtitleFont",
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 10,
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
