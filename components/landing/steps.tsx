const steps = [
  {
    num: "01",
    title: "Sign Up",
    desc: "Create your account with a Magic Link — no passwords needed.",
  },
  {
    num: "02",
    title: "Choose Your Role",
    desc: "Join as a Model to track earnings, or as a Recruiter to build your network.",
  },
  {
    num: "03",
    title: "Start Earning",
    desc: "Models earn 70% of revenue. Recruiters earn 10% from their recruited models.",
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="relative z-10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground">Three simple steps to get started</p>
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="glass glass-highlight glass-float flex items-start gap-5 rounded-2xl p-6 transition-all hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {s.num}
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
