import logoOnDark from "@/assets/pneus-du-bruch-logo.png";
import logoOnLight from "@/assets/pneus-du-bruch-logo-dark.png";

export function Brand({ variant = "on-dark" }: { variant?: "on-dark" | "on-light" }) {
  return (
    <span className="bruch-brand">
      <img
        src={variant === "on-dark" ? logoOnDark : logoOnLight}
        alt="Pneus du Bruch"
        className="bruch-logo"
        width={966}
        height={271}
      />
    </span>
  );
}
