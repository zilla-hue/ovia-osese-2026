import { Download } from "lucide-react";

const schedule = [
  {
    day: "Sunday",
    date: "April 12",
    title: "Opening Activities",
    accent: "bg-wine-600",
  },
  {
    day: "Monday",
    date: "April 13",
    title: "Cultural Engagements",
    desc: "Heritage discussions and youth participation.",
    accent: "bg-royal-600",
  },
  {
    day: "Tuesday",
    date: "April 14",
    title: "Community Activities",
    desc: "Family and communal events.",
    accent: "bg-stone-700",
  },
  {
    day: "Wednesday",
    date: "April 15",
    title: "Cultural Displays",
    accent: "bg-wine-600",
  },
  {
    day: "Thursday",
    date: "April 16",
    title: "Cultural Competitions",
    desc: "Music, dance and heritage contests.",
    accent: "bg-royal-600",
  },
  {
    day: "Friday",
    date: "April 17",
    title: "Preparatory Celebrations",
    accent: "bg-wine-600",
  },
  {
    day: "Saturday",
    date: "April 18",
    title: "Grand Finale",
    desc: "Main cultural celebration and closing festivities.",
    accent: "bg-royal-600",
  },
];

export default function Programme() {
  return (
    <div className="flex flex-col">
      {/* ── Header with Image ── */}
      <section className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/WhatsApp Image 2026-03-04 at 13.46.02 (4).jpeg"
            alt="Traditional musicians at an Ogori festival"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/50 to-royal-700/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Festival Programme
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto mb-8">
            Ovia Osese Festival Week: April 12 – April 18, 2026
          </p>
          <a
            href="/programme-2026.pdf"
            download
            className="inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-500 text-white px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            Download Full Programme (PDF)
          </a>
        </div>
      </section>

      {/* ── Daily Schedule ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {schedule.map((item) => (
              <div
                key={item.day}
                className="relative bg-stone-50 border border-stone-200 rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-wine-200 duration-300"
              >
                {/* left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.accent}`}
                />
                <div className="pl-8 pr-6 py-6 sm:flex sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-xl font-serif font-bold text-stone-900">
                        {item.day}
                      </span>
                      <span className="text-sm text-wine-600 font-medium">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-stone-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-stone-500 text-center mt-10 italic">
            Programme details may be updated as activities are finalized.
          </p>
        </div>
      </section>
    </div>
  );
}
