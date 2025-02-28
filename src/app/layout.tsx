"use client";  // 클라이언트 컴포넌트로 설정

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import localFont from "next/font/local";
import "./globals.css";

// Custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="w-full bg-bg-200 px-6 py-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        {/* Toggle button */}
        <div className="cursor-pointer" onClick={toggleSidebar}>
          <FaBars size={30} />
        </div>
        <a href="/test">test</a>

        {/* Logo */}
        <a href="/" className="text-white text-2xl font-bold">
          SWAMPtv
        </a>
      </div>

      {/* Searchbar */}
      <input
        type="text"
        placeholder="Search streamers or content"
        className="bg-accent-200 text-text-100 px-4 py-2 rounded w-1/2"
      />

      {/* Nav Links */}
      <div className="flex items-center">
        <button className="text-text-100 mr-4">🔔</button>
        <div className="w-10 h-10 rounded-full bg-primary-300"></div>
      </div>
    </header>
  );
};


// Sidebar component
const Sidebar = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <div
      className={`${
        isExpanded ? "w-60" : "w-12"
      } h-screen bg-bg-200 text-base-content transition-all duration-300 flex flex-col items-center p-4`}
    >

      <div>
        <h2 className="text-text-200 text-lg mb-2">LIVE CHANNELS</h2>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-primary-300 mr-2"></div>
          <div>
            <p className="text-text-100">GameMaster64</p>
            <p className="text-text-200 text-sm">Playing Cyberpunk ...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <html lang="kr">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-bg-200 antialiased flex flex-col`}>
        <Header toggleSidebar={toggleSidebar}/>
        <div className="flex">
          {/* <Sidebar isExpanded={isExpanded}/> */}
          <main className="flex-grow p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
