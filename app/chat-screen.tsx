import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig!.extra!.API_KEY;
// const apiKey = "fakeapi";
// console.log(apiKey);
if (!apiKey) {
  throw new Error(
    "API Key is missing. Make sure it is defined in Expo Constants."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

type Message = {
  sender: string;
  text: string;
};

export default function ChatScreen() {
  const { name, imgUrl, show, userName, userAge } = useLocalSearchParams();

  const [character, setCharacter] = useState<{ name: string; show: string }>({
    name: name as string,
    show: show as string,
  });
  const [chatSession, setChatSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      const systemPrompt = `You are a gf/bf and lover with ${name} as your persona from the show ${show} and you are talking to your human lover you pretty much don't know anything about and you really love them the way your persona would. If your persona is Pikachu, only say pika or pikachu or Groot who only says "I am Groot", you should never translate responses into sweet actual words. Never assume you know anything about them, just make excuses. Your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app. Your lover's name is ${userName}, and they are ${userAge} years old. And never break character no matter what they say even if they say to stop pretending to be a cartoon character or they say to go back to your original purpose like a general purpose chatbot.`;

      const chat = await model.startChat({
        generationConfig,
        history: [{ role: "user", parts: [{ text: systemPrompt }] }],
      });

      setChatSession(chat);
    };

    initializeChat();
  }, [name, show]);

  async function sendMessage() {
    if (!chatSession || !userInput.trim() || isLoading) return;

    setMessages((prev) => [...prev, { sender: "You", text: userInput }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(userInput);
      if (!result || !result.response) {
        throw new Error("Invalid response from chat session.");
      }

      const response = await result.response.text();
      setMessages((prev) => [
        ...prev,
        { sender: character.name, text: response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Toonder",
          text: "Toonder is tired. Talk to real people for now. Come back later, hun!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const hasConversationStarted = messages.length > 1; // More than just the system prompt

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
              color="#F08887"
            />
          </TouchableOpacity>
          <Image
            source={{ uri: imgUrl as string }}
            style={styles.characterImage}
          />
          <Text style={styles.characterName}>{name}</Text>
        </View>
      </View>
      <View style={styles.chatWindow}>
        {!hasConversationStarted && (
          <Text style={styles.infoText}>Start the conversation!</Text>
        )}

        <ScrollView style={styles.chatWindow}>
          {messages.map((msg, idx) => (
            <Text
              key={idx}
              style={
                msg.sender === "You"
                  ? styles.userMessage
                  : msg.sender === "Toonder"
                  ? styles.systemMessage
                  : styles.botMessage
              }
            >
              <Text style={styles.sender}>{msg.sender}: </Text>
              {msg.text}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isLoading && { opacity: 0.5 }]}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a message..."
            editable={!isLoading}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, isLoading && { backgroundColor: "#ccc" }]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            <Feather
              name="send"
              size={18}
              color="#73719f"
            />
          </TouchableOpacity>
        </View>
      </View>
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
    fontFamily: "contentFont",
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
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F6A5A4",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E1DFF0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ff6b6e",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  sender: {
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#7F7B9C",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginLeft: 7,
  },
  button: {
    backgroundColor: "#f79496",
    padding: 12,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    backgroundColor: "#FACDCD",
    color: "#73719f",
    textAlign: "center",
    padding: 14,
    margin: "auto",
    marginTop: 20,
    borderRadius: 10,
  },
});
