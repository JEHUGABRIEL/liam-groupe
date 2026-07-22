"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImageOff } from "lucide-react";

export default function SafeImg({ src, alt, className = "", eager = false, retries = 2, icon: Icon, ...props }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const attemptsRef = useRef(0);
  const imgRef = useRef(null);
  const prevSrcRef = useRef(src);
  const retryTimerRef = useRef(null);
  const shimmerTimerRef = useRef(null);

  useEffect(() => {
    if (loading && !showShimmer) {
      shimmerTimerRef.current = setTimeout(() => setShowShimmer(true), 200);
    }
    return () => {
      if (shimmerTimerRef.current) clearTimeout(shimmerTimerRef.current);
    };
  }, [loading, showShimmer]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoading(false);
      setShowShimmer(false);
    }
  }, []);

  if (src !== prevSrcRef.current) {
    prevSrcRef.current = src;
    setFailed(false);
    attemptsRef.current = 0;
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    setLoading(false);
    setShowShimmer(false);
  }

  const handleError = useCallback(() => {
    attemptsRef.current += 1;
    if (attemptsRef.current < retries) {
      const delay = Math.min(1000 * Math.pow(2, attemptsRef.current - 1), 4000);
      retryTimerRef.current = setTimeout(() => {
        if (imgRef.current) {
          const separator = src.includes("?") ? "&" : "?";
          imgRef.current.src = `${src}${separator}_retry=${Date.now()}`;
        }
      }, delay);
    } else {
      setFailed(true);
      setLoading(false);
      setShowShimmer(false);
    }
  }, [src, retries]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setFailed(false);
    setShowShimmer(false);
  }, []);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (shimmerTimerRef.current) clearTimeout(shimmerTimerRef.current);
    };
  }, []);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 ${className}`}
        aria-label={alt || "Image non disponible"}
      >
        <div className="flex flex-col items-center gap-1.5">
          {Icon ? <Icon className="w-5 h-5" /> : <ImageOff className="w-5 h-5" />}
          {alt && <span className="text-[0.6rem] font-medium text-gray-300 text-center px-1 leading-tight">{alt}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showShimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
      )}

      {failed ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400"
          aria-label={alt || "Image non disponible"}
        >
          <div className="flex flex-col items-center gap-1.5">
            {Icon ? <Icon className="w-5 h-5" /> : <ImageOff className="w-5 h-5" />}
            {alt && <span className="text-[0.6rem] font-medium text-gray-300 text-center px-1 leading-tight">{alt}</span>}
          </div>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onError={handleError}
          onLoad={handleLoad}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}
