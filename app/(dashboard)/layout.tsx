import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex   container mx-auto flex-col min-h-screen w-full bg-background max-h-screen">
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}
