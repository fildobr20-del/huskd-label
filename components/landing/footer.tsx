import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Flame className="h-4 w-4 text-primary" />
          {"Husk'd Label"}
        </div>
        <p>&copy; {new Date().getFullYear()} {"Husk'd Label"}. All rights reserved.</p>
        <p>support@huskdlabel.com</p>
      </div>
    </footer>
  );
}
