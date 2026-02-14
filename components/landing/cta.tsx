import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Join?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Whether you are a model or a recruiter — start growing your income today.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          Get Started Now
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
