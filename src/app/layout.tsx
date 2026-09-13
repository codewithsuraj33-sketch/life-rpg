import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import NavigationProgress from "@/app/_components/ui/NavigationProgress";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06061a",
};

export const metadata: Metadata = {
  title: "Life RPG — Turn Your Real Life Tasks Into An Epic Adventure",
  description:
    "A full-stack gamified productivity web app. Turn daily habits, chores, and goals into RPG quests. Gain XP, level up your character, build streaks, unlock achievements, and climb the leaderboard.",
  keywords: ["Life RPG", "Gamification", "Habit Tracker", "Productivity RPG", "Level Up Life", "Quest Board"],
  authors: [{ name: "Life RPG Team" }],
  openGraph: {
    title: "Life RPG — Turn Your Real Life Tasks Into An Epic Adventure",
    description: "Gamify your real life. Complete quests, earn XP, level up character stats, and dominate the realm leaderboard.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${outfit.variable} font-sans h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
