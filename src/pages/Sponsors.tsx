import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Download } from "lucide-react";

const sponsorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  organisation: z.string().min(2, "Organisation is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  interest: z.string().min(1, "Please select an interest"),
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

const tiers = [
  {
    name: "Title Sponsor",
    bg: "bg-wine-50",
    border: "border-wine-200",
    heading: "text-wine-900",
    badge: "bg-wine-600 text-white",
  },
  {
    name: "Gold Sponsor",
    bg: "bg-stone-50",
    border: "border-stone-200",
    heading: "text-stone-900",
    badge: "bg-stone-700 text-white",
  },
  {
    name: "Silver Sponsor",
    bg: "bg-stone-50",
    border: "border-stone-200",
    heading: "text-stone-900",
    badge: "bg-stone-500 text-white",
  },
  {
    name: "Community Partner",
    bg: "bg-stone-50",
    border: "border-stone-200",
    heading: "text-stone-900",
    badge: "bg-stone-400 text-white",
  },
];

const benefits = [
  "Brand visibility",
  "On-site activation",
  "Media exposure",
  "Community goodwill",
];

export default function Sponsors() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
  });

  const onSubmit = async (data: SponsorFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit inquiry");
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-sponsors-gathering.jpg"
            alt="Community gathering at a cultural festival"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/50 to-royal-700/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Sponsors &amp; Partners
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            Partner With Ovia Osese
          </p>
        </div>
      </section>

      {/* ── Why Partner ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-stone-700 leading-relaxed mb-6">
            Ovia Osese offers organisations a unique opportunity to connect with
            a vibrant and engaged community, including residents, returning
            families, professionals, and diaspora visitors.
          </p>
          <p className="text-lg text-stone-700 leading-relaxed mb-10">
            Partnership supports <strong>cultural preservation</strong>,{" "}
            <strong>youth engagement</strong>, and{" "}
            <strong>community development</strong>.
          </p>

          {/* Sponsorship Tiers */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-8">
            Sponsorship Opportunities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`${t.bg} ${t.border} border rounded-xl p-6 text-center`}
              >
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${t.badge}`}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <h3 className="text-xl font-bold text-stone-900 mb-4">
            Benefits include:
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-stone-700">
                <span className="w-2 h-2 bg-wine-600 rounded-full flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <a
            href="/sponsorship-deck.pdf"
            download
            className="inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-500 text-white px-6 py-3 rounded-md text-base font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Sponsorship Deck
          </a>
        </div>
      </section>

      {/* ── Inquiry Form ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center">
            Sponsor Inquiry Form
          </h2>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Inquiry Received</h3>
              <p className="text-lg">
                Thank you for your interest. Our partnership team will contact
                you shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-6 text-wine-600 font-medium hover:underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {submitError}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="organisation"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Organisation
                </label>
                <input
                  type="text"
                  id="organisation"
                  {...register("organisation")}
                  className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
                {errors.organisation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organisation.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Interest
                </label>
                <select
                  id="interest"
                  {...register("interest")}
                  className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  <option value="">Select sponsorship level…</option>
                  <option value="title">Title Sponsor</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="silver">Silver Sponsor</option>
                  <option value="community">Community Partner</option>
                </select>
                {errors.interest && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.interest.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-wine-600 hover:bg-wine-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting…" : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
