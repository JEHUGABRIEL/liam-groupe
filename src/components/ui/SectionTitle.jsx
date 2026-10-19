import Reveal from "./Reveal";

/** Étiquette mono + titre + chapeau, comme les sections de kode-rca. */
export default function SectionTitle({ label, title, description, inverse = false, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {label && <p className={`t-label ${inverse ? "text-white/60" : "text-encre/60"}`}>{label}</p>}
      <Reveal className="mt-4">
        <h2 className={`t-h2 ${inverse ? "text-white" : "text-encre"}`}>{title}</h2>
      </Reveal>
      {description && (
        <p className={`mt-5 max-w-2xl text-[1rem] leading-relaxed ${inverse ? "text-white/75" : "text-encre/75"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
