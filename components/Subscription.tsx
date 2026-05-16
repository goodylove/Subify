import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from "@/lib/helper";
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

//  id: "github-pro",
//         icon: icons.github,
//         name: "GitHub Pro",
//         plan: "Developer",
//         category: "Developer Tools",
//         paymentMethod: "Mastercard ending in 2408",
//         status: "active",
//         startDate: "2024-11-24T10:00:00.000Z",
//         price: 9.99,
//         currency: "USD",r
//         billing: "Monthly",
//         renewalDate: "2026-03-24T10:00:00.000Z",
//         color: "#e8def8",
const Subscription = ({
    icon,
    name,
    plan,
    category,
    price,
    currency,
    billing,
    renewalDate,
    color,
    paymentMethod,
    onPress,
    expanded,
    startDate,
    status,
}: SubscriptionCardProps) => {
    return (
        <Pressable
            onPress={onPress}
            className={clsx("border border-primary/10 rounded-[10px] px-4 py-6", !color && "bg-card")}
            style={color ? { backgroundColor: color } : undefined}
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-4">
                    <View
                        className={`bg-background/50 w-15 h-15  flex items-center justify-center px-3 py-4 rounded-md `}
                    >
                        <Image
                            source={icon}
                            resizeMode="contain"
                            alt="subscription-card"
                            className="w-10 h-10"
                        />
                    </View>
                    <View className="">
                        <Text className="font-sans-bold text-xl tracking-normal  ">
                            {name}
                        </Text>
                        <Text className="font-sans-medium text-base text-primary/50">
                            {plan}
                        </Text>
                    </View>
                </View>

                <View className="flex-col justify-end items-end">
                    <Text className="font-sans-bold text-lg text-primary">
                        {formatCurrency(price)}
                    </Text>
                    <Text className="font-sans-medium text-sm   text-primary/50">
                        {billing}
                    </Text>
                </View>
            </View>
            {expanded && (
                <View className=" mt-4 flex-col gap-6">
                    <View className="flex-row items-center gap-3">
                        <Text className="text-primary/50">Payment:</Text>
                        <Text className="text-primary  font-sans-semibold">
                            {paymentMethod}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Text className="text-primary/50">Category:</Text>
                        <Text className="text-primary  font-sans-semibold">{category?.trim() || plan?.trim() || "Not Provided"}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Text className="text-primary/50">Started:</Text>
                        <Text className="text-primary  font-sans-semibold">
                            {formatSubscriptionDateTime(startDate)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Text className="text-primary/50">Renewal date:</Text>
                        <Text className="text-primary  font-sans-semibold">
                            {formatSubscriptionDateTime(renewalDate)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <Text className="text-primary/50">Status:</Text>
                        <Text className="text-primary  font-sans-semibold">{formatStatusLabel(status)}</Text>
                    </View>
                </View>
            )}
        </Pressable>
    );
};

export default Subscription;
