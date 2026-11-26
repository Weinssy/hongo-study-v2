"use client";

import { useRouter } from "next/navigation";
import { SakugaButton } from "./SakugaControls";

export default function SakugaHomeCta({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();

  return (
    <div className="sakuga-cta-wrap">
      <SakugaButton
        variant={variant}
        onClick={() => {
          window.setTimeout(() => {
            router.push(href);
          }, 210);
        }}
      >
        {label}
      </SakugaButton>
    </div>
  );
}
