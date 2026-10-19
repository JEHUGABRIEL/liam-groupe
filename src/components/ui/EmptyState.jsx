/** Bloc affiché quand une liste est vide. */
export default function EmptyState({ title, children }) {
  return (
    <div className="border border-dashed border-bordure px-6 py-12 text-center">
      <p className="t-h5">{title}</p>
      {children && <div className="texte mx-auto mt-3 max-w-md">{children}</div>}
    </div>
  );
}
