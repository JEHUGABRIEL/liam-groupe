-- =====================================================
-- SEED : Domaines (domains) mock → Supabase
-- Insère les 7 domaines définis dans src/data/siteData.js
-- =====================================================
-- Exécute dans Supabase Dashboard > SQL Editor
-- Peut être exécuté plusieurs fois (ON CONFLICT DO NOTHING)
-- =====================================================

INSERT INTO domains (slug, name, category, short_description, icon, hero_image, programs, gallery, order_index)
VALUES
  -- 1. G-Fitness
  (
    'g-fitness',
    'G-Fitness',
    'SPORT & FITNESS',
    'Une salle de fitness moderne au cœur de Bangui : cours collectifs, coaching personnalisé et musculation, ouverte à tous, avec des programmes dédiés aux femmes et aux jeunes. Espace complet, coachs certifiés…',
    'dumbbell',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/gfitness-hero',
    '[
      {"title": "Musculation & Cardio", "description": "Plateau équipé (haltères, machines guidées, tapis, vélos) en accès libre avec suivi par nos coachs."},
      {"title": "Cours collectifs", "description": "Zumba, step, renforcement musculaire et yoga, plusieurs séances par semaine pour tous les niveaux."},
      {"title": "Coaching personnalisé", "description": "Programmes individuels (perte de poids, prise de masse, remise en forme) avec suivi nutritionnel."},
      {"title": "Tournoi Féminin de Basketball", "description": "Compétition inter-quartiers rassemblant 16 équipes féminines à Bangui, portée par nos coachs."},
      {"title": "G-Fitness Junior", "description": "Programme d''initiation sportive pour les enfants et adolescents des quartiers défavorisés."},
      {"title": "Santé par le sport", "description": "Ateliers de sensibilisation à l''hygiène de vie et à la nutrition équilibrée."},
      {"title": "Randonnées du samedi", "description": "Marches en groupe à travers les collines de Bangui et environs. Accessible à tous les niveaux, une façon conviviale de découvrir la nature centrafricaine."}
    ]'::jsonb,
    '[
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/gfitness-gallery-1",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/gfitness-gallery-2",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/gfitness-gallery-3",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/gfitness-gallery-4"
    ]'::jsonb,
    0
  ),

  -- 2. O'GAB
  (
    'ogab',
    'O''GAB',
    'RESTAURANT & GASTRONOMIE',
    'Le restaurant solidaire de LIAM Groupe à Bangui : une cuisine centrafricaine authentique et généreuse, préparée par des femmes formées dans nos ateliers culinaires, dans un cadre chaleureux ouvert midi et soir.',
    'utensils',
    '/images/ogab/669011058_1446562997267831_5481903344405057979_n.jpg',
    '[
      {"title": "Restaurant solidaire", "description": "Salle ouverte tous les jours, cuisine centrafricaine et internationale accessible, préparée et servie par des femmes formées dans nos ateliers."},
      {"title": "Restauration événementielle", "description": "Service traiteur pour mariages, séminaires et réceptions, valorisant les produits locaux."},
      {"title": "Ateliers culinaires", "description": "Formation en cuisine traditionnelle et moderne pour les femmes entrepreneures."}
    ]'::jsonb,
    '[
      "/images/ogab/drinks/476872713_1176865404145324_5802838533451008756_n.jpg",
      "/images/ogab/menu/viandes/481063852_1187765299722001_5650020998460137576_n.jpg",
      "/images/ogab/menu/poissons/478327053_1176866517478546_315024763193329332_n.jpg",
      "/images/ogab/drinks/482138664_1192591909239340_9009025277274740992_n.jpg",
      "/images/ogab/menu/viandes/481114410_1191086432723221_2914556064497715437_n.jpg",
      "/images/ogab/menu/crevettes/481678689_1191077416057456_8939253051982806889_n.jpg",
      "/images/ogab/menu/viandes/481180074_1191086439389887_8362481496169952499_n.jpg"
    ]'::jsonb,
    1
  ),

  -- 3. Entrepreneuriat & Leadership
  (
    'entrepreneuriat',
    'Entrepreneuriat & Leadership',
    'LEADERSHIP FÉMININ',
    'Autonomiser les femmes centrafricaines par la formation au leadership, l''accompagnement entrepreneurial et la mise en réseau…',
    'briefcase',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/entreprenariat-hero',
    '[
      {"title": "Conférences « Oser Entreprendre »", "description": "Événements inspirants avec des femmes leaders du secteur privé et public."},
      {"title": "Programme d''incubation", "description": "Accompagnement de 6 mois pour les projets entrepreneuriaux féminins."},
      {"title": "Mentorat", "description": "Mise en relation entre entrepreneures débutantes et mentors expérimentés."}
    ]'::jsonb,
    '[
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/entreprenariat-gallery-1",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/entreprenariat-gallery-2"
    ]'::jsonb,
    2
  ),

  -- 4. Formation des Jeunes
  (
    'formation',
    'Formation des Jeunes',
    'ÉDUCATION & INSERTION',
    'Offrir aux jeunes centrafricains des formations pratiques et professionnalisantes pour favoriser leur insertion sur le marché du travail. Ateliers,…',
    'graduation',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/formation-hero',
    '[
      {"title": "Formation professionnelle", "description": "Ateliers pratiques dans les métiers du numérique, de la cuisine, de la communication."},
      {"title": "Stages en entreprise", "description": "Mise en relation avec des partenaires employeurs pour des stages rémunérés."},
      {"title": "Programme de mentorat", "description": "Accompagnement individuel des jeunes par des professionnels expérimentés."}
    ]'::jsonb,
    '[
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/formation-gallery-1",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/formation-gallery-2"
    ]'::jsonb,
    3
  ),

  -- 5. Communication
  (
    'communication',
    'Communication',
    'VISIBILITÉ & MÉDIAS',
    'Assurer la visibilité des actions de LIAM Groupe et de ses partenaires à travers une stratégie de communication moderne : relations presse,…',
    'megaphone',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/communication-hero',
    '[
      {"title": "Relations presse", "description": "Couverture médiatique des événements et diffusion des communiqués aux médias locaux et internationaux."},
      {"title": "Production audiovisuelle", "description": "Création de documentaires, reportages et contenus digitaux mettant en valeur nos actions."},
      {"title": "Community management", "description": "Gestion des réseaux sociaux et engagement de la communauté en ligne."}
    ]'::jsonb,
    '[
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/communication-gallery-1",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/communication-gallery-2"
    ]'::jsonb,
    4
  ),

  -- 6. Événementiel
  (
    'evenementiel',
    'Événementiel',
    'CULTURE & GALAS',
    'Organiser des événements d''envergure qui rassemblent, inspirent et célèbrent la culture centrafricaine. Galas de charité, festivals…',
    'calendar',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/evenementiel-hero',
    '[
      {"title": "Gala de charité", "description": "Soirée prestigieuse réunissant partenaires et donateurs pour le financement des programmes."},
      {"title": "Festivals culturels", "description": "Manifestations artistiques mettant en valeur la musique, la danse et les arts locaux."},
      {"title": "Nuit du Patrimoine", "description": "Soirée dédiée à la valorisation du patrimoine culturel et artisanal centrafricain."}
    ]'::jsonb,
    '[
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/evenementiel-gallery-1",
      "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_700,h_500,c_fill,dpr_auto/v1/liam-groupe/evenementiel-gallery-2"
    ]'::jsonb,
    5
  ),

  -- 7. Miss Centrafrique
  (
    'miss-centrafrique',
    'Miss Centrafrique',
    'ÉVÉNEMENT & CULTURE',
    'Le grand concours national de beauté et de culture, organisé chaque année par LIAM Groupe pour célébrer la diversité et le talent des femmes centrafricaines à travers tout le pays.',
    'crown',
    '/images/miss_centrafrique/660293914_122214852962493986_3925101421778963041_n.jpg',
    '[
      {"title": "Édition annuelle Miss Centrafrique", "description": "Concours national réunissant des candidates des 16 préfectures pour la grande finale à Bangui."},
      {"title": "Casting régional", "description": "Tournée de sélection dans les principales villes du pays pour repérer les candidates."},
      {"title": "Programme social des lauréates", "description": "Les lauréates portent pendant un an des actions de sensibilisation aux côtés des programmes LIAM (éducation, santé, entrepreneuriat féminin)."}
    ]'::jsonb,
    '[
      "/images/miss_centrafrique/602360568_122201092124493986_1040350237599525467_n.jpg",
      "/images/miss_centrafrique/602369447_122201092304493986_1654277192015430010_n.jpg",
      "/images/miss_centrafrique/602942164_122201091986493986_7876967984288534926_n.jpg",
      "/images/miss_centrafrique/602970718_122201092028493986_1341360414517098757_n.jpg",
      "/images/miss_centrafrique/603877467_122201091788493986_6848310215721556803_n.jpg",
      "/images/miss_centrafrique/604842510_122201091902493986_5059305910630420651_n.jpg",
      "/images/miss_centrafrique/605839126_122201092082493986_7051333952073355898_n.jpg",
      "/images/miss_centrafrique/652260934_122213049812493986_1741650240073091187_n.jpg",
      "/images/miss_centrafrique/657846609_122214853046493986_902888607739175824_n.jpg"
    ]'::jsonb,
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Vérification
-- =====================================================
SELECT id, slug, name, category, icon FROM domains ORDER BY order_index;
