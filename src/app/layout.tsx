import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
