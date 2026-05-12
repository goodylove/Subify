
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 justify-center p-5 bg-background">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/(auth)/sign-in" className=" mt-4 bg-primary rounded-smr p-2 text-white w-32 text-center text-xl">SignIn</Link>
      <Link href="/(auth)/sign-up" className=" mt-4 bg-primary rounded-smr p-2 text-white w-32 text-center text-xl">Signup</Link>
      <Link href="/onboarding-screen" className=" mt-4 bg-primary rounded-smr p-2 text-white w-32 text-center text-xl">Onboarding</Link>
    </SafeAreaView>
  );
}
