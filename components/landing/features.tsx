import { BarChart3, Shield, Users, Wallet, Globe, Zap } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Real-Time Earnings",
    desc: "Track your income across all platforms in one dashboard. Models keep 70% of all revenue.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: Users,
    title: "Recruitment Network",
    desc: "Recruiters earn 10% from every model they bring in. Grow your network, grow your income.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: BarChart3,
    title: "Analytics & Charts",
    desc: "Detailed breakdowns by platform, by day, by week. Know exactly where your money comes from.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Shield,
    title: "Secure Access",
    desc: "Magic Link login — no passwords to remember. Your data is encrypted and protected.",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    desc: "Aggregate earnings from Chaturbate, StripChat, BongaCams, MyFreeCams and more.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    desc: "Sign up, get your referral link, start earning. It's that simple.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground">
            Powerful tools for models and recruiters alike
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass glass-highlight glass-float group rounded-2xl p-6 transition-all hover:bg-white/[0.05]"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${f.bg} ${f.color}`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
