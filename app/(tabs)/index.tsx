import { styled } from "nativewind";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constatnts/data";
import { icons } from "@/constatnts/icons";
import { formatCurrency } from "@/lib/helper";

import ListHeader from "@/components/ListHeading";

import Subscription from "@/components/Subscription";
import UpcomingSubCard from "@/components/UpcomingSubCard";
import dayjs from "dayjs";
import { useState } from "react";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1  p-5 bg-background">


      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-4">
                <Image
                  source={{
                    uri: "https://d3ixftfdfbmo81.cloudfront.net/gopaddi-media/backend/gopaddi/frontend/assets/w0a788m5Uf6OnLY1mbg8Ql56RCoLFG6wCqlE8k9R.jpg",
                  }}
                  className="h-17.5 w-17.5 rounded-full"
                  alt="profile-image"
                />

                <Text className="font-sans-bold text-xl leading-[20px]">
                  {HOME_USER.name}
                </Text>
              </View>

              <TouchableOpacity className="h-11 w-11 rounded-full border border-primary/10 items-center justify-center">
                <Image source={icons.plus} className="size-6" alt="profile-image" />
              </TouchableOpacity>
            </View>

            <View className="bg-accent h-46  rounded-bl-4xl  rounded-tr-4xl mt-6 px-5  py-6 flex-col justify-between">
              <Text className="font-sans-medium text-xl text-background">
                Balance
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="font-sans-bold text-3xl text-white ">
                  {formatCurrency(HOME_BALANCE.amount, "USD")}
                </Text>
                <Text className="text-background text-xl font-sans-medium">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <ListHeader title="Upcoming" />

            <View>
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UpcomingSubCard {...item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                className=""
                // extraData={}
                contentContainerStyle={{ flexDirection: "row", gap: 10 }}
                ListEmptyComponent={<Text>No Upcoming Subscriptions</Text>}
              />
            </View>
            <ListHeader title="Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { id, ...subscriptionItems } = item;
          return (
            <Subscription
              {...subscriptionItems}
              onPress={() =>
                setSubscriptionId((currentId) =>
                  currentId === item?.id ? null : item?.id,
                )
              }
              expanded={subscriptionId === item?.id}
            />
          );
        }}
        extraData={setSubscriptionId}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={<Text> No subscription data available</Text>}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
