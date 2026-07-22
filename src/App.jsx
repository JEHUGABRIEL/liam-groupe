import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatBot from "./components/ChatBot";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./lib/cartContext";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Boutique = lazy(() => import("./pages/BoutiqueIndex"));
const BoutiqueProduct = lazy(() => import("./pages/ProductDetail"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Events = lazy(() => import("./pages/Events"));
const DomainsIndex = lazy(() => import("./pages/DomainsIndex"));
const Domain = lazy(() => import("./pages/Domain"));
const Admin = lazy(() => import("./pages/Admin"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm text-gray-400">{t("common.loading")}</p>
      </div>
    </div>
  );
}

function Layout() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  
  useEffect(() => {
    if (lang && lang !== i18n.language?.split("-")[0]) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  
  useEffect(() => {
    document.title = t("meta.siteTitle");
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  
  const pageVariants = {
    initial: { opacity: 0.88, x: 60 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0.88,
      x: -40,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={isAdmin ? "admin" : location.pathname + location.search}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </AnimatePresence>
      {!isAdmin && <ChatBot />}
      <CartDrawer />
    </ErrorBoundary>
  );
}


function RedirectToLang() {
  const { i18n } = useTranslation();
  const detected = i18n.language?.startsWith("en") ? "en" : "fr";
  return <Navigate to={`/${detected}`} replace />;
}

const router = createBrowserRouter([
  
  {
    path: "/:lang",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "a-propos", element: <About /> },
      { path: "boutique", element: <Boutique /> },
      { path: "boutique/:slug", element: <BoutiqueProduct /> },
      { path: "actualites", element: <News /> },
      { path: "actualites/:slug", element: <NewsArticle /> },
      { path: "evenements", element: <Events /> },
      { path: "domaines", element: <DomainsIndex /> },
      { path: "domaines/:slug", element: <Domain /> },
      { path: "mentions-legales", element: <MentionsLegales /> },
      { path: "politique-de-confidentialite", element: <PolitiqueConfidentialite /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  
  {
    path: "/",
    element: <RedirectToLang />,
  },
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
