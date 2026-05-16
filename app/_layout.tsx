import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";



SplashScreen.preventAutoHideAsync()
export default function RootLayout() {

  const [isFontLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')

  })



  useEffect(() => {
    if (isFontLoaded) {
      SplashScreen.hideAsync()
    }

  }, [isFontLoaded])

  if (!isFontLoaded) {
    return null
  }

  return <>
    <Stack screenOptions={{ headerShown: false }} />
    <StatusBar />
  </>
}
