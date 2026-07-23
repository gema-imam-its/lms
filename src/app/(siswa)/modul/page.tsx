"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lessons } from "@/data/lessons/nama-gerakan-sholat";
import {
  lessonStorage,
  LOCAL_STUDENT_ID,
  type LessonResult,
} from "@/lib/lesson-storage";
import { useGender } from "@/context/GenderContext";

export default function ModulListPage() {
  const { gender, setGender } = useGender();
  const [progress, setProgress] = useState<Record<string, LessonResult>>({});

  useEffect(() => {
    let cancelled = false;
    lessonStorage.getAllResults(LOCAL_STUDENT_ID).then((results) => {
      if (!cancelled) setProgress(results);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-gohan text-2xl font-bold text-gema-navy">
          Modul Sholat
        </h1>

        <button
          type="button"
          onClick={() => setGender(gender === "male" ? "female" : "male")}
          className="min-h-12 rounded-full border-2 border-gema-navy/15 px-4 font-gilroy font-medium text-gema-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
        >
          {gender === "male" ? "Karakter: Laki-laki" : "Karakter: Perempuan"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {lessons.map((lesson) => {
          const result = progress[lesson.id];
          return (
            <Link
              key={lesson.id}
              href={`/modul/${lesson.id}`}
              className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border-2 border-gema-navy/10 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
            >
              <div>
                <p className="font-gohan text-lg text-gema-navy">
                  {lesson.title}
                </p>
                <p className="font-gilroy text-sm text-gema-navy/70">
                  {lesson.description}
                </p>
              </div>

              {result?.completed && (
                <div
                  className="flex shrink-0 gap-0.5 text-xl"
                  aria-label={`${result.stars} dari 3 bintang`}
                >
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={n <= result.stars ? "" : "opacity-20 grayscale"}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
