const stats = [
  { value: "$2.4M+", label: "Paid to Models" },
  { value: "1,200+", label: "Active Models" },
  { value: "350+", label: "Recruiters" },
  { value: "99.9%", label: "Uptime" },
];

export function Stats() {
  return (
    <section id="stats" className="relative z-10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="glass glass-highlight glass-float rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mb-1 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
