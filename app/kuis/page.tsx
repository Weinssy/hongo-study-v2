import type { Metadata } from "next";
import KuisClient from "./KuisClient";

export const metadata: Metadata = {
  title: "Kuis: Hongo Study v2",
  description: "Kuis pilihan ganda dan ketik romaji. Untuk pengguna terdaftar, soal diambil dari kartu terlemah.",
};

export default function KuisPage() {
  return <KuisClient />;
}
