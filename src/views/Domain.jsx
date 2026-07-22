"use client";
import { useParams, useRouter } from "next/navigation";
import { useLang, langPath } from "../lib/langPath";
import { useDomain, useEvents, useNews } from "../hooks/useSiteData";
import GenericDomain from "./domains/GenericDomain";
import RestaurantDomain from "./domains/RestaurantDomain";
import FitnessDomain from "./domains/FitnessDomain";

export default function Domain() {
  const { slug } = useParams();
  const lang = useLang();
  const router = useRouter();
  const { data: domain, isLoading } = useDomain(slug);
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();

  if (isLoading) {
    return (
      <div className="font-body">
        <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl h-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
            <div className="w-28 h-8 rounded-lg bg-gray-200 animate-shimmer" />
            <div className="hidden lg:flex items-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-3 rounded bg-gray-200 animate-shimmer" />
              ))}
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-200 animate-shimmer lg:hidden" />
          </div>
        </div>

        <div className="h-screen w-full bg-gradient-to-b from-ink-900 via-ink to-ink-800 flex items-center justify-center">
          <div className="text-center px-6 w-full max-w-3xl">
            <div className="mx-auto w-24 h-3 rounded-full bg-white/[0.12] animate-shimmer mb-6" />
            <div className="mx-auto w-72 sm:w-96 h-10 rounded-lg bg-white/[0.12] animate-shimmer mb-5" />
            <div className="mx-auto w-full max-w-lg h-4 rounded bg-white/[0.08] animate-shimmer mb-3" />
            <div className="mx-auto w-3/4 max-w-md h-4 rounded bg-white/[0.08] animate-shimmer" />
          </div>
        </div>

        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="mx-auto w-20 h-3 rounded-full bg-gray-200 animate-shimmer mb-4" />
              <div className="mx-auto w-56 h-7 rounded-lg bg-gray-200 animate-shimmer" />
            </div>
            <div className="relative h-[440px] md:h-[500px] rounded-2xl bg-gray-200 animate-shimmer" />
          </div>
        </div>

        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="mx-auto w-16 h-3 rounded-full bg-gray-200 animate-shimmer mb-4" />
              <div className="mx-auto w-44 h-7 rounded-lg bg-gray-200 animate-shimmer" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[380px] rounded-2xl bg-gray-200 animate-shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!domain) {
    router.replace(langPath(lang, "/domaines"));
    return null;
  }

  switch (domain.slug) {
    case "ogab":
      return <RestaurantDomain domain={domain} events={events} news={news} />;
    case "g-fitness":
      return <FitnessDomain domain={domain} events={events} news={news} />;
    default:
      return <GenericDomain domain={domain} events={events} news={news} />;
  }
}
