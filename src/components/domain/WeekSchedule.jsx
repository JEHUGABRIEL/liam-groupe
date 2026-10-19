import Reveal from "@/components/ui/Reveal";

/** Jour de la semaine à Bangui (« Lundi »...), pour mettre en avant la journée en cours. */
function todayInBangui() {
  const day = new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "Africa/Bangui" }).format(new Date());
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/** Planning hebdomadaire sur fond sombre ; la colonne du jour est mise en avant. */
export default function WeekSchedule({ schedule = [] }) {
  if (schedule.length === 0) return null;
  const today = todayInBangui();
  const total = schedule.reduce((sum, day) => sum + (day.classes?.length || 0), 0);
  return (
    <section className="bg-noir-doux py-14 text-white md:py-20 lg:py-24">
      <div className="conteneur">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="t-label text-white/60">Planning</p>
            <Reveal className="mt-4"><h2 className="t-h2 text-white">La semaine type.</h2></Reveal>
          </div>
          <p className="t-label-sm text-white/60">{total} cours collectifs par semaine</p>
        </div>
        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {schedule.map((day) => {
            const isToday = day.day === today;
            return (
              <div key={day.day} className={`p-6 ${isToday ? "bg-accent" : "bg-noir-doux"}`}>
                <div className="flex items-center justify-between">
                  <p className={`t-label ${isToday ? "text-white" : "text-accent-vif"}`}>{day.day}</p>
                  {isToday && <span className="t-label-sm bg-white px-2 py-0.5 text-accent">Aujourd&apos;hui</span>}
                </div>
                <ul className="mt-6 space-y-5">
                  {day.classes?.map((c) => (
                    <li key={`${c.name}-${c.time}`} className={`border-l-2 pl-3 ${isToday ? "border-white" : "border-white/20"}`}>
                      <p className={`font-mono text-[0.85rem] font-bold ${isToday ? "text-white" : "text-white/55"}`}>{c.time}</p>
                      <p className="mt-0.5 font-semibold leading-snug">{c.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
