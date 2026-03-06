import { Camera } from "lucide-react";

interface GallerySection {
  title: string;
  description: string;
  images: { id: number; src: string; alt: string; category: string }[];
}

const sections: GallerySection[] = [
  {
    title: "Festival Highlights",
    description:
      "Capturing the essence of Ovia Osese — the vibrant culture, communal spirit, and timeless traditions.",
    images: [
      {
        id: 1,
        src: "/images/hero-festival.png",
        alt: "Maidens draped in rich festival beads",
        category: "Maidens",
      },
      {
        id: 2,
        src: "/images/elders-council.png",
        alt: "Elders performing the traditional rites",
        category: "Culture",
      },
      {
        id: 3,
        src: "/images/family-reunion.png",
        alt: "Community gathering and celebration",
        category: "Community",
      },
      {
        id: 4,
        src: "/images/traditional-music.png",
        alt: "Traditional drums and music performance",
        category: "Ceremony",
      },
      {
        id: 5,
        src: "/images/maiden-procession.png",
        alt: "The main procession of maidens",
        category: "Maidens",
      },
      {
        id: 6,
        src: "/images/ogori-village.png",
        alt: "Generational gathering in Ogori",
        category: "Community",
      },
    ],
  },
  {
    title: "Community & Celebration",
    description:
      "A deeper look into the faces and moments that make Ovia Osese truly special.",
    images: [
      {
        id: 7,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.00 (1).jpeg",
        alt: "Community Celebration",
        category: "Community",
      },
      {
        id: 8,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.00 (2).jpeg",
        alt: "Festival Traditions",
        category: "Culture",
      },
      {
        id: 9,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.01 (1).jpeg",
        alt: "Joyful Moments",
        category: "Community",
      },
      {
        id: 10,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.01 (2).jpeg",
        alt: "Cultural Attire",
        category: "Maidens",
      },
      {
        id: 11,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.02 (1).jpeg",
        alt: "Shared Heritage",
        category: "Community",
      },
      {
        id: 12,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.03 (1).jpeg",
        alt: "Vibrant Colors",
        category: "Culture",
      },
      {
        id: 13,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.04 (5).jpeg",
        alt: "Generations Together",
        category: "Community",
      },
      {
        id: 14,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.05 (1).jpeg",
        alt: "Traditional Dance",
        category: "Ceremony",
      },
      {
        id: 15,
        src: "/images/WhatsApp Image 2026-03-04 at 13.46.07 (2).jpeg",
        alt: "Local Festivities",
        category: "Ceremony",
      },
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
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/40 to-royal-700/20" />
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
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6">
                      <h3 className="text-white text-lg font-medium">
                        {image.alt}
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
      <section className="py-20 bg-royal-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="w-12 h-12 text-gold mx-auto mb-5" />
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
            className="inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-500 text-white px-8 py-4 rounded-md text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Submit Your Photos
          </a>
        </div>
      </section>
    </div>
  );
}
