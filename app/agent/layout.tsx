// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../../app/globals.css";
// // import "";
// import { Sidebar } from "@/components/Sidebar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Krishi-Shetra AI",
//   description: "Voice-First Agricultural Intelligence",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-slate-100`}
//       >
//         <div className="flex min-h-screen">
//           {/* 1. Sidebar stays fixed on the left */}
//           <Sidebar />

//           {/* 2. Main Content pushed to the right */}
//           <main className="flex-1 ml-20 md:ml-64 p-6 md:p-8 relative">
//             {children}
//           </main>
//         </div>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishi-Shetra AI",
  description: "Voice-First Agricultural Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          bg-[#030712] text-slate-200 
          selection:bg-cyan-500/30 selection:text-cyan-100
          overflow-x-hidden min-h-screen
        `}
      >
        {/* ========================================
          GLOBAL AMBIENT BACKGROUND
          Fixed in place so it doesn't scroll, providing a deep, premium canvas.
          ======================================== */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#030712]">
          {/* Faint Global Cyber Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          {/* Deep Ambient Glows */}
          <div className="absolute top-[-10%] left-[20%] w-[1000px] h-[500px] bg-cyan-900/10 rounded-[100%] blur-[120px] opacity-50 mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-950/20 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
        </div>

        {/* ========================================
          APP LAYOUT SHELL
          ======================================== */}
        <div className="flex min-h-screen relative z-0">
          
          {/* 1. Sidebar stays fixed on the left */}
          <Sidebar />

          {/* 2. Main Content pushed to the right */}
          <main className="flex-1 ml-20 md:ml-64 relative flex flex-col min-h-screen transition-all duration-300 ease-in-out">
            
            {/* Subtle left-edge glow acting as a high-tech border next to the Sidebar */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-900/30 to-transparent pointer-events-none" />
            
            {/* Subtle top-edge glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-900/20 via-blue-900/10 to-transparent pointer-events-none" />

            {/* Content Wrapper */}
            <div className="p-6 md:p-8 flex-1 w-full max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
          
        </div>
      </body>
    </html>
  );
}