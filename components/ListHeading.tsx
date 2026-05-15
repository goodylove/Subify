import { Text, TouchableOpacity, View } from "react-native";

export default function ListHeader({ title }: ListHeadingProps) {
    return (
        <View className="flex-row justify-between items-center mt-8 mb-4 ">
            <Text className="font-semibold text-primary text-xl tracking-normal">{title}</Text>


            <TouchableOpacity className=" rounded-3xl border border-primary px-3 py-1.5">
                <Text className="text-primary font-sans-medium">View all</Text>
            </TouchableOpacity>


        </View>
    )
}
