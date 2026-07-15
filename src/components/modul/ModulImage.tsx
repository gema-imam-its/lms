"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { useGender } from "@/context/GenderContext";

// Rewrites a flat module-image path to the currently selected gender variant:
//   /images/modul/gerakan-rukuk.png  ->  /images/modul/female/gerakan-rukuk.png
// The negative lookahead avoids double-prefixing an already-gendered path.
function toGenderedSrc(src: string, gender: string): string {
  return src.replace(
    /^\/images\/modul\/(?!male\/|female\/)/,
    `/images/modul/${gender}/`
  );
}

type ModulImageProps = Omit<ImageProps, "src"> & { src: string };

/**
 * Drop-in replacement for <Image> for the prayer-movement illustrations.
 * Shows the gender-specific art and, if that variant is missing, falls back
 * once to the flat original (which still exists and is also read by the rapor
 * pages) — so male/female art can be filled in folder-by-folder without ever
 * rendering a broken image.
 */
export default function ModulImage({ src, alt, ...rest }: ModulImageProps) {
  const { gender } = useGender();
  const genderedSrc = toGenderedSrc(src, gender);

  // Track only which gendered path failed; the shown src is derived from that,
  // so no effect is needed. When gender changes, genderedSrc changes and the
  // new variant is attempted automatically.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const displaySrc = failedSrc === genderedSrc ? src : genderedSrc;

  return (
    <Image
      {...rest}
      alt={alt}
      src={displaySrc}
      onError={() => setFailedSrc(genderedSrc)}
    />
  );
}
