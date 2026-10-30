import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LegalLinks } from "@/components/LegalLinks";

export const MISSING = "[À compléter par l’exploitant]";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-12 space-y-5 leading-relaxed">
        <Link to="/" className="underline text-sm">← Retour à l’accueil</Link>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">Document d’information non validé juridiquement. Les mentions « {MISSING} » doivent être fournies par l’exploitant.</p>
        {children}
      </main>
      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        <LegalLinks className="flex flex-wrap justify-center gap-4" />
      </footer>
    </div>
  );
}
