/** Champ de formulaire avec étiquette et message d'erreur (erreurs de validation de l'API par champ). */
export default function Field({ label, name, error, hint, as = "input", className = "", children, ...props }) {
  const Tag = as;
  const id = props.id || `champ-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="etiquette">
        {label}
        {props.required && <span className="text-accent"> *</span>}
      </label>
      {children ?? (
        <Tag
          id={id}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-erreur` : undefined}
          className={`champ ${error ? "champ-erreur" : ""} ${as === "textarea" ? "min-h-[120px]" : ""}`}
          {...props}
        />
      )}
      {hint && !error && <p className="mt-1.5 text-[0.82rem] text-encre/55">{hint}</p>}
      {error && (
        <p id={`${id}-erreur`} className="mt-1.5 text-[0.82rem] text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
