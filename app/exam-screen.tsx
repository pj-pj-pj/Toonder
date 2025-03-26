import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import { ProgressBar } from "react-native-paper";

const apiKey = Constants.expoConfig?.extra?.API_KEYX;
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
}

export default function ExamScreen() {
  const { name, show, quizTitle, imgUrl } = useLocalSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

    // Check if answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  };

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const systemPrompt = `Generate 8 romantic-themed (where the love interest is the person being asked) multiple-choice questions (where the correct answer is definitely in the choices, avoid questions that can be answered with all of the above, or all of them or something like that) about ${name} from ${show} with their quiz title as ${quizTitle}. Format each question like this example:

        {
          "question": "What would ${name} consider the perfect date?",
          "questionId": [id:starting with 0],
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
        console.log(parsedQuestions);

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

  if (error)
    return (
      <>
        <Text>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("/love-exam");
          }}
          disabled={!selectedAnswer}
          style={[
            {
              backgroundColor: "#F6A5A4",
              paddingHorizontal: 125,
              paddingVertical: 10,
              borderRadius: 20,
              marginBottom: 35,
              marginTop: 10,
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: 15,
                color: "white",
              },
            ]}
          >
            I'll try again later
          </Text>
        </TouchableOpacity>
      </>
    );

  return (
    <View
      style={{
        backgroundColor: "#7F7B9C",
        flex: 1,
      }}
    >
      <View style={styles.characterDetail}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/love-exam");
          }}
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={22}
            color="#F08887"
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
            margin: "auto",
            color: "white",
            paddingVertical: 3,
            paddingHorizontal: 20,
            borderRadius: 15,
          }}
        >
          {quizTitle}
        </Text>
      </View>

      {loading ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
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
              marginTop: 20,
              marginHorizontal: 20,
            }}
          >
            {name} is preparing your questions...
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{ paddingHorizontal: 30, marginTop: 5, paddingVertical: 20 }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "white",
                textAlign: "center",
                padding: 10,
              }}
            >
              Score: {score}/{questions.length}
            </Text>
            <ProgressBar
              progress={score / questions.length}
              color={"#F6A5A4"}
              style={{
                borderRadius: 50,
                height: 7,
                maxWidth: 300,
                margin: "auto",
              }}
            />
          </View>

          <ScrollView
            style={{
              display: "flex",
              margin: "auto",
            }}
          >
            <View style={[styles.questionnaire]}>
              {questions.length > 0 && (
                <View>
                  <Image
                    source={{ uri: imgUrl as string }}
                    style={styles.characterImage}
                  />
                  {/* Progress indicator */}
                  <Text style={{ marginVertical: 11, textAlign: "center" }}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Text>

                  {/* Current question */}
                  <View
                    style={{
                      marginBottom: 10,
                      backgroundColor: "#E6E4F2",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: "10%",
                      paddingVertical: "20%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {questions[currentQuestionIndex].question}
                    </Text>
                  </View>

                  {/* Answer options */}
                  <View>
                    {questions[currentQuestionIndex].options.map(
                      (option, i) => (
                        <TouchableOpacity
                          key={i}
                          style={{
                            padding: 10,
                            paddingHorizontal: 15,
                            paddingVertical: 13,
                            marginTop: 5,
                            backgroundColor: selectedAnswer
                              ? option ===
                                questions[currentQuestionIndex].correctAnswer
                                ? "#6bba6b" // Correct answer turns green
                                : selectedAnswer === option
                                ? "#8c8c8c" // Selected wrong answer turns gray
                                : "#8c8c8c" // Other options stay pink
                              : "#dfacac", // Default pink when nothing selected
                            borderRadius: 30,
                          }}
                          onPress={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              textAlign: "center",
                            }}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                    <View>
                      {selectedAnswer === null ? null : isCorrect ? (
                        <Text
                          style={{
                            backgroundColor: "#F09796",
                            marginVertical: 10,
                            marginHorizontal: "auto",
                            textAlign: "center",
                            color: "white",
                            opacity: 0.75,
                            padding: 4,
                            borderRadius: 10,
                            paddingHorizontal: 13,
                          }}
                        >
                          Correct! Well done!
                        </Text>
                      ) : (
                        <Text
                          style={{
                            backgroundColor: "#8f8e8e",
                            marginVertical: 10,
                            marginHorizontal: "auto",
                            textAlign: "center",
                            color: "white",
                            opacity: 0.65,
                            padding: 4,
                            borderRadius: 10,
                            paddingHorizontal: 13,
                          }}
                        >
                          BOO! Wrong!
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <TouchableOpacity
                  onPress={goToNextQuestion}
                  disabled={!selectedAnswer}
                  style={[
                    {
                      backgroundColor: "#F08887",
                      paddingHorizontal: 125,
                      paddingVertical: 10,
                      borderRadius: 20,
                      marginBottom: 35,
                      marginTop: 10,
                    },
                    selectedAnswer == null && {
                      backgroundColor: "#f4cccc",
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        color: "white",
                      },
                      selectedAnswer == null && {
                        color: "#8f8e8e",
                      },
                    ]}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    router.replace("/love-exam");
                  }}
                  disabled={!selectedAnswer}
                  style={[
                    {
                      backgroundColor: "#F08887",
                      paddingHorizontal: 125,
                      paddingVertical: 10,
                      borderRadius: 20,
                      marginBottom: 35,
                      marginTop: 10,
                    },
                    selectedAnswer == null && {
                      backgroundColor: "#f4cccc",
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        color: "white",
                      },
                      selectedAnswer == null && {
                        color: "#8f8e8e",
                      },
                    ]}
                  >
                    Finish Exam
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  characterImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 8,
    marginLeft: 20,
    marginTop: -40,
    alignSelf: "center",
  },
  characterName: {
    fontSize: 14,
    fontWeight: 500,
    color: "white",
    fontFamily: "contentFont",
  },
  characterDetail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6b668b",
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  questionnaire: {
    display: "flex",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 17,
    marginHorizontal: 20,
    marginTop: 45,
  },
});
