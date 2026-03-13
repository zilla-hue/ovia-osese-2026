import { Download, Sun, Sunset, Moon, Clock, MapPin } from "lucide-react";
import { downloadProgrammePdf } from "../utils/generateProgrammePdf";

interface EventItem {
  name: string;
  time?: string;
  note?: string;
}

interface TimeBlock {
  period: "Morning" | "Afternoon" | "Evening";
  icon: typeof Sun;
  events: EventItem[];
}

interface DaySchedule {
  day: string;
  date: string;
  accent: string;
  accentLight: string;
  blocks: TimeBlock[];
}

const schedule: DaySchedule[] = [
  {
    day: "Sunday",
    date: "12th April, 2026",
    accent: "bg-wine-600",
    accentLight: "bg-wine-50 border-wine-200",
    blocks: [
      {
        period: "Evening",
        icon: Moon,
        events: [{ name: "Praise Night", time: "7 pm" }],
      },
    ],
  },
  {
    day: "Monday",
    date: "13th April, 2026",
    accent: "bg-royal-600",
    accentLight: "bg-royal-50 border-royal-200",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [{ name: "Cleaning (OSA)" }],
      },
      {
        period: "Afternoon",
        icon: Sunset,
        events: [{ name: "Board Games", time: "3 pm" }],
      },
      {
        period: "Evening",
        icon: Moon,
        events: [
          { name: "Road Show (OSA)", time: "4:30 pm" },
          { name: "Local Games", time: "5 pm" },
        ],
      },
    ],
  },
  {
    day: "Tuesday",
    date: "14th April, 2026",
    accent: "bg-stone-700",
    accentLight: "bg-stone-50 border-stone-300",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [
          { name: "Senior Citizen Jogging", time: "6 am" },
          { name: "Quiz and Debates", time: "8:30 am" },
        ],
      },
      {
        period: "Afternoon",
        icon: Sunset,
        events: [{ name: "Volleyball Finals", time: "3:30 pm" }],
      },
    ],
  },
  {
    day: "Wednesday",
    date: "15th April, 2026",
    accent: "bg-wine-600",
    accentLight: "bg-wine-50 border-wine-200",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [{ name: "Marathon", time: "6 am" }],
      },
      {
        period: "Afternoon",
        icon: Sunset,
        events: [
          { name: "Cooking Competition", time: "3 pm" },
          { name: "Oko Language Competition", time: "4 pm" },
        ],
      },
      {
        period: "Evening",
        icon: Moon,
        events: [{ name: "Entertainment Night", time: "5 pm" }],
      },
    ],
  },
  {
    day: "Thursday",
    date: "16th April, 2026",
    accent: "bg-royal-600",
    accentLight: "bg-royal-50 border-royal-200",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [{ name: "Time With Ivia (Talk Show)", time: "10 am" }],
      },
      {
        period: "Afternoon",
        icon: Sunset,
        events: [{ name: "Football Finals", time: "4 pm" }],
      },
      {
        period: "Evening",
        icon: Moon,
        events: [{ name: "Eregba Night", time: "8 pm" }],
      },
    ],
  },
  {
    day: "Friday",
    date: "17th April, 2026",
    accent: "bg-wine-600",
    accentLight: "bg-wine-50 border-wine-200",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [
          { name: "Carnival", time: "6 am" },
          {
            name: "TITI OAKS Foundation Outreach",
            note: "Immediately after Carnival",
          },
        ],
      },
      {
        period: "Afternoon",
        icon: Sunset,
        events: [
          {
            name: "Mrs. Aiso's Medical Outreach for Girls",
            time: "3:30 pm",
          },
        ],
      },
      {
        period: "Evening",
        icon: Moon,
        events: [
          { name: "Miss Ogori", time: "5 pm" },
          { name: "Gala Night", time: "8 pm" },
        ],
      },
    ],
  },
  {
    day: "Saturday",
    date: "18th April, 2026",
    accent: "bg-royal-600",
    accentLight: "bg-royal-50 border-royal-200",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [{ name: "Grand Finale", time: "10 am" }],
      },
    ],
  },
  {
    day: "Sunday",
    date: "19th April, 2026",
    accent: "bg-stone-700",
    accentLight: "bg-stone-50 border-stone-300",
    blocks: [
      {
        period: "Morning",
        icon: Sun,
        events: [
          {
            name: "Thanksgiving Services",
            note: "At various Churches",
          },
        ],
      },
    ],
  },
];

