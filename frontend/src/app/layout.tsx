import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyKrack 2.0",
  description: "Elite AI Study Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="antialiased bg-[#050505] min-h-screen text-white font-body">

        {children}
      </body>
    </html>
  );
}
