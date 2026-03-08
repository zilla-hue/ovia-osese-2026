import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Users } from "lucide-react";

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  country: z.string().min(2, "Country / location is required"),
  areaOfInterest: z.string().min(1, "Please select an area of interest"),
  availability: z.string().min(1, "Please select your availability"),
  message: z.string().optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

const inputClass =
  "w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-wine-500 focus:border-wine-500 bg-white text-stone-900";
const labelClass = "block text-sm font-medium text-stone-700 mb-1";
const errorClass = "mt-1 text-sm text-red-600";

const areasOfInterest = [
  { value: "event_management", label: "Event Management & Logistics" },
  { value: "cultural_documentation", label: "Cultural Documentation & Photography" },
  { value: "security_crowd", label: "Security & Crowd Management" },
  { value: "medical_support", label: "Medical & First Aid Support" },
  { value: "technical_it", label: "Technical / IT Support" },
  { value: "hospitality", label: "Hospitality & Guest Relations" },
  { value: "media_communications", label: "Media & Communications" },
  { value: "general_support", label: "General Support" },
];

const availabilityOptions = [
  { value: "full_festival", label: "Full Festival (April 12–18, 2026)" },
  { value: "weekdays", label: "Weekdays Only" },
  { value: "weekends", label: "Weekends Only" },
  { value: "remote", label: "Remote Volunteering (pre-festival)" },
  { value: "flexible", label: "Flexible — happy to discuss" },
];

export default function Volunteer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit application");
      }
      setSubmitSuccess(true);
      reset();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-royal-700">
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/60 to-royal-700/40" />
        <div className="relative z-10 text-center px-4">
          <Users className="w-12 h-12 text-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Volunteer with Us
          </h1>
          <p className="text-base md:text-lg text-stone-200 max-w-2xl mx-auto">
            Be part of the team that makes Ovia Osese 2026 unforgettable.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-stone-700 leading-relaxed mb-10">
            Volunteers are the heartbeat of Ovia Osese. Whether you are an
            indigene returning home or a friend of Ogori eager to serve, your
            time and talent are invaluable. Fill in the form below and our team
            will be in touch.
          </p>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200">
            {submitSuccess ? (
              /* ── Success Screen ── */
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                  Application Received!
                </h3>
                <p className="text-lg text-stone-600 max-w-md mx-auto mb-8">
                  Thank you for offering to volunteer at Ovia Osese 2026. Our
                  volunteer coordinator will be in touch with you soon to
                  discuss your role and next steps.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="text-wine-600 font-medium hover:underline"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              /* ── Volunteer Form ── */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register("fullName")}
                      className={inputClass}
                    />
                    {errors.fullName && (
                      <p className={errorClass}>{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className={errorClass}>{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className={inputClass}
                      placeholder="+234…"
                    />
                    {errors.phone && (
                      <p className={errorClass}>{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="md:col-span-2">
                    <label htmlFor="country" className={labelClass}>
                      Country / Location
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register("country")}
                      className={inputClass}
                      placeholder="e.g. Nigeria, United Kingdom…"
                    />
                    {errors.country && (
                      <p className={errorClass}>{errors.country.message}</p>
                    )}
                  </div>

                  {/* Area of Interest */}
                  <div className="md:col-span-2">
                    <label htmlFor="areaOfInterest" className={labelClass}>
                      Area of Interest
                    </label>
                    <select
                      id="areaOfInterest"
                      {...register("areaOfInterest")}
                      className={inputClass}
                    >
                      <option value="">Select an area…</option>
                      {areasOfInterest.map((area) => (
                        <option key={area.value} value={area.value}>
                          {area.label}
                        </option>
                      ))}
                    </select>
                    {errors.areaOfInterest && (
                      <p className={errorClass}>
                        {errors.areaOfInterest.message}
                      </p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="md:col-span-2">
                    <label htmlFor="availability" className={labelClass}>
                      Availability
                    </label>
                    <select
                      id="availability"
                      {...register("availability")}
                      className={inputClass}
                    >
                      <option value="">Select availability…</option>
                      {availabilityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.availability && (
                      <p className={errorClass}>{errors.availability.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label htmlFor="message" className={labelClass}>
                      Additional Notes{" "}
                      <span className="text-stone-400">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={4}
                      className={inputClass}
                      placeholder="Tell us about your skills, experience, or anything else we should know…"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-wine-600 hover:bg-wine-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wine-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Submitting…" : "Submit Volunteer Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
