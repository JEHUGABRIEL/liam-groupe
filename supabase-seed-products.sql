-- =====================================================
-- SEED : Produits (products) mock → Supabase
-- Insère les 3 produits définis dans src/data/siteData.js
-- =====================================================
-- Exécute dans Supabase Dashboard > SQL Editor
-- Peut être exécuté plusieurs fois (ON CONFLICT DO NOTHING)
-- =====================================================

INSERT INTO products (slug, name, description, price, image, category, domain, order_index)
VALUES
  (
    'casquette-liam',
    'Casquette LIAM Groupe',
    'Casquette ajustable brodée au logo LIAM Groupe. Disponible en noir et blanc.',
    '5 000 FCFA',
    '/images/Nos_produits/749354955_1658208996311419_3819724823827381595_n.jpg',
    'Accessoires',
    'liam-groupe',
    0
  ),
  (
    'sac-main-gfitness',
    'Sac à main G-Fitness',
    'Sac cabas en coton recyclé avec impression sérigraphiée G-Fitness. Idéal pour le sport et le quotidien.',
    '7 000 FCFA',
    '/images/Nos_produits/sacs/749652135_1658209169644735_5658764887506984283_n.jpg',
    'Accessoires',
    'g-fitness',
    1
  ),
  (
    't-shirt-liam',
    'T-shirt LIAM Groupe',
    'T-shirt en coton bio, coupe standard, logo LIAM Groupe sérigraphié sur la poitrine. Plusieurs tailles disponibles.',
    '6 000 FCFA',
    '/images/Nos_produits/t_shirts/749354944_1658208942978091_7351098969532136844_n.jpg',
    'Vêtements',
    'liam-groupe',
    2
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Vérification
-- =====================================================
SELECT id, slug, name, price, category, domain FROM products ORDER BY order_index;
