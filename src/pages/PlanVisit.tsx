import { MapPin, Hotel, Backpack, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: MapPin,
    title: "Getting to Ogori",
    items: [
      "By Air: Fly into Abuja (ABV) — approx. 3–4 hours drive to Ogori.",
      "By Road: Accessible from Lokoja, Okene, and major routes in Kogi State.",
      "Shared transport and charter options available closer to festival dates.",
    ],
  },
  {
    icon: Hotel,
    title: "Accommodation",
    items: [
      "Guest houses and private lodgings are available in Ogori and nearby towns.",
      "Families often host returning relatives.",
      "The organising committee can provide guidance — indicate need on the registration form.",
    ],
  },
  {
    icon: Backpack,
    title: "What to Bring",
    items: [
      "Comfortable clothing for warm weather.",
      "Traditional attire (if you have it) for cultural ceremonies.",
      "Personal toiletries and medications.",
      "A camera or phone to capture memories.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Safety",
    items: [
      "Ogori is a peaceful and welcoming community.",
      "Security measures will be in place throughout the week.",
      "Emergency contacts and local information will be shared with registered visitors.",
    ],
  },
];

export default function PlanVisit() {
  return (
    <div className="flex flex-col">
      {/* ── Header with Image ── */}
      <section className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/ogori-village.png"
            alt="Scenic view of Ogori village"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Plan Your Visit
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            Everything you need to prepare for your trip to Ogori.
          </p>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map(({ icon: Icon, title, items }) => (
              <div
                key={title}
                className="bg-stone-50 border border-stone-200 rounded-2xl p-8 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    {title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-stone-700"
                    >
                      <span className="mt-2 w-1.5 h-1.5 bg-amber-700 rounded-full flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Divider ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="/images/family-reunion.png"
          alt="Families reuniting at a cultural festival"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-stone-900/30" />
      </section>
    </div>
  );
}
