import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'
import { useTranslation } from 'react-i18next'
import { computeEventStatus } from '../lib/utils.js'
import {
  siteInfo as fallbackSiteInfoFr,
  navLinks as fallbackNavLinksFr,
  domains as fallbackDomainsFr,
  homeHeroImages as fallbackHomeHeroImages,
  events as fallbackEventsFr,
  news as fallbackNewsFr,
  team as fallbackTeamFr,
  partners as fallbackPartnersFr,
  testimonials as fallbackTestimonialsFr,
  footerLinks as fallbackFooterLinksFr,
  img,
} from '../data/siteData.js'
import {
  siteInfo as fallbackSiteInfoEn,
  navLinks as fallbackNavLinksEn,
  domains as fallbackDomainsEn,
  events as fallbackEventsEn,
  news as fallbackNewsEn,
  team as fallbackTeamEn,
  partners as fallbackPartnersEn,
  testimonials as fallbackTestimonialsEn,
  footerLinks as fallbackFooterLinksEn,
} from '../data/siteData.en.js'

const STALE_TIME = 5 * 60 * 1000

function useFallback(frData, enData) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  return { data: lang === 'en' ? enData : frData, lang }
}

async function fetchSetting(key, fallback) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return error ? fallback : data.value
}

async function fetchAll(table, fallback, _lang) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('order_index')
  if (error || !data || data.length === 0) return fallback
  return data
}

