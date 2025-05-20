import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SellOnGeniezy - Start Your Selling Journey",
  description: "Create your account to start selling on Geniezy. Grow your business faster with our seller platform.",
  themeColor: "#6800cd"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
