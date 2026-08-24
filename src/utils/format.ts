export const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const compactCurrency = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;

export const numberFmt = (value: number) => new Intl.NumberFormat("en-IN").format(value);

export const percent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const paginate = <T,>(items: T[], page: number, size: number) =>
  items.slice((page - 1) * size, page * size);
