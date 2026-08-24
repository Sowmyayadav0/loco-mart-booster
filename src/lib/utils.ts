import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { currency } from "@/utils/format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { currency };
