import { Text, View } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Constants from "expo-constants";

const apiKey =
  Constants.expoConfig?.extra?.API_KEYF ||
  "AIzaSyCD7Ggs51JRtz0bMf5HV4cYHnDv__VYw_M";
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

interface QuizQuestion {
  question: string;
  questionId: string;
  options: string[];
  correctAnswer: string;
  title: string;
}

export default function ExamScreen() {
  const { name, show, quizTitle } = useLocalSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const systemPrompt = `Generate 15 romantic-themed multiple-choice questions about ${name} from ${show} with their quiz title as ${quizTitle}. Format each question like this example:

        {
          "question": "What would ${name} consider the perfect date?",
          "questionId": "1",
          "options": [
            "A quiet night reading spellbooks",
            "Dancing under the moonlight",
            "Fighting demons together",
            "All of the above"
          ],
          "correctAnswer": "All of the above",
        }

        Return ONLY the JSON array, with no additional text or explanation.`;

        const chat = model.startChat({
          generationConfig: {
            ...generationConfig,
            responseMimeType: "text/plain", // Keep as text/plain
          },
          history: [{ role: "user", parts: [{ text: systemPrompt }] }],
        });

        const result = await chat.sendMessage(systemPrompt);
        const responseText = (await result.response).text();

        // Clean and parse the response
        const jsonString = extractJsonFromText(responseText);
        const parsedQuestions = JSON.parse(jsonString) as QuizQuestion[];

        setQuestions(parsedQuestions);
      } catch (err) {
        console.error("Quiz generation failed:", err);
        setError("Failed to generate quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [name, show]);

  // Helper function to extract JSON from text response
  const extractJsonFromText = (text: string): string => {
    try {
      // Try to find JSON within ``` markers
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) return jsonMatch[1];

      // Try to find JSON within ``` markers (no json prefix)
      const altMatch = text.match(/```\n([\s\S]*?)\n```/);
      if (altMatch) return altMatch[1];

      // Try to find raw JSON array
      const arrayMatch = text.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (arrayMatch) return arrayMatch[0];

      // Fallback to treating entire response as JSON
      return text;
    } catch (e) {
      console.error("Error extracting JSON:", e);
      return text; // Fallback
    }
  };

  if (error) return <Text>{error}</Text>;

  if (loading) {
    return <Text>{name} is preparing your questions...</Text>;
  }

  return (
    <View>
      {questions.length > 0 && (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{quizTitle}</Text>

          {questions.map((q) => (
            <View
              key={q.questionId}
              style={{ marginVertical: 15 }}
            >
              <Text style={{ fontWeight: "bold" }}>{q.question}</Text>
              {q.options.map((option, i) => (
                <Text key={i}>• {option}</Text>
              ))}
            </View>
          ))}
        </>
      )}
    </View>
  );
}
