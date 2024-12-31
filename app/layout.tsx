import type { Metadata } from "next";
import { ClerkProvider, RedirectToSignIn, UserButton } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import DesignerContextProvider from "@/components/context/DesignerContext";
import NextTopLoader from "nextjs-toploader";
import AIContextProvider, { AIContext } from "@/components/context/AiContext";
export const metadata: Metadata = {
  title: "AI Form Builder",
  description: "AI Form Builder By Omar Ashraf",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <header>
            
          </header>
          <main>

            <NextTopLoader color="#e11d48"/>
            <AIContextProvider>
         <DesignerContextProvider>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
            <nav className="flex items-center justify-between border-b border-border h-[60px] px-4 py-2">
        <Logo />
     <div className="flex gap-4 items-center">
     <ThemeSwitcher />
     <UserButton />
     </div>
      </nav>
            {children}
            <Toaster/>

            </ThemeProvider>
         </DesignerContextProvider>
         </AIContextProvider>
            </main>
        </body>
      </html>
    </ClerkProvider>
  )
}