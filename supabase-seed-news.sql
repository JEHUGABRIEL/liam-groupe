-- =====================================================
-- SEED : Articles d'actualités (news) mock → Supabase
-- Insère les 7 articles définis dans src/data/siteData.js
-- =====================================================
-- Exécute dans Supabase Dashboard > SQL Editor
-- Peut être exécuté plusieurs fois (ON CONFLICT DO NOTHING)
-- =====================================================

INSERT INTO news (slug, title, excerpt, content, image, date, tags, author, order_index)
VALUES
  (
    'prix-innovation-sociale-2026',
    'LIAM Groupe remporte le prix de l''Innovation Sociale 2026',
    'Reconnue pour son impact sur l''entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du…',
    'Reconnue pour son impact sur l''entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du Forum National de l''Innovation Sociale qui s''est tenu à Bangui. Ce prix salue plus de dix années d''actions concrètes en faveur de l''autonomisation des femmes et des jeunes centrafricains.\n\nLe jury a particulièrement retenu l''approche intégrée de l''organisation, qui combine formation, accompagnement entrepreneurial et mise en réseau à travers ses différents programmes : G-Fitness, O''GAB, Entrepreneuriat & Leadership et Formation des Jeunes.\n\n« Cette distinction appartient avant tout aux centaines de femmes et de jeunes qui, chaque jour, portent nos programmes sur le terrain », a déclaré la Présidente de LIAM Groupe lors de la remise du prix. L''organisation entend désormais accélérer le déploiement de ses initiatives dans d''autres préfectures du pays.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-prix',
    '12 Juin 2026',
    '["ACTUALITÉ"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    0
  ),
  (
    'partenariat-minusca',
    'Nouveau partenariat avec la MINUSCA pour la paix par le sport',
    'Un accord de coopération a été signé pour organiser des tournois inter-communautaires dans les préfectures de…',
    'Un accord de coopération a été signé entre LIAM Groupe et la MINUSCA pour organiser des tournois sportifs inter-communautaires dans plusieurs préfectures du pays. L''objectif : utiliser le sport comme outil de cohésion sociale et de réconciliation entre les communautés.\n\nLe programme G-Fitness, déjà reconnu à Bangui pour ses tournois féminins de basketball, servira de socle méthodologique à cette initiative élargie. Des rencontres sportives mixtes seront organisées dans les prochains mois, encadrées par des animateurs formés aux enjeux de dialogue communautaire.\n\nCe partenariat s''inscrit dans la continuité des actions de LIAM Groupe pour une Centrafrique apaisée, où le sport devient un langage commun au-delà des divisions.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-minusca',
    '3 Mai 2026',
    '["PARTENARIAT"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    1
  ),
  (
    'ogab-restaurant-solidaire',
    'O''GAB ouvre son premier restaurant solidaire à Bangui',
    'Le restaurant O''GAB emploie 15 femmes formées par LIAM Groupe et propose une cuisine 100% locale à des prix accessibles.',
    'Le restaurant O''GAB a ouvert ses portes au cœur de Bangui. Il emploie 15 femmes formées par LIAM Groupe dans le cadre de son programme de gastronomie solidaire, et propose une cuisine 100% locale à des prix accessibles à tous les Banguissois.\n\nAu-delà de la restauration, l''établissement sert de vitrine pour les produits du terroir centrafricain et de lieu de formation continue pour de nouvelles promotions de femmes entrepreneures.\n\n« Chaque plat servi ici raconte une histoire de résilience et de savoir-faire », confie l''une des cheffes formées par le programme O''GAB. Le restaurant est ouvert du lundi au samedi, de 11h à 21h.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-ogab',
    '18 Avril 2026',
    '["O''GAB"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    2
  ),
  (
    '500-jeunes-formes-numerique',
    '500 jeunes formés aux métiers du numérique en 2025',
    'Bilan de l''année écoulée pour le programme de formation des jeunes : 500 diplômés, 120 emplois créés et 30 startups…',
    'Le bilan de l''année 2025 pour le programme Formation des Jeunes de LIAM Groupe est sans appel : 500 jeunes diplômés dans les métiers du numérique, du développement web à la communication digitale en passant par la gestion de projet.\n\nSur ces 500 diplômés, 120 ont déjà décroché un emploi et une trentaine ont lancé leur propre startup avec l''appui du programme d''incubation de LIAM Groupe. Des résultats qui confirment la pertinence d''une formation courte, pratique et ancrée dans les besoins réels du marché centrafricain.\n\nPour 2026, l''organisation prévoit de doubler sa capacité d''accueil et d''ouvrir de nouvelles filières, notamment autour du commerce en ligne et du Mobile Money.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-formation',
    '10 Mars 2026',
    '["FORMATION"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    3
  ),
  (
    'tournoi-basketball-10000-spectateurs',
    'Le Tournoi Féminin de Basketball atteint 10 000 spectateurs',
    'Record d''affluence battu pour la finale du tournoi inter-quartiers. Un événement qui confirme l''engouement croissant pour le…',
    'La finale du Tournoi Féminin de Basketball, organisée par le programme G-Fitness de LIAM Groupe, a rassemblé plus de 10 000 spectateurs au Gymnase Omnisports de Bangui, un record d''affluence pour cet événement désormais incontournable.\n\nSeize équipes issues de différents quartiers de la capitale se sont affrontées pendant deux semaines dans une ambiance festive. La finale a été marquée par la présence de plusieurs personnalités publiques venues soutenir l''initiative.\n\nFort de ce succès, LIAM Groupe annonce déjà une édition 2027 élargie à d''autres villes du pays, avec pour ambition de faire de ce tournoi un rendez-vous national.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-basketball',
    '22 Février 2026',
    '["G-FITNESS"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    4
  ),
  (
    'entretien-marie-claire-ngbokoli',
    'Entretien avec Marie-Claire Ngbokoli : « L''avenir passe par la jeunesse »',
    'La fondatrice de LIAM Groupe se confie sur les défis de l''ONG, ses réussites et ses projets pour les années à venir.',
    'Onze ans après la création de LIAM Groupe, sa fondatrice Marie-Claire Ngbokoli revient sur le chemin parcouru : « Nous sommes partis d''un petit groupe de femmes déterminées à Bangui, et aujourd''hui nos programmes touchent des milliers de bénéficiaires à travers le pays. »\n\nInterrogée sur les défis, elle évoque le manque de financement structurel des ONG centrafricaines et la nécessité de diversifier les partenariats, notamment avec le secteur privé local. « Chaque partenaire qui nous rejoint, c''est un projet de plus qui voit le jour pour une femme ou un jeune de ce pays. »\n\nPour les années à venir, elle annonce une ambition claire : étendre les programmes de LIAM Groupe à l''ensemble des préfectures de la République Centrafricaine, en s''appuyant sur les relais locaux formés depuis 2015.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/news-portrait',
    '5 Janvier 2026',
    '["PORTRAIT"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    5
  ),
  (
    'lancement-castings-miss-centrafrique-2026',
    'Ouverture des castings pour Miss Centrafrique 2026',
    'LIAM Groupe lance la tournée régionale de sélection pour la 12ème édition du concours, avec une étape dans trois nouvelles villes cette année.',
    'LIAM Groupe annonce l''ouverture des inscriptions pour la 12ème édition de Miss Centrafrique. Les candidates de 18 à 26 ans peuvent se présenter aux castings régionaux organisés à Bouar, Berbérati et Bangassou avant la grande finale prévue à Bangui.\n\nAu-delà du concours de beauté, le programme met l''accent sur la culture et l''engagement social : les candidates suivront des ateliers de leadership et de prise de parole en public animés par l''équipe Entrepreneuriat & Leadership de LIAM Groupe.\n\nLa lauréate 2026 rejoindra, comme ses devancières, les actions de sensibilisation portées par LIAM Groupe tout au long de son mandat d''un an.',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-miss',
    '20 Juillet 2026',
    '["Miss Centrafrique"]'::jsonb,
    'Équipe Communication LIAM Groupe',
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Vérification
-- =====================================================
SELECT id, slug, title, date, tags, author FROM news ORDER BY order_index;
