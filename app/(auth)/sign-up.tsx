import { useSignUp } from "@clerk/expo";
import { clsx } from "clsx";
import * as Linking from "expo-linking";
import { Link, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password: string) {
  return password.length >= 8;
}

function getClerkErrorMessage(error: unknown): string {
  const err = error as any;
  const errors = err?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((e: any) => e.longMessage || e.message)
      .filter(Boolean)
      .join("\n");
  }
  return err?.message || "Something went wrong. Please try again.";
}

export default function SignUp() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const signUpFlow = signUp;

  const [step, setStep] = React.useState<"form" | "verify">("form");

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    emailAddress?: string;
    password?: string;
    confirmPassword?: string;
    code?: string;
  }>({});

  const isBusy = isSubmitting || fetchStatus === "fetching";
  const canSubmitForm =
    isValidEmail(emailAddress) &&
    isValidPassword(password) &&
    password === confirmPassword &&
    !isBusy;

  const canSubmitCode = code.trim().length >= 4 && !isBusy;

  const startSignUp = async () => {
    if (!signUpFlow) return;

    const nextFieldErrors: typeof fieldErrors = {};
    if (!isValidEmail(emailAddress)) nextFieldErrors.emailAddress = "Enter a valid email address.";
    if (!isValidPassword(password)) nextFieldErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) nextFieldErrors.confirmPassword = "Passwords do not match.";

    setFieldErrors(nextFieldErrors);
    setServerError(null);

    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await signUpFlow.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setServerError(getClerkErrorMessage(error));
        return;
      }

      const { error: sendError } = await signUpFlow.verifications.sendEmailCode();
      if (sendError) {
        setServerError(getClerkErrorMessage(sendError));
        return;
      }

      setStep("verify");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!signUpFlow) return;

    const nextFieldErrors: typeof fieldErrors = {};
    if (!code.trim()) nextFieldErrors.code = "Enter the verification code.";

    setFieldErrors(nextFieldErrors);
    setServerError(null);

    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await signUpFlow.verifications.verifyEmailCode({ code: code.trim() });
      if (error) {
        setServerError(getClerkErrorMessage(error));
        return;
      }

      const { error: finalizeError } = await signUpFlow.finalize({
        navigate: async ({ session, decorateUrl }) => {
          const sessionTask = (session as any)?.currentTask;
          if (sessionTask) {
            setServerError("Additional verification is required on this account.");
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            await Linking.openURL(url);
          } else {
            router.replace(url as Href);
          }
        },
      });

      if (finalizeError) {
        setServerError(getClerkErrorMessage(finalizeError));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!signUpFlow) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      const { error } = await signUpFlow.verifications.sendEmailCode();
      if (error) setServerError(getClerkErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const startOver = async () => {
    const maybe = signUpFlow as any;
    await maybe?.reset?.();
    setCode("");
    setStep("form");
    setServerError(null);
    setFieldErrors({});
  };

  if (!signUpFlow) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow px-5 pt-10 pb-10"
        >
          <View className="items-center">
            <View className="flex-row items-center gap-3">
              <Image source={require("../../assets/icons/logo.png")} className="size-14" />
              <View>
                <Text className="font-sans-extrabold text-2xl text-primary">Subify</Text>
                <Text className="font-sans-medium text-primary/60 tracking-widest text-[11px]">
                  SMART BILLING
                </Text>
              </View>
            </View>
          </View>

          {step === "form" ? (
            <>
              <View className="mt-10 items-center">
                <Text className="font-sans-extrabold text-3xl text-primary">Create your account</Text>
                <Text className="mt-2 font-sans-medium text-base text-primary/60 text-center">
                  Start tracking subscriptions in minutes
                </Text>
              </View>

              <View className="mt-10 rounded-3xl border border-primary/10 bg-card p-5">
                <View className="gap-4">
                  <View>
                    <Text className="font-sans-semibold text-sm text-primary">Email</Text>
                    <View
                      className={clsx(
                        "mt-2 rounded-2xl border bg-background px-4 py-4",
                        fieldErrors.emailAddress ? "border-destructive/50" : "border-primary/10",
                      )}
                    >
                      <TextInput
                        value={emailAddress}
                        onChangeText={(text) => {
                          setEmailAddress(text);
                          if (fieldErrors.emailAddress) {
                            setFieldErrors((prev) => ({ ...prev, emailAddress: undefined }));
                          }
                          if (serverError) setServerError(null);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        className="font-sans-medium text-base text-primary"
                      />
                    </View>
                    {!!fieldErrors.emailAddress && (
                      <Text className="mt-2 font-sans-medium text-xs text-destructive">
                        {fieldErrors.emailAddress}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="font-sans-semibold text-sm text-primary">Password</Text>
                    <View
                      className={clsx(
                        "mt-2 flex-row items-center rounded-2xl border bg-background px-4 py-3",
                        fieldErrors.password ? "border-destructive/50" : "border-primary/10",
                      )}
                    >
                      <TextInput
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }
                          if (serverError) setServerError(null);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showPassword}
                        textContentType="newPassword"
                        placeholder="Create a password"
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        className="flex-1 font-sans-medium text-base text-primary py-1"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((v) => !v)}
                        className="px-2 py-2"
                      >
                        <Text className="font-sans-semibold text-sm text-primary/70">
                          {showPassword ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {!!fieldErrors.password && (
                      <Text className="mt-2 font-sans-medium text-xs text-destructive">
                        {fieldErrors.password}
                      </Text>
                    )}
                    <Text className="mt-2 font-sans-medium text-xs text-primary/50">
                      Use at least 8 characters.
                    </Text>
                  </View>

                  <View>
                    <Text className="font-sans-semibold text-sm text-primary">Confirm password</Text>
                    <View
                      className={clsx(
                        "mt-2 flex-row items-center rounded-2xl border bg-background px-4 py-3",
                        fieldErrors.confirmPassword ? "border-destructive/50" : "border-primary/10",
                      )}
                    >
                      <TextInput
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (fieldErrors.confirmPassword) {
                            setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }
                          if (serverError) setServerError(null);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showConfirmPassword}
                        textContentType="newPassword"
                        placeholder="Confirm your password"
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        className="flex-1 font-sans-medium text-base text-primary py-1"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((v) => !v)}
                        className="px-2 py-2"
                      >
                        <Text className="font-sans-semibold text-sm text-primary/70">
                          {showConfirmPassword ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {!!fieldErrors.confirmPassword && (
                      <Text className="mt-2 font-sans-medium text-xs text-destructive">
                        {fieldErrors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  {!!serverError && (
                    <View className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                      <Text className="font-sans-medium text-sm text-destructive">{serverError}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={startSignUp}
                    disabled={!canSubmitForm}
                    className={clsx(
                      "mt-2 rounded-2xl bg-accent py-4 items-center",
                      !canSubmitForm && "opacity-50",
                    )}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-sans-bold text-base text-white">Continue</Text>
                    )}
                  </TouchableOpacity>

                  <View className="mt-3 flex-row items-center justify-center gap-1">
                    <Text className="font-sans-medium text-sm text-primary/70">
                      Already have an account?
                    </Text>
                    <Link href="/(auth)/sign-in" asChild>
                      <TouchableOpacity>
                        <Text className="font-sans-bold text-sm text-accent">Sign in</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="mt-10 items-center">
                <Text className="font-sans-extrabold text-3xl text-primary">Verify your email</Text>
                <Text className="mt-2 font-sans-medium text-base text-primary/60 text-center">
                  Enter the code we sent to {emailAddress.trim()}
                </Text>
              </View>

              <View className="mt-10 rounded-3xl border border-primary/10 bg-card p-5">
                <View className="gap-4">
                  <View>
                    <Text className="font-sans-semibold text-sm text-primary">Verification code</Text>
                    <View
                      className={clsx(
                        "mt-2 rounded-2xl border bg-background px-4 py-4",
                        fieldErrors.code ? "border-destructive/50" : "border-primary/10",
                      )}
                    >
                      <TextInput
                        value={code}
                        onChangeText={(text) => {
                          setCode(text);
                          if (fieldErrors.code) setFieldErrors((prev) => ({ ...prev, code: undefined }));
                          if (serverError) setServerError(null);
                        }}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        placeholder="Enter code"
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        className="font-sans-medium text-base text-primary tracking-widest"
                      />
                    </View>
                    {!!fieldErrors.code && (
                      <Text className="mt-2 font-sans-medium text-xs text-destructive">
                        {fieldErrors.code}
                      </Text>
                    )}
                  </View>

                  {!!serverError && (
                    <View className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                      <Text className="font-sans-medium text-sm text-destructive">{serverError}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={verifyEmailCode}
                    disabled={!canSubmitCode}
                    className={clsx(
                      "mt-2 rounded-2xl bg-accent py-4 items-center",
                      !canSubmitCode && "opacity-50",
                    )}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-sans-bold text-base text-white">Verify</Text>
                    )}
                  </TouchableOpacity>

                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={resendCode}
                      disabled={isSubmitting}
                      className={clsx("py-3", isSubmitting && "opacity-50")}
                    >
                      <Text className="font-sans-semibold text-sm text-primary/70">Resend code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={startOver}
                      disabled={isSubmitting}
                      className={clsx("py-3", isSubmitting && "opacity-50")}
                    >
                      <Text className="font-sans-semibold text-sm text-primary/70">Change email</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}

          <Text className="mt-6 text-center font-sans-medium text-xs text-primary/50">
            We’ll never share your email. Verification helps keep your account secure.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
