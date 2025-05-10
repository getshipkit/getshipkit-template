"use client";

import { useEffect, useState, useContext } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import { ThemeContext } from "@/app/providers";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering once mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    console.log("Current theme:", theme);
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Switching to:", newTheme);
    setTheme(newTheme);
    
    // Also update localStorage for persistence
    localStorage.setItem("theme", newTheme);
  };

  // If not mounted yet, render a placeholder with the same dimensions
  if (!mounted) {
    return (
      <div className="w-10 h-10"></div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="rounded-full"
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </Button>
  );
} 