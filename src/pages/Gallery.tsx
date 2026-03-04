import { Camera } from "lucide-react";

interface GallerySection {
  title: string;
  description: string;
  images: { id: number; url: string; title: string }[];
}

const sections: GallerySection[] = [
  {
    title: "Past Festivals",
    description:
      "Highlights from previous Ovia Osese celebrations — the colours, joy, and communal spirit.",
    images: [
      {
        id: 1,
        url: "/images/hero-festival.png",
        title: "Cultural Dance Celebration",
      },
      {
        id: 2,
        url: "/images/maiden-procession.png",
        title: "Traditional Maiden Procession",
      },
      {
        id: 3,
        url: "/images/traditional-music.png",
        title: "Festival Musicians",
      },
      { id: 4, url: "/images/elders-council.png", title: "Elders in Council" },
    ],
  },
  {
    title: "Ogori — Our Home",
    description: "The landscape, the community, the place we call home.",
    images: [
      {
        id: 5,
        url: "/images/ogori-village.png",
        title: "Ogori Village — Kogi State",
      },
      { id: 6, url: "/images/family-reunion.png", title: "Family Reunion" },
    ],
  },
];

export default function Gallery() {
  return (
    <div className="flex flex-col">
      {/* ── Header with Image ── */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-festival.png"
            alt="Vibrant cultural festival scene in Ogori"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            Glimpses of past Ovia Osese festivals — capturing the vibrant
            colours, joy, and cultural richness of our heritage.
          </p>
        </div>
      </section>

      {/* ── Gallery Sections ── */}
      {sections.map((section, idx) => (
        <section
          key={section.title}
          className={`py-20 ${idx % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-3">
              {section.title}
            </h2>
            <p className="text-stone-600 mb-10 max-w-xl">
              {section.description}
            </p>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {section.images.map((image) => (
                <div
                  key={image.id}
                  className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm bg-stone-200 cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6">
                      <h3 className="text-white text-lg font-medium">
                        {image.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Submit Photos CTA ── */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="w-12 h-12 text-amber-400 mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Share Your Memories
          </h2>
          <p className="text-stone-300 text-lg mb-8 max-w-lg mx-auto">
            We encourage community members to submit photos from past and
            upcoming festivals. Help us build a visual archive of our rich
            heritage.
          </p>
          <a
            href="mailto:info@oviaosese.ng?subject=Photo%20Submission"
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-8 py-4 rounded-md text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Submit Your Photos
          </a>
        </div>
      </section>
    </div>
  );
}
