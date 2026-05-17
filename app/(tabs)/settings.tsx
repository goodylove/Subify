import { useClerk, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="font-sans-medium text-sm text-primary/60">{label}</Text>
      <Text className="font-sans-semibold text-sm text-primary" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function Settings() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;
  const fullName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
  const username = user?.username || "—";
  const userId = user?.id || "—";

  const initials =
    ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")).toUpperCase() ||
    (email?.[0]?.toUpperCase() ?? "");

  const joinedAt = user?.createdAt ? dayjs(user.createdAt).format("MMM D, YYYY") : "—";
  const lastSignInAt = user?.lastSignInAt ? dayjs(user.lastSignInAt).format("MMM D, YYYY") : "—";

  const passwordEnabled = user?.passwordEnabled ? "Enabled" : "Not enabled";
  const twoFactorEnabled = user?.twoFactorEnabled ? "Enabled" : "Not enabled";
  const totpEnabled = user?.totpEnabled ? "Enabled" : "Not enabled";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-5 pb-28">
        <View className="flex-row items-center gap-4">
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} className="size-16 rounded-full bg-muted" />
          ) : (
            <View className="size-16 rounded-full bg-muted items-center justify-center">
              <Text className="font-sans-bold text-xl text-primary">{initials}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="font-sans-extrabold text-2xl text-primary">Settings</Text>
            <Text className="mt-1 font-sans-medium text-base text-primary/60" numberOfLines={1}>
              {fullName !== "—" ? fullName : email || "—"}
            </Text>
          </View>
        </View>

        <View className="mt-8 rounded-3xl border border-primary/10 bg-card p-5">
          <Text className="font-sans-bold text-base text-primary">Profile</Text>
          <View className="mt-2 border-t border-primary/10">
            <InfoRow label="Full name" value={fullName} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Email" value={email || "—"} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Username" value={username} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Account ID" value={userId} />
          </View>
        </View>

        <View className="mt-5 rounded-3xl border border-primary/10 bg-card p-5">
          <Text className="font-sans-bold text-base text-primary">Activity</Text>
          <View className="mt-2 border-t border-primary/10">
            <InfoRow label="Date joined" value={joinedAt} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Last sign-in" value={lastSignInAt} />
          </View>
        </View>

        <View className="mt-5 rounded-3xl border border-primary/10 bg-card p-5">
          <Text className="font-sans-bold text-base text-primary">Security</Text>
          <View className="mt-2 border-t border-primary/10">
            <InfoRow label="Password" value={passwordEnabled} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Two-factor" value={twoFactorEnabled} />
            <View className="h-px bg-primary/10" />
            <InfoRow label="Authenticator (TOTP)" value={totpEnabled} />
          </View>
        </View>

        <View className="mt-5 rounded-3xl border border-primary/10 bg-card p-5">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => signOut()}
            className="rounded-2xl bg-primary py-4 items-center"
          >
            <Text className="font-sans-bold text-base text-background">Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
