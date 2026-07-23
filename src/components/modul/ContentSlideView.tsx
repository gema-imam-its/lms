import type { ContentSlide } from "@/types/lesson";
import ModulImage from "./ModulImage";
import { Mascot } from "./Mascot";

interface ContentSlideViewProps {
  slide: ContentSlide;
}

export function ContentSlideView({ slide }: ContentSlideViewProps) {
  const paragraphs = Array.isArray(slide.text) ? slide.text : [slide.text];

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="relative h-48 w-48 shrink-0 sm:h-56 sm:w-56">
        <ModulImage
          src={slide.image}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <Mascot state={slide.mascot} size={64} />

      <div className="font-gilroy text-lg text-gema-navy">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
