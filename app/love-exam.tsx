import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import characters from "../constants/characters.json";
import { BotMessageSquare, Grid, ScanHeart } from "lucide-react-native";

export default function LoveExamScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => router.replace("/character-selection")}
        >
          <Text style={styles.subtitleInactive}>
            <BotMessageSquare
              size={15}
              strokeWidth={1.5}
              color={"#e6e6e6"}
              style={{ paddingHorizontal: 15 }}
            />
            Chatbots
          </Text>
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <ScanHeart
            size={15}
            strokeWidth={1.5}
            color={"white"}
          />
          <Text style={{ color: "white", fontSize: 16 }}>Love Exam</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/play-cards")}>
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

      <View style={styles.chatlist}></View>
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
