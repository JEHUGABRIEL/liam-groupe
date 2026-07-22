import Badge from "./Badge";


export default function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
  variant = "rose",
  align = "center",
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} mb-12`}>
      {eyebrow && (
        <div className="flex justify-center mb-5">
          <Badge icon={icon} variant={variant}>
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2 className="font-heading font-bold text-3xl md:text-4xl">{title}</h2>
      {description && (
        <p className="text-gray-500 mt-4 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
