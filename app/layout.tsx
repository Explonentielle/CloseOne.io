import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
 
export const metadata: Metadata = {
  title: "CloseOne.io — Growth Smarter.",
  description: "SaaS de productivité pour closers & équipes commerciales",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#0D1117] text-white antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#1A1F24",
              border: "1px solid #2A2F35",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
    </ClerkProvider>
  );
}