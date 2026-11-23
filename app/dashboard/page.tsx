import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard Progres: Hongo Study v2",
  description: "Streak belajar, kartu yang dikuasai, grafik aktivitas, dan lencana pencapaianmu.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
