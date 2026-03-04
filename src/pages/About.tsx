import { ShieldCheck, Heart, Users, BookOpen } from "lucide-react";

const significanceItems = [
  { icon: BookOpen, label: "Respect for ancestry" },
  { icon: Heart, label: "Preservation of values" },
  { icon: Users, label: "Unity of families" },
  { icon: ShieldCheck, label: "Community responsibility" },
];

const etiquetteItems = [
  "Dress modestly",
  "Follow guidance from community leaders",
  "Respect restricted cultural activities",
  "Ask before photographing certain rites",
];

export default function About() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Banner with Image ── */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/elders-council.png"
            alt="Community elders in traditional council"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            About Ovia Osese
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            The most significant cultural celebration of the Ogori people.
          </p>
        </div>
      </section>

      {/* ── What is Ovia Osese ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-8">
                What is Ovia Osese?
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                Ovia Osese is the most significant cultural celebration of the
                Ogori people. It is a structured period set aside each year to
                honour tradition, reinforce community bonds, and celebrate
                shared identity.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed">
                The festival represents continuity. It reminds every Ogorian, at
                home and abroad, that belonging is not lost with distance.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/ogori-village.png"
                alt="Scenic aerial view of Ogori village in Kogi State"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cultural Significance ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
            Cultural Significance
          </h2>
          <p className="text-lg text-stone-600 mb-10">
            The festival affirms core values that define the Ogori identity:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {significanceItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white border border-stone-200 p-6 rounded-xl hover:border-amber-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium text-stone-900">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-lg text-stone-600 mt-10">
            It is a public expression of heritage and a teaching moment for
            younger generations.
          </p>
        </div>
      </section>

      {/* ── Full-width Image Divider ── */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <img
          src="/images/traditional-music.png"
          alt="Traditional drummers performing at a village festival"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-stone-900/30" />
      </section>

      {/* ── Cultural Etiquette ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
            Cultural Etiquette
          </h2>
          <p className="text-sm uppercase tracking-widest text-amber-700 font-medium mb-8">
            Visitors Please Note
          </p>
          <p className="text-lg text-stone-700 leading-relaxed mb-8">
            Visitors are warmly welcome. However, Ovia Osese is a cultural
            event, not a carnival. Guests are kindly encouraged to:
          </p>

          <ul className="space-y-4 mb-10">
            {etiquetteItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-lg text-stone-700"
              >
                <span className="mt-1.5 w-2.5 h-2.5 bg-amber-700 rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-lg text-stone-600 italic">
            Respect for tradition ensures everyone enjoys the experience.
          </p>
        </div>
      </section>
    </div>
  );
}
