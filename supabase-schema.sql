-- Schema pour LIAM Groupe Supabase

-- Domaines d'intervention
CREATE TABLE domains (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  short_description TEXT,
  description TEXT,
  icon TEXT,
  hero_image TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  objectives JSONB DEFAULT '[]',
  programs JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Événements
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  end_date TEXT,
  location TEXT,
  image TEXT,
  gallery JSONB DEFAULT '[]',
  status TEXT DEFAULT 'a_venir',
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Actualités
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  gallery JSONB DEFAULT '[]',
  date TEXT,
  tags JSONB DEFAULT '[]',
  author TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Équipe
CREATE TABLE team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  image TEXT,
  social JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partenaires
CREATE TABLE partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  logo TEXT,
  initial TEXT,
  color TEXT,
  category TEXT,
  collaboration TEXT,
  website TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Témoignages
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Produits dérivés (boutique en ligne)
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image TEXT,
  category TEXT,
  domain TEXT NOT NULL DEFAULT 'liam-groupe',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Éléments de menu (restaurant O'GAB)
CREATE TABLE menu_items (
  id BIGSERIAL PRIMARY KEY,
  domain_slug TEXT NOT NULL DEFAULT 'ogab',
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paramètres du site (siteInfo, navLinks, footerLinks, stats, hero images)
-- Inscriptions aux événements
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT,
  event_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'en_attente', -- en_attente | confirme | annule
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registrations_event_slug ON registrations(event_slug);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages des formulaires de contact
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  page TEXT DEFAULT 'home',
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Index
CREATE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_menu_items_domain_slug ON menu_items(domain_slug);
CREATE INDEX idx_menu_items_category ON menu_items(category);

-- Profils administrateurs (liés aux utilisateurs Supabase Auth)
-- Chaque admin doit d'abord être créé dans Supabase Auth (Authentication > Users),
-- puis son profil est ajouté ici avec l'UUID correspondant.
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
-- Principe :
--   - SELECT : publique pour toutes les tables (lecture du site public)
--   - INSERT : publique pour messages et registrations (formulaires publics)
--   - INSERT / UPDATE / DELETE : authentifié uniquement pour toutes les autres tables (panneau admin)
--   - admin_profiles : SELECT restreint aux authentifiés

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- ==============================
-- POLITIQUES DE LECTURE PUBLIQUE
-- ==============================

CREATE POLICY "Lecture publique" ON domains FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON events FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON news FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON team FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON partners FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON products FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON registrations FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON messages FOR SELECT USING (true);
CREATE POLICY "Lecture publique" ON site_settings FOR SELECT USING (true);

-- admin_profiles : lecture restreinte aux admins authentifiés
CREATE POLICY "Lecture authentifiée" ON admin_profiles FOR SELECT USING (auth.role() = 'authenticated');

-- ==========================================
-- POLITIQUES D'ÉCRITURE : TABLES ADMINISTRÉES
-- ==========================================
-- Ces tables ne peuvent être modifiées que par un admin connecté

CREATE POLICY "Écriture authentifiée" ON domains FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON domains FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON domains FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON news FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON news FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON team FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON partners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON partners FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON partners FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON menu_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON menu_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Écriture authentifiée" ON admin_profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modification authentifiée" ON admin_profiles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON admin_profiles FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================
-- POLITIQUES D'ÉCRITURE : FORMULAIRES PUBLICS
-- =========================================
-- messages et registrations acceptent les INSERT anonymes (formulaires de contact / inscription)
-- mais les UPDATE/DELETE restent réservés aux admins

CREATE POLICY "Insertion publique" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification authentifiée" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON messages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertion publique" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification authentifiée" ON registrations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression authentifiée" ON registrations FOR DELETE USING (auth.role() = 'authenticated');
