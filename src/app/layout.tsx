import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { getGlobalMetadata } from "@/utils/metadata";

const font = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...getGlobalMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>{children}</body>
    </html>
  );
}
