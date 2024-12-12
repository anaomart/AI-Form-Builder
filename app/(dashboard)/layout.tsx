import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex   container mx-auto flex-col min-h-screen w-full bg-background max-h-screen">
      <nav className="flex items-center justify-between border-b border-border h-[60px] px-4 py-2">
        <Logo />
     <div className="flex gap-4 items-center">
     <ThemeSwitcher />
     <UserButton />
     </div>
      </nav>

      <main className="flex w-full flex-grow">{children}
        
      </main>
    </div>
  );
}