const periodColors = {
  Morning:
    "bg-amber-50 text-amber-700 border-amber-200",
  Afternoon:
    "bg-orange-50 text-orange-700 border-orange-200",
  Evening:
    "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function Programme() {
  return (
    <div className="flex flex-col">
      {/* ── Header with Image ── */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-programme-musicians.jpg"
            alt="Traditional musicians at an Ogori festival"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/50 to-royal-700/30" />
        <div className="relative z-10 text-center px-4">
          <p className="uppercase tracking-[0.3em] text-gold text-sm md:text-base font-medium mb-4 animate-[fadeInDown_0.8s_ease-out]">
            Ovia Osese 2026
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Festival Programme
          </h1>
          <p className="text-base md:text-lg text-stone-200 max-w-2xl mx-auto mb-3 italic font-serif">
            "Living the Legacy: A Rich Celebration of
            Tradition&nbsp;and&nbsp;Identity"
          </p>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-8">
            April 12 – April 19, 2026
          </p>
          <button
            onClick={downloadProgrammePdf}
            className="inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-500 text-white px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Download Full Programme (PDF)
          </button>
        </div>
      </section>

      {/* ── Intro Text ── */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-stone-700 leading-relaxed">
            The Festivals and Events Sub-Committee of the Ogori Descendants
            Union is pleased to announce the schedule of events for the 2026
            Ovia Osese Festival themed{" "}
            <strong className="text-wine-600">
              "LIVING THE LEGACY: A Rich Celebration of Tradition and Identity."
            </strong>
          </p>
          <p className="text-stone-600 mt-4">
            This year's events will begin with{" "}
            <strong>Praise Night on Sunday, April 12th</strong> and end with{" "}
            <strong>Thanksgiving Services on Sunday, April 19th</strong>.
          </p>
        </div>
      </section>

      {/* ── Detailed Daily Schedule ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 text-center mb-12">
            Detailed Programme Schedule
          </h2>

          <div className="space-y-8">
            {schedule.map((day, dayIdx) => (
              <div
                key={`${day.day}-${day.date}`}
                className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* Day header */}
                <div
                  className={`${day.accent} px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2`}
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {day.day}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {day.date}
                    </p>
                  </div>
                  <span className="text-white/60 text-sm font-medium bg-white/15 px-3 py-1 rounded-full self-start sm:self-auto">
                    Day {dayIdx + 1} of 8
                  </span>
                </div>

                {/* Time blocks */}
                <div className="p-5 sm:p-8 space-y-5">
                  {day.blocks.map((block) => {
                    const Icon = block.icon;
                    return (
                      <div key={block.period} className="space-y-3">
                        {/* Period label */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${periodColors[block.period]}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {block.period}
                          </div>
                        </div>

                        {/* Events list */}
                        <div className="ml-1 space-y-2">
                          {block.events.map((event, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 group"
                            >
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-stone-300 group-hover:bg-wine-400 transition-colors shrink-0" />
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
                                <span className="text-stone-800 font-medium">
                                  {event.name}
                                </span>
                                {event.time && (
                                  <span className="inline-flex items-center gap-1 text-sm text-stone-500 font-medium shrink-0">
                                    <Clock className="w-3.5 h-3.5" />
                                    {event.time}
                                  </span>
                                )}
                                {event.note && (
                                  <span className="inline-flex items-center gap-1 text-sm text-stone-500 italic shrink-0">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {event.note}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Closing Message ── */}
          <div className="mt-14 bg-stone-50 border border-stone-200 rounded-xl p-8 text-center">
            <p className="text-stone-700 leading-relaxed mb-4">
              We wish everyone a memorable festival and pray for a safe journey
              to all who will travel from all parts of the world to celebrate.
            </p>
            <div className="mt-6 text-stone-500 text-sm">
              <p className="font-semibold text-stone-700">Signed:</p>
              <p>Festivals and Events Sub-Committee</p>
              <p>Ogori Cultural Renaissance Committee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
