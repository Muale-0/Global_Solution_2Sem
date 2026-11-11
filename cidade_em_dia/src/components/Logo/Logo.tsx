type LogoProps = {
  className?: string;
};

// Logo desenhado em SVG: um marcador de mapa com um "feito" dentro.
// aria-hidden porque o nome do site já aparece escrito ao lado.
export default function Logo({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#1f47b0" />
      <path
        d="M24 9c-6.6 0-12 5.2-12 11.7 0 8.2 10 17.2 11.2 18.3.5.4 1.1.4 1.6 0C26 37.9 36 28.9 36 20.7 36 14.2 30.6 9 24 9z"
        fill="#ffffff"
      />
      <path
        d="M18.5 20.8l4 4 7-7.5"
        fill="none"
        stroke="#f0ad00"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
