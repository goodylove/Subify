import { Image, Text, View } from "react-native";


export default function SubscriptionCard({ name, price, currency, daysLeft, icon }: UpcomingSubscriptionCardProps) {
    return (
        <View className="rounded-xl border border-primary/50 h-32 min-w-0 p-4">

            <View className="flex  gap-3">
                <View className=" flex-row items-center gap-3">
                    <View className="bg-muted  rounded-sm  flex items-center justify-center p-4  h-13 w-13">
                        <Image source={icon} className="size-9" />
                    </View>
                    <View>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm font-medium text-primary">
                            {currency == "USD" ? "$" : currency}{price}
                        </Text>

                        <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm font-light   text-primary/50">
                            {daysLeft < 1 ? "Today" : `${daysLeft} days left`}
                        </Text>
                    </View>
                </View>
                <View className="">
                    <Text numberOfLines={1} className="">
                        {name}
                    </Text>
                    {/* <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                        {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
                    </Text> */}
                </View>
            </View>

        </View>)
}
