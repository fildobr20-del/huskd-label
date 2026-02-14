import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative z-10 flex min-h-[80vh] items-center justify-center px-4 py-20">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Platform for Models & Recruiters
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Earn More.{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
            Recruit Smarter.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          {"Husk'd Label connects models with their recruitment network. Track earnings, manage recruits, and grow your income — all from one beautiful dashboard."}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 hover:shadow-primary/30"
          >
            Start Earning
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="glass glass-highlight glass-float inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition hover:bg-white/[0.06]"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
