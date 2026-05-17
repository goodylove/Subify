import { useAuth } from "@clerk/expo";
import { router, Stack, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, navigationState?.key]);

  const showBlocking = !isLoaded || (isLoaded && isSignedIn);

  return (
    <View className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }} />
      {showBlocking && (
        <View className="absolute inset-0 items-center justify-center bg-background">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}
