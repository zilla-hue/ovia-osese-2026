import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";
import {
  Music,
  Users,
  Landmark,
  BookOpen,
  Heart,
  PartyPopper,
} from "lucide-react";

const expectItems = [
  {
    icon: Landmark,
    title: "Cultural Processions",
    desc: "Witness the grandeur of traditional processions through historic Ogori.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.01.jpeg",
  },
  {
    icon: Music,
    title: "Traditional Dances & Performances",
    desc: "Experience vibrant music and dance passed down through generations.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.02 (4).jpeg",
  },
  {
    icon: Users,
    title: "Community Gatherings",
    desc: "Join communal events that bring families and neighbours together.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.04 (3).jpeg",
  },
  {
    icon: BookOpen,
    title: "Heritage Sessions",
    desc: "Engage in discussions that preserve the history and values of the Ogori people.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.02 (2).jpeg",
  },
  {
    icon: Heart,
    title: "Family Reunions",
    desc: "Reconnect with loved ones returning from across Nigeria and the diaspora.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.02 (3).jpeg",
  },
  {
    icon: PartyPopper,
    title: "Grand Finale Celebration",
    desc: "The week culminates in a spectacular closing celebration for all.",
    img: "/images/WhatsApp Image 2026-03-04 at 13.46.03 (2).jpeg",
  },
];

export default function Home() {
  const targetDate = new Date("2026-04-12T00:00:00");

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpeg"
            alt="Ovia Osese Festival — traditional dancers celebrate in Ogori"
            className="w-full h-full object-cover opacity-35 scale-105"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* layered gradient for depth */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-royal-700/60 via-royal-700/20 to-royal-700/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-gold text-sm md:text-base font-medium mb-5 animate-[fadeInDown_0.8s_ease-out]">
            April 12 – April 18, 2026 &middot; Ogori, Kogi State, Nigeria
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] font-serif font-bold mb-6 tracking-tight leading-[1.05]">
            Ovia Osese
          </h1>
          <p className="text-lg md:text-2xl font-light mb-4 text-stone-200 max-w-2xl mx-auto italic">
            Living the Legacy: A Rich Celebration of
            Tradition&nbsp;and&nbsp;Identity
          </p>
          <p className="text-xl md:text-2xl text-gold font-serif mb-10">
            Welcome Home.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/programme"
              className="bg-wine-600 hover:bg-wine-500 text-white px-8 py-4 rounded-md text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-wine-900/30"
            >
              View Programme
            </Link>
            <Link
              to="/visit"
              className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white hover:text-stone-900 text-white px-8 py-4 rounded-md text-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Plan Your Visit
            </Link>
            <Link
              to="/sponsors"
              className="bg-white/10 backdrop-blur-sm border border-gold/40 hover:bg-gold hover:border-gold hover:text-stone-900 text-gold px-8 py-4 rounded-md text-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Become a Partner
            </Link>
          </div>
        </div>

        {/* subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── About Preview with Image ── */}
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-white flex items-center py-20 lg:py-28 px-6 sm:px-12 lg:px-16">
            <div className="max-w-lg mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
                Ovia Osese is more than a festival.
              </h2>
              <p className="text-2xl md:text-3xl font-serif text-wine-600 mb-8 italic">
                It is a homecoming.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed mb-6">
                Through traditional rites, processions, music, dance,
                storytelling, and communal gatherings, the festival preserves
                the identity of the Ogori people and passes it to the next
                generation.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                Visitors are welcome to experience a living culture rooted in
                dignity, peace, and hospitality.
              </p>
            </div>
          </div>
          <div className="relative h-80 lg:h-auto">
            <img
              src="/images/maiden-procession1.jpeg"
              alt="Young women in traditional ceremonial attire during Ovia Osese procession"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ── Welcome Text with Kogi Landscape ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/WhatsApp Image 2026-03-04 at 13.46.03 (2).jpeg"
            alt="Aerial view of Ogori village in Kogi State"
            className="w-full h-full object-cover opacity-15"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-stone-50/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed max-w-3xl mx-auto">
            Ovia Osese is the annual cultural festival of the Ogori people — a
            week-long celebration of heritage, identity, and community. Each
            year, families return from across Nigeria and the diaspora to
            gather, reconnect, and proudly showcase traditions passed down
            through generations.
          </p>
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed max-w-3xl mx-auto mt-6">
            For one week, Ogori becomes a meeting point of history and modern
            life, where culture is not remembered, but{" "}
            <strong className="text-wine-600">lived</strong>.
          </p>
        </div>
      </section>

      {/* ── What to Expect – Image Cards ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4 text-center">
            What to Expect
          </h2>
          <p className="text-stone-600 text-center mb-16 max-w-2xl mx-auto">
            A full week of culture, connection, and celebration awaits you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {expectItems.map(({ icon: Icon, title, desc, img }) => (
              <div
                key={title}
                className="group rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/60 hover:-translate-y-1 cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {title}
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[15px]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width Cultural Image Band ── */}
      <section className="relative h-80 md:h-[28rem] overflow-hidden">
        <img
          src="/images/WhatsApp Image 2026-03-04 at 13.46.02 (2).jpeg"
          alt="Community elders of Ogori in traditional council"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-700/80 via-royal-700/40 to-transparent flex items-center">
          <div className="max-w-xl px-8 sm:px-16">
            <blockquote className="text-white text-2xl md:text-3xl font-serif italic leading-snug">
              "The festival represents continuity. It reminds every Ogorian, at
              home and abroad, that belonging is not lost with distance."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section className="py-24 bg-royal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              The countdown has begun.
            </h2>
            <p className="text-stone-300 text-lg max-w-xl mx-auto">
              Make your plans early. Inform your family. Prepare to return home.
            </p>
          </div>
          <Countdown targetDate={targetDate} />
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block bg-wine-600 hover:bg-wine-500 text-white px-10 py-4 rounded-md text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-wine-900/40"
            >
              Register Your Attendance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
