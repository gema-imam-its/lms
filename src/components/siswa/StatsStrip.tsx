interface StatsStripProps {
  moduleCount: number;
  quizCount: number;
}

export default function StatsStrip({ moduleCount, quizCount }: StatsStripProps) {
  const items = [
    { value: `${moduleCount}`, label: "Modul Pembelajaran" },
    { value: `${quizCount}`, label: "Kuis Interaktif" },
    { value: "AI", label: "Umpan Balik Real-time Gerakan Sholat" },
  ];

  return (
    <section className="max-w-5xl mx-auto px-8 lg:px-16 -mt-10 relative z-10">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {items.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center gap-1 px-6 py-6">
            <span className="font-gohan text-3xl md:text-4xl text-gema-tosca">{stat.value}</span>
            <span className="font-gilroy text-sm text-gema-navy/80">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
