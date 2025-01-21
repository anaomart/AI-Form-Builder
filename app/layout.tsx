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
import ResetOnRouteChange from "@/lib/UrlChange";
import Head from "next/head";
import Script from "next/script";
export const metadata: Metadata = {
  title: "AI Form Builder",
  description: "AI Form Builder By Omar Ashraf",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
            <AIContextProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Head>
            <title>AI Form Builder</title> 
          </Head>
          <main>

            <NextTopLoader color="#e11d48"/>
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
            <ResetOnRouteChange />

            </ThemeProvider>
         </DesignerContextProvider>
            </main>

            <Script
              id="clarity-script"
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "pxehva6vi1");
                `,
              }}
            />
        </body>
      </html>
         </AIContextProvider>
    </ClerkProvider>
  )
}