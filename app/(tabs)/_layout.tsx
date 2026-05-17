import { tabs } from "@/constatnts/data";
import { colors, components } from "@/constatnts/theme";
import "@/global.css";
import { useAuth } from "@clerk/expo";
import { clsx } from "clsx";
import { router, Tabs, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets()

  const navigationState = useRootNavigationState();

  const { tabBar } = components

  const TabIcon = ({ focused, icon }: { focused: boolean, icon: ImageSourcePropType }) => (
    <View className="size-12 items-center justify-center">
      <View className={clsx("size-12 items-center justify-center rounded-full", focused ? "bg-accent" : "bg-transparent")}>
        <Image source={icon} resizeMode="contain" className="size-7" />
      </View>
    </View>
  )

  useEffect(() => {
    if (!navigationState?.key) return; 
    if (isLoaded && !isSignedIn) {
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn, navigationState?.key]);


  const showBlocking = !isLoaded || (isLoaded && !isSignedIn);

  return (
    <View className="flex-1 bg-background">
      <Tabs screenOptions={{
        headerShown: false, tabBarLabelVisibilityMode: 'unlabeled', tabBarStyle: {
      position: 'absolute',
      backgroundColor: colors.primary,
      bottom: Math.max(insets.bottom, tabBar.horizontalInset),
      borderRadius: tabBar.radius,
      marginHorizontal: tabBar.horizontalInset,
      borderTopWidth: 0,
      elevation: 0


    },
    tabBarItemStyle: {
      paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.8
    },
    tabBarIconStyle: {
      width: tabBar.iconFrame,
      height: tabBar.iconFrame,
      alignItems: 'center'
    }
      }}  >

    {tabs.map((item) => (
      <Tabs.Screen key={item.name} name={item.name} options={{
        title: item.title, tabBarIcon: (({ focused }) => (
          <TabIcon focused={focused} icon={item.icon} />
        ))
      }}

      />

    ))}
      </Tabs>
      {showBlocking && (
        <View className="absolute inset-0 items-center justify-center bg-background">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}
