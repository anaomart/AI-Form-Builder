"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "next-themes";
import { Monitor, MoonIcon, SunIcon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <SunIcon className="w-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger value="light" onClick={() => setTheme("dark")}>
          <MoonIcon className=" rotate-90 transition-transform dark:rotate-0 w-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger value="light" onClick={() => setTheme("system")}>
          <Monitor className="w-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
