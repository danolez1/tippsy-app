"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import App from "@/layout";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Tippsy App",
  description: "Budgeting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head></head> */}
      {/* <meta /> */}
      <body className={inter.className}>
        <AntdRegistry>
          <App>{children}</App>
          <Toaster position="top-right" />
        </AntdRegistry>
      </body>
    </html>
  );
}
