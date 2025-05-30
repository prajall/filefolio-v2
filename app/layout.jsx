import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Filefolio | Easiest way to share files online",
  keywords: [
    "file sharing",
    "online file sharing",
    "filefolio",
    "share files",
    "upload files",
    "file hosting",
    "cloud storage",
  ],
  description: "Filefolio is the simplest way to share files online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
