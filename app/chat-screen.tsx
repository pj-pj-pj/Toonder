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
import Constants from "expo-constants";

const apiKey = Constants.expoConfig!.extra!.API_KEY;
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
  const { name, imgUrl, show } = useLocalSearchParams();

  const [character, setCharacter] = useState<{ name: string; show: string }>({
    name: name as string,
    show: show as string,
  });
  const [chatSession, setChatSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const initializeChat = async () => {
      const systemPrompt = `You are a sweet gf/bf chatbot with ${name} as your persona from the show ${show}. Your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app.`;

      const chat = await model.startChat({
        generationConfig,
        history: [{ role: "user", parts: [{ text: systemPrompt }] }],
      });

      setChatSession(chat);
    };

    initializeChat();
  }, [name, show]);

  async function sendMessage() {
    if (!chatSession || !userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "You", text: userInput }]);
    setUserInput("");

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
        { sender: "System", text: "Busy. Reach me out later. XOXO" },
      ]);
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
                msg.sender === "You" ? styles.userMessage : styles.botMessage
              }
            >
              <Text style={styles.sender}>{msg.sender}: </Text>
              {msg.text}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendMessage}
          >
            <Text style={styles.buttonText}>Send</Text>
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
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E1DFF0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
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
    borderWidth: 1,
    borderColor: "#7F7B9C",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginLeft: 7,
  },
  button: {
    backgroundColor: "#F08887",
    padding: 12,
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: 10,
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
    textAlign: "center",
    padding: 10,
    margin: "auto",
    marginTop: 20,
    borderRadius: 5,
  },
});
