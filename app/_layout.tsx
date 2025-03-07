import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    titleFont: require("../assets/fonts/HennyPenny-Regular.ttf"),
    contentFont: require("../assets/fonts/SourGummy-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    console.log("fonts loaded");
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size="large"
          color="#F08887"
        />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="character-selection"
        options={{ title: "Choose a Character", headerShown: false }}
      />
      <Stack.Screen
        name="chat-screen"
        options={{ title: "Chat", headerShown: false }}
      />
    </Stack>
  );
}
