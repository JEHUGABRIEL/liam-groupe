"use client";
import { CalendarDays, MapPin, ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import SafeImg from "./SafeImg";

function parseDate(dateStr) {
  if (!dateStr) return null;
  const months = {
    janv: "JAN", févr: "FÉV", mars: "MAR", avril: "AVR", mai: "MAI", juin: "JUN",
    juill: "JUL", août: "AOU", sept: "SEP", oct: "OCT", nov: "NOV", déc: "DÉC",
  };
  const parts = dateStr.trim().split(/[\s-]+/);
  if (parts.length < 2) return null;
  const day = parts[0].replace(/^0+/, "") || null;
  const monthFr = parts[1].toLowerCase().slice(0, 5);
  const month = Object.entries(months).find(([k]) => monthFr.startsWith(k))?.[1] || parts[1].slice(0, 3).toUpperCase();
  const year = parts[2] || null;
  return { day, month, year };
}

export default function EventCard({ event, compact = false, onRegister, showMiniCalendar = true }) {
  const { t } = useTranslation();
  const isUpcoming = event.status === "a_venir";
  const Icon = event.icon || null;
  const cal = showMiniCalendar ? parseDate(event.date) : null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col h-full hover:lift transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden">
        
        {showMiniCalendar && (
          <div className="absolute top-3 right-3 z-10 w-[48px] sm:w-[60px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1">
            {cal ? (
              <>
                <div className="bg-brand-500 text-white text-[9px] sm:text-[10px] font-bold uppercase text-center py-1 sm:py-1.5 tracking-wider">
                  {cal.month}
                </div>
                <div className="flex flex-col items-center py-1 sm:py-1.5 px-0.5 sm:px-1">
                  <span className="text-lg sm:text-2xl font-bold text-ink leading-none">{cal.day}</span>
                  {cal.year && (
                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium mt-0.5">{cal.year}</span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 sm:py-2.5 px-0.5 sm:px-1">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                <span className="text-[7px] sm:text-[8px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">Date</span>
              </div>
            )}
          </div>
        )}
        <SafeImg src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" icon={ImageOff} retries={3} />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
            isUpcoming ? "bg-brand-500 text-white" : "bg-ink/80 text-white"
          }`}
        >
          {isUpcoming ? t('events.upcoming') : t('events.past')}
        </span>
        {!compact && (
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-700">
            {event.category}
          </span>
        )}
        {Icon && (
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-brand-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {event.location}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg leading-snug">{event.title}</h3>
        <p className="text-gray-500 mt-2 leading-relaxed flex-1">{event.description}</p>
        {compact ? (
          <span className="mt-4 inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
            {event.category}
          </span>
        ) : isUpcoming ? (
          <button
            onClick={() => onRegister?.(event)}
            className="mt-5 w-full py-3 rounded-full border border-brand-100 text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
          >
            {t('events.register')} →
          </button>
        ) : null}
      </div>
    </div>
  );
}
