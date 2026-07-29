"use client";
import { Link } from "../../lib/navLink";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../../lib/langPath";
import { supabase } from "../../lib/supabase.js";
import storage from "../../lib/storage.js";
import { Shield, Lock, Eye, EyeOff, LogIn, Loader2, Mail, ArrowLeft } from "lucide-react";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_DURATION = 60 * 1000; 
const LS_ATTEMPTS = "liam-admin-attempts";
const LS_LOCKED_AT = "liam-admin-locked-at";


function checkRateLimit() {
  const lockedAt = parseInt(storage.getItem(LS_LOCKED_AT) || "0", 10);
  const now = Date.now();

  if (lockedAt && now - lockedAt < RATE_LIMIT_DURATION) {
    const remaining = Math.ceil((RATE_LIMIT_DURATION - (now - lockedAt)) / 1000);
    return { locked: true, remainingSeconds: remaining };
  }

  if (lockedAt) {
    storage.removeItem(LS_LOCKED_AT);
    storage.removeItem(LS_ATTEMPTS);
  }

  return { locked: false, remainingSeconds: 0 };
}

function recordFailedAttempt() {
  const attempts = parseInt(storage.getItem(LS_ATTEMPTS) || "0", 10);
  const newCount = attempts + 1;
  storage.setItem(LS_ATTEMPTS, String(newCount));

  if (newCount >= RATE_LIMIT_MAX) {
    storage.setItem(LS_LOCKED_AT, String(Date.now()));
  }

  return newCount;
}

function resetRateLimit() {
  storage.removeItem(LS_ATTEMPTS);
  storage.removeItem(LS_LOCKED_AT);
}

export default function AdminLogin({ onLogin }) {
  const { t } = useTranslation();
  const p = useLangPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(() => checkRateLimit());
  const [countdown, setCountdown] = useState(rateLimited.remainingSeconds);

  useEffect(() => {
    if (!rateLimited.locked) return;

    const interval = setInterval(() => {
      const state = checkRateLimit();
      setRateLimited(state);
      setCountdown(state.remainingSeconds);

      if (!state.locked) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimited.locked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { locked, remainingSeconds } = checkRateLimit();
    if (locked) {
      setRateLimited({ locked: true, remainingSeconds });
      setCountdown(remainingSeconds);
      return;
    }

    setLoading(true);

    
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !data?.session) {
      const attempts = recordFailedAttempt();
      const remaining = RATE_LIMIT_MAX - attempts;

      if (remaining <= 0) {
        setRateLimited({ locked: true, remainingSeconds: 60 });
        setCountdown(60);
        setError(t("admin.login.rateLimit", { seconds: 60 }));
      } else {
        setError(t("admin.login.attemptsLeft", { count: remaining }));
      }
      setLoading(false);
      return;
    }

    
    
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id, name")
      .eq("id", data.session.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      setError(t("admin.login.notAuthorized") || "Ce compte n'a pas les droits admin.");
      setLoading(false);
      return;
    }

    resetRateLimit();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#130025] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t("admin.login.title")}
          </h1>
          <p className="text-white/50 mt-2">{t("admin.login.subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-xl space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="admin-email">
              {t("admin.login.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={t("admin.login.emailPlaceholder")}
                autoFocus
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="admin-password">
              {t("admin.login.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="admin-password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder={t("admin.login.passwordPlaceholder")}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || rateLimited.locked}
            className="w-full py-3 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {rateLimited.locked ? `${t("admin.login.wait")} ${countdown}s` : t("admin.login.submit")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to={p("/")}
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("admin.login.backToSite")}
          </Link>
        </div>
      </div>
    </div>
  );
}
