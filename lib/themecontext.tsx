"use client";
import { AppConfig } from "@/config/config";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const colorPalettes: Record<string, Record<string, string>> = {
  cyan: {
    DEFAULT: "#06b6d4",
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#041c22", // darker than 083344
  },
  pink: {
    DEFAULT: "#ec4899",
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#300012",
  },
  indigo: {
    DEFAULT: "#6366f1",
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#130c41",
  },
  green: {
    DEFAULT: "#22c55e",
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#0b2917",
  },
  amber: {
    DEFAULT: "#f59e0b",
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#2f1800",
  },
  red: {
    DEFAULT: "#ef4444",
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#2b0606",
  },
  violet: {
    DEFAULT: "#8b5cf6",
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#220448",
  },
  blue: {
    DEFAULT: "#3b82f6",
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#0c1c3a",
  },
  yellow: {
    DEFAULT: "#eab308",
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },

  purple: {
    DEFAULT: "#8b5cf6",
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#1a0633",
  },
  teal: {
    DEFAULT: "#14b8a6",
    50: "#e0fdfa",
    100: "#b2f7f5",
    200: "#81e6d9",
    300: "#4fd1c5",
    400: "#26c6b7",
    500: "#14b8a6",
    600: "#0e9f94",
    700: "#0b7f7a",
    800: "#085e60",
    900: "#064d4f",
    950: "#021a1a",
  },
  lime: {
    DEFAULT: "#84cc16",
    50: "#f7fee7",
    100: "#ecfdd5",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4b8e06",
    800: "#3b7200",
    900: "#2f6200",
    950: "#192f00",
  },
  orange: {
    DEFAULT: "#fd8d3c",
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#ffd0a1",
    300: "#ffb374",
    400: "#fd8d3c",
    500: "#fb7f16",
    600: "#f65e00",
    700: "#e34b00",
    800: "#d53a00",
    900: "#bf2900",
    950: "#3a0b00",
  },
  slate: {
    DEFAULT: "#64748b",
    50: "#f1f5f9",
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a",
    900: "#020617",
    950: "#010203",
  },
  stone: {
    DEFAULT: "#9e9c8f",
    50: "#f5f5f4",
    100: "#e7e6e2",
    200: "#d0cec4",
    300: "#b9b7a7",
    400: "#a39e88",
    500: "#9e9c8f",
    600: "#7e7c70",
    700: "#5f5d51",
    800: "#444239",
    900: "#2e2c29",
    950: "#1a1916",
  },
  fuchsia: {
    DEFAULT: "#d946ef",
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#e0aaff",
    300: "#d36df7",
    400: "#d946ef",
    500: "#c026d3",
    600: "#a21caf",
    700: "#861aa1",
    800: "#6e1c8c",
    900: "#581c6f",
    950: "#300738",
  },
};

type ThemeContextType = {
  currentColor: string;
  setColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentColor, setCurrentColor] = useState<string>("pink");

  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor") || "pink";
    if (AppConfig.customtheme == true) {
      setCurrentColor(AppConfig.customprimary);

      updateCSSVariables(AppConfig.customprimary);
    } else {
      setCurrentColor(savedColor);

      updateCSSVariables(savedColor);
    }
  }, []);

  const updateCSSVariables = (color: string) => {
    const root = document.documentElement;
    const colors = colorPalettes[color];
    if (!colors) return;
    Object.keys(colors).forEach((shade) => {
      root.style.setProperty(`--color-primary-${shade}`, colors[shade]);
    });
  };

  const setColor = (color: string) => {
    setCurrentColor(color);

    localStorage.setItem("selectedColor", color);
    updateCSSVariables(color);
  };

  return <ThemeContext.Provider value={{ currentColor, setColor }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
