import Image from "next/image";
import type { MascotState } from "@/types/lesson";

// Maps the semantic mascot states (lesson.ts) to actual art. Only "hai" and
// "ajak-belajar" have dedicated assets today; the rest fall back to the
// neutral mascot rather than blocking on new art — a drop-in swap once
// semangat/rayakan/tepuk-tangan illustrations exist.
const MASCOT_ASSET: Record<MascotState, string> = {
  hai: "/images/mascot-hello.svg",
  semangat: "/images/mascot.svg",
  "ajak-belajar": "/images/mascot-book.svg",
  rayakan: "/images/mascot.svg",
  "tepuk-tangan": "/images/mascot.svg",
};

interface MascotProps {
  state?: MascotState;
  size?: number;
}

export function Mascot({ state = "hai", size = 96 }: MascotProps) {
  return (
    <Image
      src={MASCOT_ASSET[state]}
      alt=""
      width={size}
      height={size}
      className="animate-mascot-bob"
    />
  );
}
