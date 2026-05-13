
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1  p-5 bg-background">
      
      
      <Text className="text-5xl font-sans-bold text-blue-500">
      Home
      </Text>
   
    </SafeAreaView>
  );
}
