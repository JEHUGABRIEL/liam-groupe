-- ============================================================
-- MIGRATION LIAM Groupe — Appliquer le schéma complet
-- Utilisation : Copier-coller dans Supabase Dashboard > SQL Editor
-- Sûr à exécuter plusieurs fois (IF NOT EXISTS partout)
-- ============================================================

-- ==========================================
-- 1. CRÉATION DES TABLES (si absentes)
-- ==========================================

CREATE TABLE IF NOT EXISTS domains (
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

CREATE TABLE IF NOT EXISTS events (
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

CREATE TABLE IF NOT EXISTS news (
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

CREATE TABLE IF NOT EXISTS team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  image TEXT,
  social JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
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

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS menu_items (
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

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT,
  event_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
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

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. AJOUT DES COLONNES MANQUANTES (pour les tables qui existent sans ces colonnes)
-- ==========================================

-- events
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'a_venir';
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- news
ALTER TABLE news ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE news ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE news ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- domains
ALTER TABLE domains ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE domains ADD COLUMN IF NOT EXISTS objectives JSONB DEFAULT '[]';
ALTER TABLE domains ADD COLUMN IF NOT EXISTS programs JSONB DEFAULT '[]';
ALTER TABLE domains ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- team
ALTER TABLE team ADD COLUMN IF NOT EXISTS social JSONB DEFAULT '{}';
ALTER TABLE team ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- partners
ALTER TABLE partners ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS initial TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS collaboration TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- testimonials
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- products
ALTER TABLE products ADD COLUMN IF NOT EXISTS domain TEXT NOT NULL DEFAULT 'liam-groupe';
ALTER TABLE products ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS domain_slug TEXT NOT NULL DEFAULT 'ogab';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- ==========================================
-- 3. INDEX
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_domain_slug ON menu_items(domain_slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_registrations_event_slug ON registrations(event_slug);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ==========================================
-- 4. ROW LEVEL SECURITY
-- ==========================================

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

-- ==========================================
-- 5. POLITIQUES RLS
-- ==========================================

DO $$ BEGIN
  -- Lecture publique
  CREATE POLICY "Lecture publique" ON domains FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON events FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON news FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON team FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON partners FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON testimonials FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON products FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON menu_items FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON registrations FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON messages FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture publique" ON site_settings FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Lecture authentifiée" ON admin_profiles FOR SELECT USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Écriture authentifiée
DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON domains FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON domains FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON domains FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON events FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON events FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON news FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON news FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON team FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON team FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON partners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON partners FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON partners FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON products FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON products FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON menu_items FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON menu_items FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Écriture authentifiée" ON admin_profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON admin_profiles FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON admin_profiles FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Insertion publique (formulaires)
DO $$ BEGIN
  CREATE POLICY "Insertion publique" ON messages FOR INSERT WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON messages FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Insertion publique" ON registrations FOR INSERT WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Modification authentifiée" ON registrations FOR UPDATE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE POLICY "Suppression authentifiée" ON registrations FOR DELETE USING (auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN null;
END $$;
