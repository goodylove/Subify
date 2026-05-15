

import { styled } from "nativewind";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constatnts/data";
import { icons } from "@/constatnts/icons";
import { formatCurrency } from "@/lib/formatCurrency";

import ListHeader from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import dayjs from "dayjs";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1  p-5 bg-background">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <Image source={{ uri: "https://d3ixftfdfbmo81.cloudfront.net/gopaddi-media/backend/gopaddi/frontend/assets/w0a788m5Uf6OnLY1mbg8Ql56RCoLFG6wCqlE8k9R.jpg" }} className="h-17.5 w-17.5 rounded-full" alt="profile-image" />

          <Text className="font-sans-bold text-xl leading-[20px]">{HOME_USER.name}</Text>

        </View>

        <TouchableOpacity className="h-11 w-11 rounded-full border border-primary/10 items-center justify-center">
          <Image source={icons.plus} className="size-6" alt="profile-image" />
        </TouchableOpacity>

      </View>

      <View className="bg-accent h-46  rounded-bl-4xl  rounded-tr-4xl mt-6 px-5  py-6 flex-col justify-between">

        <Text className="font-sans-medium text-xl text-background">Balance</Text>

        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-3xl text-white ">{formatCurrency(HOME_BALANCE.amount, "USD")}</Text>
          <Text className="text-background text-xl font-sans-medium">{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
        </View>

      </View>

      <ListHeader title="Upcoming" />


      <View>
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard {...item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
          contentContainerStyle={{ flexDirection: 'row', gap: 10 }}
        />

      </View>
      <ListHeader title="Subscriptions" />



    </SafeAreaView>
  );
}
