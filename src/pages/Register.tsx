import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle } from "lucide-react";

const registerSchema = z.object({
  // Section A — Visitor Details
  fullName: z.string().min(2, "Full name is required"),
  country: z.string().min(2, "Country of residence is required"),
  state: z.string().optional(),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  indigene: z.string().min(1, "Please select an option"),

  // Section B — Travel Plans
  planningToAttend: z.string().min(1, "Please select an option"),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
  groupSize: z.string().min(1, "Please select group size"),

  // Section C — Accommodation
  accommodation: z.string().min(1, "Please select an option"),
  accommodationHelp: z.string().min(1, "Please select an option"),

  // Section D — Participation
  interests: z.array(z.string()).min(1, "Please select at least one interest"),

  // Section E — Communication
  receiveUpdates: z.string().min(1, "Please select an option"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  "w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-900";
const labelClass = "block text-sm font-medium text-stone-700 mb-1";
const errorClass = "mt-1 text-sm text-red-600";

const participationOptions = [
  { value: "cultural", label: "Cultural participation" },
  { value: "volunteering", label: "Volunteering" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "business", label: "Business / Trade opportunities" },
  { value: "attending", label: "Just attending" },
];

function SectionHeader({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="border-t-2 border-amber-200 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {letter}
        </span>
        <h3 className="text-xl font-serif font-bold text-stone-900">{title}</h3>
      </div>
    </div>
  );
}

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { interests: [] },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to register");
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError(
        "An error occurred while submitting your registration. Please try again later.",
      );
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
            src="/images/maiden-procession.png"
            alt="Traditional ceremonial procession in Ogori"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Attendance &amp; Travel Registration
          </h1>
          <p className="text-base md:text-lg text-stone-200 max-w-2xl mx-auto">
            Ovia Osese 2026
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <p className="text-lg text-stone-700 leading-relaxed mb-10">
            We look forward to welcoming you to Ovia Osese 2026. This form helps
            the organising committee prepare adequately for visitors and
            returning families. It also enables us to share important travel and
            safety information with you.
          </p>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200">
            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                  Thank you for registering for Ovia Osese 2026.
                </h3>
                <p className="text-lg text-stone-600 max-w-md mx-auto mb-8">
                  We look forward to welcoming you home. Important festival
                  information and updates will be shared with you as
                  preparations continue.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="text-amber-700 font-medium hover:underline"
                >
                  Register another person
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {submitError}
                  </div>
                )}

                {/* ─── Section A — Visitor Details ─── */}
                <SectionHeader letter="A" title="Visitor Details" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <label htmlFor="country" className={labelClass}>
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register("country")}
                      className={inputClass}
                    />
                    {errors.country && (
                      <p className={errorClass}>{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className={labelClass}>
                      State{" "}
                      <span className="text-stone-400">
                        (if within Nigeria)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      {...register("state")}
                      className={inputClass}
                    />
                  </div>

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

                  <div className="md:col-span-2">
                    <label htmlFor="indigene" className={labelClass}>
                      Are you an indigene of Ogori?
                    </label>
                    <select
                      id="indigene"
                      {...register("indigene")}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="friend">Friend of Ogori</option>
                    </select>
                    {errors.indigene && (
                      <p className={errorClass}>{errors.indigene.message}</p>
                    )}
                  </div>
                </div>

                {/* ─── Section B — Travel Plans ─── */}
                <SectionHeader letter="B" title="Travel Plans" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="planningToAttend" className={labelClass}>
                      Are you planning to attend Ovia Osese 2026?
                    </label>
                    <select
                      id="planningToAttend"
                      {...register("planningToAttend")}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="maybe">Maybe</option>
                    </select>
                    {errors.planningToAttend && (
                      <p className={errorClass}>
                        {errors.planningToAttend.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="arrivalDate" className={labelClass}>
                      Expected Arrival Date
                    </label>
                    <input
                      type="date"
                      id="arrivalDate"
                      {...register("arrivalDate")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="departureDate" className={labelClass}>
                      Expected Departure Date
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      {...register("departureDate")}
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="groupSize" className={labelClass}>
                      Number of people travelling with you
                    </label>
                    <select
                      id="groupSize"
                      {...register("groupSize")}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      <option value="1">1 (just me)</option>
                      <option value="2-5">2 – 5</option>
                      <option value="6+">6+</option>
                    </select>
                    {errors.groupSize && (
                      <p className={errorClass}>{errors.groupSize.message}</p>
                    )}
                  </div>
                </div>

                {/* ─── Section C — Accommodation ─── */}
                <SectionHeader letter="C" title="Accommodation" />

                <div className="space-y-6">
                  <div>
                    <label htmlFor="accommodation" className={labelClass}>
                      Where will you stay?
                    </label>
                    <select
                      id="accommodation"
                      {...register("accommodation")}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      <option value="family_home">Family home</option>
                      <option value="guest_house">Guest house</option>
                      <option value="nearby_town">Nearby town</option>
                      <option value="not_arranged">Not yet arranged</option>
                    </select>
                    {errors.accommodation && (
                      <p className={errorClass}>
                        {errors.accommodation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="accommodationHelp" className={labelClass}>
                      Would you like assistance with accommodation information?
                    </label>
                    <select
                      id="accommodationHelp"
                      {...register("accommodationHelp")}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.accommodationHelp && (
                      <p className={errorClass}>
                        {errors.accommodationHelp.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ─── Section D — Participation ─── */}
                <SectionHeader letter="D" title="Participation" />

                <fieldset>
                  <legend className={`${labelClass} mb-3`}>
                    Are you interested in:{" "}
                    <span className="text-stone-400">
                      (select all that apply)
                    </span>
                  </legend>
                  <div className="space-y-3">
                    {participationOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          value={opt.value}
                          {...register("interests")}
                          className="w-5 h-5 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
                        />
                        <span className="text-stone-700 group-hover:text-stone-900 transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className={errorClass}>{errors.interests.message}</p>
                  )}
                </fieldset>

                {/* ─── Section E — Communication ─── */}
                <SectionHeader letter="E" title="Communication" />

                <div>
                  <label htmlFor="receiveUpdates" className={labelClass}>
                    Would you like to receive festival updates via WhatsApp or
                    email?
                  </label>
                  <select
                    id="receiveUpdates"
                    {...register("receiveUpdates")}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.receiveUpdates && (
                    <p className={errorClass}>
                      {errors.receiveUpdates.message}
                    </p>
                  )}
                </div>

                {/* ─── Submit ─── */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Submitting…" : "Complete Registration"}
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
