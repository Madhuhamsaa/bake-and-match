import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
