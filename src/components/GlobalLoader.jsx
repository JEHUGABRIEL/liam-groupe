import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";


export default function GlobalLoader() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" && !navigator.onLine
  );

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-ink via-ink-900 to-ink">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
            <span className="font-heading font-bold text-white text-2xl">L</span>
          </div>
          <h1 className="font-heading font-bold text-white text-3xl tracking-tight">
            LIAM <span className="text-brand-500">Groupe</span>
          </h1>
          <p className="text-white/40 text-sm mt-1 font-medium tracking-wide">
            Révéler les talents, créer des opportunités durables
          </p>
        </div>

        
        {offline ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">Problème de réseau</p>
              <p className="text-white/40 text-xs mt-1">
                Vérifiez votre connexion internet
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-b-brand-500/30 rounded-full animate-spin -rotate-180" />
            </div>
            <p className="text-white/40 text-xs font-medium">Chargement…</p>
          </div>
        )}

        
        <div className="flex items-center gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full bg-brand-500/20 animate-pulse-stagger stagger-${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
