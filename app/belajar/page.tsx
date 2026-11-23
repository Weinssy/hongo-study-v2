import type { Metadata } from "next";
import BelajarClient from "./BelajarClient";

export const metadata: Metadata = {
  title: "Sesi Belajar: Hongo Study v2",
  description: "Ulangi kartu yang jatuh tempo dan nilai ingatanmu. Jadwal dihitung dengan SM-2.",
};

export default function BelajarPage() {
  return <BelajarClient />;
}
