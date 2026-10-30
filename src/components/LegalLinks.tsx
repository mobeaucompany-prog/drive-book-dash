import { Link } from "@tanstack/react-router";

export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Informations légales" className={className}>
      <Link to="/mentions-legales">Mentions légales</Link>
      <Link to="/confidentialite">Confidentialité & cookies</Link>
      <Link to="/cgu">CGU</Link>
      <Link to="/cgv">CGV</Link>
    </nav>
  );
}
