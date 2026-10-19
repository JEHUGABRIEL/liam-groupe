import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/sections/Gallery";
import SafeImg from "@/components/ui/SafeImg";
import { getPublic } from "@/lib/api";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getPublic(`/api/news/${slug}`);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getPublic(`/api/news/${slug}`);
  if (!article) notFound();
  const paragraphs = (article.content || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <article>
        <header className="bloc-heros">
          <Link href="/actualites" className="souligne-lien t-label-sm inline-flex items-center gap-2 self-start text-encre/60">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />Actualités
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {article.tags?.map((tag) => <span key={tag} className="badge bg-accent text-white">{tag}</span>)}
            <span className="t-label-sm text-encre/50">{formatDate(article.publishedOn)}</span>
          </div>
          <h1 className="titre-heros mt-5 max-w-4xl">{article.title}</h1>
          {article.author && <p className="sur-titre mt-5">Par {article.author}</p>}
        </header>
        {article.image && (
          <div className="relative h-[280px] overflow-hidden md:h-[460px]">
            <SafeImg src={article.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}
        <div className="conteneur py-14 md:py-20">
          <div className="mx-auto max-w-[720px]">
            {article.excerpt && <p className="font-serif text-[1.45rem] leading-snug">{article.excerpt}</p>}
            <div className="mt-10 space-y-6 text-[1.05rem] leading-[1.75] text-encre/85">
              {paragraphs.map((p, index) => <p key={index}>{p}</p>)}
            </div>
          </div>
        </div>
      </article>
      <Gallery images={article.gallery} />
    </>
  );
}
