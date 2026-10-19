import Reveal from "@/components/ui/Reveal";
import SafeImg from "@/components/ui/SafeImg";
import SocialIcon, { SOCIAL_NETWORKS } from "@/components/ui/SocialIcon";

/** Initiales sur fond beige, quand la photo du coach manque ou ne charge pas. */
function Monogram({ name }) {
  const initials = name.replace(/^Coach\s+/i, "").split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
  return (
    <span className="flex h-full w-full items-center justify-center bg-gris-clair font-serif text-[4.5rem] text-brun/70">
      {initials}
    </span>
  );
}

/** Coachs : photo (ou monogramme), spécialité, réseaux. */
export default function Trainers({ trainers = [] }) {
  if (trainers.length === 0) return null;
  return (
    <section className="py-14 md:py-20 lg:py-24">
      <div className="conteneur">
        <div className="max-w-3xl">
          <p className="t-label text-encre/60">Nos coachs</p>
          <Reveal className="mt-4"><h2 className="t-h2">Des coachs certifiés à vos côtés.</h2></Reveal>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <li key={trainer.name} className="carte group flex flex-col border border-bordure bg-white">
              {/* Monogramme dessous : visible pendant le chargement et si la photo manque. */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <span className="absolute inset-0"><Monogram name={trainer.name} /></span>
                <SafeImg
                  src={trainer.image}
                  alt={trainer.name}
                  loading="lazy"
                  hideOnError
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                {trainer.specialty && <p className="t-label-sm text-accent">{trainer.specialty}</p>}
                <p className="t-h5 mt-3">{trainer.name}</p>
                <div className="mt-auto flex gap-2 pt-6">
                  {Object.entries(trainer.social || {})
                    .filter(([network, url]) => url && SOCIAL_NETWORKS.includes(network))
                    .map(([network, url]) => (
                      <a key={network} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${trainer.name} sur ${network}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-bordure transition-colors hover:border-accent hover:bg-accent hover:text-white">
                        <SocialIcon network={network} />
                      </a>
                    ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
