import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import characters from "../constants/quizCharacters.json";
import { BotMessageSquare, Grid, ScanHeart } from "lucide-react-native";
import { Avatar, Card, IconButton } from "react-native-paper";

export default function LoveExamScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 30,
          }}
        >
          <Text
            style={{
              color: "#7F7B9C",
              textAlign: "center",
              padding: 5,
              paddingHorizontal: 20,
              backgroundColor: "#E1DFF0",
              borderRadius: 25,
            }}
          >
            Exam Tries: 0/3
          </Text>
        </View>
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

      <View style={styles.mainContent}>
        <Text
          style={{
            color: "#7F7B9C",
            textAlign: "center",
            padding: 5,
            paddingHorizontal: 20,
            borderRadius: 25,
          }}
        >
          Today, Marceline Abadeer and Johnny Bravo prepared a special quiz for
          you!
        </Text>
        <FlatList
          style={{ borderRadius: 10 }}
          data={characters}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/character-selection",
                params: {
                  name: item.name,
                  imgUrl: item["img-url"],
                  show: item.show,
                },
              }}
              asChild
            >
              <TouchableOpacity>
                <Card
                  style={{
                    marginTop: 10,
                  }}
                  mode="contained"
                >
                  <Card.Cover
                    style={{
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    source={{ uri: item["img-url"] }}
                  />
                  <Card.Title
                    subtitle="Card Title"
                    subtitleVariant="bodyLarge"
                    titleStyle={{ minHeight: 0 }}
                    title={item.name}
                    titleVariant="bodySmall"
                    right={() => (
                      <IconButton
                        size={30}
                        icon="arrow-right-circle"
                        onPress={() => {}}
                      />
                    )}
                  />
                </Card>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  mainContent: {
    paddingHorizontal: 30,
    paddingBottom: 100,
    paddingTop: 26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "white",
    height: "100%",
  },
});
