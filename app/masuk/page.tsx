import type { Metadata } from "next";
import MasukForm from "./MasukForm";

export const metadata: Metadata = {
  title: "Masuk: Hongo Study v2",
  description: "Masuk atau daftar akun Hongo Study v2 untuk menyimpan progres belajar.",
};

export default function MasukPage() {
  return <MasukForm />;
}
