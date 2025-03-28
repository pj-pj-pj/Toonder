import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import file from "../constants/quizCharacters.json";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Foundation from "@expo/vector-icons/Foundation";
import { Card, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const randomArrFunction = <T,>(arr: T[]): T[] => {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
};

const characters = randomArrFunction(file).slice(0, 5);
const MAX_TRIES = 3;

export default function LoveExamScreen() {
  const [triesLeft, setTriesLeft] = useState(3);

  useEffect(() => {
    const loadTries = async () => {
      setTriesLeft(await getExamTries());
    };
    loadTries();
  }, []);

  const getExamTries = async (): Promise<number> => {
    try {
      const storedTries = await AsyncStorage.getItem("examTries");
      return storedTries !== null ? parseInt(storedTries) : MAX_TRIES;
    } catch (error) {
      console.error("Error reading tries:", error);
      return MAX_TRIES;
    }
  };

  const updateDailyTries = async (): Promise<number> => {
    try {
      const now = new Date();
      const today = now.toDateString();
      const [lastResetDate, lastPlayDate] = await Promise.all([
        AsyncStorage.getItem("lastResetDate"),
        AsyncStorage.getItem("lastPlayDate"),
      ]);

      // TODO: will be better if useEffect is used when resetting
      // anyway, how this works is the user plays, then resets tries
      // Check reset time (Sat/Wed 4:44 AM)
      const isResetTime =
        (now.getDay() === 6 || now.getDay() === 3) &&
        now.getHours() === 4 &&
        now.getMinutes() === 44;

      if (isResetTime && lastResetDate !== today) {
        await Promise.all([
          AsyncStorage.setItem("examTries", MAX_TRIES.toString()),
          AsyncStorage.setItem("lastResetDate", today),
          AsyncStorage.setItem("lastPlayDate", today),
        ]);
        return MAX_TRIES;
      }

      const triesString = await AsyncStorage.getItem("examTries");
      let tries = triesString !== null ? parseInt(triesString) : MAX_TRIES;

      if (lastPlayDate !== today) {
        tries = MAX_TRIES;
        await AsyncStorage.setItem("lastPlayDate", today);
      }

      if (tries > 0) {
        tries -= 1;
        await AsyncStorage.setItem("examTries", tries.toString());
      }

      return tries;
    } catch (error) {
      console.error("Error updating tries:", error);
      return MAX_TRIES;
    }
  };

  const handleExamStart = async (character: any) => {
    if (triesLeft <= 0) {
      Alert.alert(
        "You've reached your tries limit.",
        "Tries reset every Saturday and Wednesday at 4:44AM!"
      );

      return;
    }

    const remainingTries = await updateDailyTries();
    setTriesLeft(remainingTries);

    if (remainingTries > 0) {
      router.push({
        pathname: "/exam-screen",
        params: {
          name: character.name,
          imgUrl: character["img-url"],
          show: character.show,
          quizTitle: character.quizTitle,
          triesLeft: remainingTries,
        },
      });
    }
  };

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
            Exam Tries: {triesLeft > 0 ? triesLeft - 1 : triesLeft}/
            {MAX_TRIES - 1}
          </Text>
        </View>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.subtitleInactive}
          onPress={() => router.replace("/character-selection")}
        >
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={14}
            color="white"
          />
          <Text style={{ color: "#e6e6e6", fontSize: 15 }}>Chatbots</Text>
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <Foundation
            name="clipboard-pencil"
            size={14}
            color="white"
          />
          <Text style={{ color: "white", fontSize: 16 }}>Love Exam</Text>
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
          Toonder quizzes you on 5 random characters. Tries reset every
          Wednesday & Saturday at 4:44 AM!
        </Text>
        <FlatList
          style={{
            borderRadius: 10,
            marginTop: 10,
          }}
          data={characters}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleExamStart(item)}>
              <Card
                style={{
                  marginBottom: 10,
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
                  subtitle={item.quizTitle}
                  subtitleVariant="bodyLarge"
                  titleStyle={{ minHeight: 0 }}
                  title={item.name}
                  titleVariant="bodySmall"
                  right={() => (
                    <IconButton
                      size={30}
                      icon="arrow-right-circle"
                    />
                  )}
                />
              </Card>
            </TouchableOpacity>
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
