import SafeImg from "@/components/ui/SafeImg";
import Slider from "@/components/ui/Slider";

/** Citations en carrousel (image, guillemet rouge, citation en DM Serif, auteur). */
export default function TestimonialSlider({ testimonials }) {
  return (
    <Slider label="Témoignage">
      {testimonials.map((t) => (
        <figure key={t.id}>
          {t.image && <SafeImg src={t.image} alt="" loading="lazy" className="mb-6 aspect-[4/3] w-full object-cover" />}
          <span aria-hidden="true" className="font-serif text-4xl leading-none text-accent">“</span>
          <blockquote className="mt-1 font-serif text-[1.45rem] leading-snug text-encre">« {t.quote} »</blockquote>
          <figcaption className="t-label-sm mt-5 text-encre/55">{t.name}{t.role ? ` — ${t.role}` : ""}</figcaption>
        </figure>
      ))}
    </Slider>
  );
}