export function useSiteInfo() {
  const { data: fallback, lang } = useFallback(fallbackSiteInfoFr, fallbackSiteInfoEn)
  return useQuery({
    queryKey: ['siteInfo', lang],
    queryFn: async () => {
      const data = await fetchSetting('siteInfo', fallback)
      
      if (data) {
        
        return {
          ...fallback,
          ...data,
          address: fallback.address,
          phones: fallback.phones,
          emails: ['liamgroupe236@gmail.com'],
          contactPage: {
            ...(fallback.contactPage || {}),
            ...(data.contactPage || {}),
            address: (fallback.contactPage || fallback).address,
            phones: (fallback.contactPage || fallback).phones,
            emails: ['liamgroupe236@gmail.com'],
          },
        }
      }
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useNavLinks() {
  const { data: fallback, lang } = useFallback(fallbackNavLinksFr, fallbackNavLinksEn)
  return useQuery({
    queryKey: ['navLinks', lang],
    queryFn: async () => {
      const data = await fetchSetting('navLinks', fallback)
      const navs = Array.isArray(data) ? data : fallback

      // Quand la langue est anglais, superposer les labels du fallback anglais
      // car la DB ne stocke qu'un seul jeu d'étiquettes (français)
      let result = navs
      if (lang === 'en' && Array.isArray(fallback)) {
        const fallbackMap = new Map(fallback.map((link) => [link.to, link.label]))
        result = navs.map((link) => ({
          ...link,
          label: fallbackMap.get(link.to) || link.label,
        }))
      }

      const hasBoutique = result.some((l) => l.to === '/boutique')
      if (!hasBoutique) {
        const boutiqueLink = { label: lang === 'en' ? 'Shop' : 'Boutique', to: '/boutique' }
        return [...result.slice(0, 3), boutiqueLink, ...result.slice(3)]
      }
      return result
    },
    staleTime: STALE_TIME,
  })
}

export function useDomains() {
  const { data: fallback, lang } = useFallback(fallbackDomainsFr, fallbackDomainsEn)
  return useQuery({
    queryKey: ['domains', lang],
    queryFn: async () => {
      const data = await fetchAll('domains', fallback, lang)
      const domains = Array.isArray(data) ? data : fallback

      // Quand la langue est anglais, superposer les noms, catégories et
      // descriptions du fallback anglais car la DB ne stocke qu'un seul jeu (français)
      if (lang === 'en' && Array.isArray(fallback)) {
        const fallbackMap = new Map(fallback.map((d) => [d.slug, { name: d.name, category: d.category, shortDescription: d.shortDescription }]))
        return domains.map((d) => {
          const en = fallbackMap.get(d.slug)
          return en ? { ...d, name: en.name, category: en.category, shortDescription: en.shortDescription } : d
        })
      }

      return domains
    },
    staleTime: STALE_TIME,
  })
}

export function useDomain(slug) {
  const { data: fallback, lang } = useFallback(fallbackDomainsFr, fallbackDomainsEn)
  return useQuery({
    queryKey: ['domain', slug, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) return fallback.find((d) => d.slug === slug) || null

      const local = fallback.find((d) => d.slug === slug) || {}
      // Quand la langue est anglais, prioriser le fallback anglais pour
      // le nom, la catégorie et la description (cohérent avec useDomains())
      const useEn = lang === 'en'
      return {
        ...data,
        name: useEn ? local.name ?? data.name : data.name ?? local.name,
        category: useEn ? local.category ?? data.category : data.category ?? local.category,
        shortDescription: useEn
          ? local.shortDescription ?? data.short_description
          : data.short_description ?? local.shortDescription,
        heroImage: data.hero_image ?? local.heroImage,
        
        
        cardImage: local.cardImage,
        restaurantInfo: local.restaurantInfo,
        menu: local.menu,
        pricing: local.pricing,
        trainers: local.trainers,
        schedule: local.schedule,
      }
    },
    staleTime: STALE_TIME,
  })
}

export function useHomeHeroImages() {
  return useQuery({
    queryKey: ['homeHeroImages'],
    queryFn: () => fetchSetting('homeHeroImages', fallbackHomeHeroImages),
    staleTime: STALE_TIME,
  })
}

export function useEvents() {
  const { data: fallback, lang } = useFallback(fallbackEventsFr, fallbackEventsEn)
  return useQuery({
    queryKey: ['events', lang],
    queryFn: async () => {
      const data = await fetchAll('events', fallback, lang);
      if (!Array.isArray(data)) return data;
      
      return data.map((evt) => {
        const correctStatus = computeEventStatus(evt.date, evt.status, evt.end_date);
        if (correctStatus !== evt.status && evt.id) {
          
          supabase.from('events').update({ status: correctStatus }).eq('id', evt.id).then().catch((err) => console.error('useSiteData — Erreur mise à jour statut événement:', err));
        }
        return { ...evt, status: correctStatus };
      });
    },
    staleTime: STALE_TIME,
  })
}

export function useNews() {
  const { data: fallback, lang } = useFallback(fallbackNewsFr, fallbackNewsEn)
  return useQuery({
    queryKey: ['news', lang],
    queryFn: () => fetchAll('news', fallback, lang),
    staleTime: STALE_TIME,
  })
}

export function useTeam() {
  const { data: fallback, lang } = useFallback(fallbackTeamFr, fallbackTeamEn)
  return useQuery({
    queryKey: ['team', lang],
    queryFn: () => fetchAll('team', fallback, lang),
    staleTime: STALE_TIME,
  })
}

export function usePartners() {
  const { data: fallback, lang } = useFallback(fallbackPartnersFr, fallbackPartnersEn)
  return useQuery({
    queryKey: ['partners', lang],
    queryFn: () => fetchAll('partners', fallback, lang),
    staleTime: STALE_TIME,
  })
}

export function useTestimonials() {
  const { data: fallback, lang } = useFallback(fallbackTestimonialsFr, fallbackTestimonialsEn)
  return useQuery({
    queryKey: ['testimonials', lang],
    queryFn: () => fetchAll('testimonials', fallback, lang),
    staleTime: STALE_TIME,
  })
}

export function useFooterLinks() {
  const { data: fallback, lang } = useFallback(fallbackFooterLinksFr, fallbackFooterLinksEn)
  return useQuery({
    queryKey: ['footerLinks', lang],
    queryFn: async () => {
      const data = await fetchSetting('footerLinks', fallback)
      const links = data && typeof data === 'object' ? data : fallback

      // Quand la langue est anglais, superposer les labels du fallback anglais
      // pour chaque section du footer (liamGroupe, domaines, agir)
      if (lang === 'en' && fallback && typeof fallback === 'object') {
        const result = {}
        for (const section of ['liamGroupe', 'domaines', 'agir']) {
          const items = Array.isArray(links[section]) ? links[section] : []
          const fallbackItems = Array.isArray(fallback[section]) ? fallback[section] : []
          const fallbackMap = new Map(fallbackItems.map((item) => [item.to, item.label]))
          result[section] = items.map((item) => ({
            ...item,
            label: fallbackMap.get(item.to) || item.label,
          }))
        }
        return result
      }

      return links
    },
    staleTime: STALE_TIME,
  })
}

export { img }
