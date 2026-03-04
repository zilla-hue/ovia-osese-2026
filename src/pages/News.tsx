import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Megaphone, Clock, FileText, Users, MapPin } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
}

const categories = [
  { icon: Megaphone, label: "Announcements" },
  { icon: Clock, label: "Countdown Posts" },
  { icon: FileText, label: "Official Statements" },
  { icon: Users, label: "Committee Updates" },
  { icon: MapPin, label: "Travel Notices" },
];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data.success) {
          setNews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-festival.png"
            alt="Vibrant cultural festival scene"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            News &amp; Updates
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            Your official information source for Ovia Osese 2026.
          </p>
        </div>
      </section>

      {/* ── What this page carries ── */}
      <section className="py-14 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-amber-700" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── News Grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200">
              <Megaphone className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <p className="text-xl text-stone-600 mb-2">
                No news updates available at the moment.
              </p>
              <p className="text-stone-500">
                Check back closer to the festival for announcements, travel
                notices, and committee updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300"
                >
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden bg-stone-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-sm text-amber-700 font-medium mb-2">
                      {format(new Date(item.publishedAt), "MMMM d, yyyy")}
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-stone-600 mb-6 flex-grow line-clamp-3">
                      {item.excerpt}
                    </p>
                    <a
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center text-amber-700 font-medium hover:text-amber-800 mt-auto"
                    >
                      Read more
                      <svg
                        className="ml-1.5 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
