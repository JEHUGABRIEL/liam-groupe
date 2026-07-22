import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";


let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx)
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}


function playNotification() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    
    osc.frequency.setValueAtTime(880, ctx.currentTime); 
    osc.frequency.setValueAtTime(1108, ctx.currentTime + 0.12); 

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    
  }
}


export default function useRealtimeCounts({ channelName, enableSound = false } = {}) {
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  
  const prevPendingRef = useRef(Infinity);
  const prevUnreadRef = useRef(Infinity);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: pCount } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("status", "en_attente");
      if (typeof pCount === "number") {
        if (enableSound && pCount > prevPendingRef.current) playNotification();
        prevPendingRef.current = pCount;
        setPendingCount(pCount);
      }

      const { count: uCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (typeof uCount === "number") {
        if (enableSound && uCount > prevUnreadRef.current) playNotification();
        prevUnreadRef.current = uCount;
        setUnreadCount(uCount);
      }
    };

    fetchCounts();

    
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "registrations" }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchCounts)
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCounts();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [channelName, enableSound]);

  return { pendingCount, unreadCount, connected };
}
