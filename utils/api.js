import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import readline from "readline";

dotenv.config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const characters = {
  marceline: {
    name: "Marceline",
    systemPrompt:
      "you are a sweet gf/bf chatbot with marceline from adventure time as your persona, and your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app",
  },
  pearl: {
    name: "Pearl Krabs",
    systemPrompt:
      "you are a sweet gf/bf chatbot with peral krabs from spongebob squarepants as your persona, and your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app",
  },
  squidward: {
    name: "Squidward",
    systemPrompt:
      "you are a sweet gf/bf chatbot with squidward from spongebob squarepants as your persona, and your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app so",
  },
  johnny: {
    name: "Johnny Bravo",
    systemPrompt:
      "you are a sweet gf/bf chatbot with johnny bravo as your persona, and your responses are message-length (not very long, but not short) as if you are speaking with each other through a phone/messaging app",
  },
};

async function startChatSession(character) {
  const { name, systemPrompt } = characters[character];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }], // Set the system prompt as the first message
      },
    ],
  });

  console.log(
    `You are now chatting with ${name}. Type "exit" to end the chat.`
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = async () => {
    rl.question("You: ", async (userInput) => {
      if (userInput.toLowerCase() === "exit") {
        console.log("Chat ended. Goodbye!");
        rl.close();
        return;
      }

      // Send user input to the chatbot
      const result = await chatSession.sendMessage(userInput);
      const response = result.response.text();

      console.log(`${name}:`, response);

      // Continue the conversation
      askQuestion();
    });
  };

  askQuestion();
}

function selectCharacter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Choose a character to chat with:");
  console.log("1. Marceline");
  console.log("2. Pearl Krabs");
  console.log("3. Squidward");
  console.log("4. Johnny Bravo");

  rl.question("Enter the number of your choice: ", (choice) => {
    const characterMap = {
      1: "marceline",
      2: "pearl",
      3: "squidward",
      4: "johnny",
    };

    const character = characterMap[choice];
    if (character) {
      startChatSession(character);
    } else {
      console.log("Invalid choice. Please try again.");
      selectCharacter();
    }
  });
}

// Start the app
selectCharacter();
