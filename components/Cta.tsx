import { WHATSAPP_URL, CTA_LABEL } from "@/lib/site";

type Props = {
  label?: string;
  size?: "md" | "lg";
  variant?: "primary" | "ghost";
  className?: string;
};

export function Cta({
  label = CTA_LABEL,
  size = "lg",
  variant = "primary",
  className = "",
}: Props) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant} ${size === "lg" ? "btn--lg" : ""} ${className}`}
    >
      {label} <span className="arrow">↗</span>
    </a>
  );
}
