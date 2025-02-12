import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import type { Metadata } from "next";
import "./globals.css";
import { Nunito_Sans, Ubuntu, Noto_Sans, Baloo_2 } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-nunito-sans",
});
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ubuntu",
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-noto-sans",
});
const baloo2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-baloo-2",
});

export const viewport = {
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: "ReactivityTracker | Help your clients with dog reactivity",
  description:
    "Every behavior tells a story—use data-driven insights to improve training and enhance well-being",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.svg"></link>
      <body
        className={`${nunitoSans.variable} ${ubuntu.variable} ${notoSans.variable} ${baloo2.variable} font-sans`}
      >
        <NextUIProvider>
          <main className="flex-1">{children}</main>
        </NextUIProvider>
      </body>
    </html>
  );
}
