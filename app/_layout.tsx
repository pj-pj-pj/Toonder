import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="profile-setup"
        options={{ title: "Profile Setup", headerShown: false }}
      />
      <Stack.Screen
        name="character-selection"
        options={{ title: "Choose a Character", headerShown: false }}
      />
      <Stack.Screen
        name="chat-screen"
        options={{ title: "Chat", headerShown: false }}
      />
      <Stack.Screen
        name="play-cards"
        options={{ title: "Play Cards", headerShown: false }}
      />
      <Stack.Screen
        name="love-exam"
        options={{ title: "Love Exam", headerShown: false }}
      />
      <Stack.Screen
        name="exam-screen"
        options={{ title: "Love Exam", headerShown: false }}
      />
    </Stack>
  );
}
