import Link from "next/link";
import SafeImg from "@/components/ui/SafeImg";
import { formatDate } from "@/lib/format";

export default function NewsCard({ article }) {
  return (
    <article className="carte group flex h-full flex-col">
      <Link href={`/actualites/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-gris-clair">
          {article.image && (
            <SafeImg src={article.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          )}
          {article.tags?.[0] && <span className="badge absolute left-0 top-0 bg-accent text-white">{article.tags[0]}</span>}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="t-label-sm text-encre/50">{formatDate(article.publishedOn)}</p>
          <h3 className="t-h5 mt-3">{article.title}</h3>
          {article.excerpt && <p className="texte mt-3 line-clamp-3 text-[0.95rem]">{article.excerpt}</p>}
          <span className="t-label-sm mt-auto pt-6 text-accent">Lire l&apos;article →</span>
        </div>
      </Link>
    </article>
  );
}
