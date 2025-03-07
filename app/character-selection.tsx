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

export default function CharacterSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>

      <View style={styles.chatlist}>
        <Text style={styles.subtitle}>❣❣ Chatbots ❣❣</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#F08887",
    marginLeft: 12,
    fontFamily: "titleFont",
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    paddingHorizontal: 30,
    padding: 14,
    paddingTop: 9,
    marginTop: -25,
    margin: "auto",
    marginBottom: 14,
    zIndex: 999999,
    textAlign: "center",
    backgroundColor: "#F08887",
    borderRadius: 20,
    fontFamily: "subtitleFont",
  },
  characterCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  characterImage: {
    width: 55,
    height: 55,
    borderRadius: 29,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    color: "#73719f",
    fontFamily: "contentFont",
  },
  characterShow: {
    fontSize: 14,
    color: "#a3a2b9",
  },
  chatlist: {
    paddingHorizontal: 8,
    paddingBottom: 70,
    fontSize: 14,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "white",
    height: "100%",
  },
});
