import dayjs from "dayjs";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  if (!Number.isFinite(amount)) return "";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
    return `${symbol}${amount.toFixed(2)}`;
  }
}


export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};