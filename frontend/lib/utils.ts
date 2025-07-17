import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost"
    : process.env.URL;
}

export const myLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // If the URL already includes a "?", use "&" to append additional parameters; otherwise use "?"
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}w=${width}&q=${quality || 75}`;
};

