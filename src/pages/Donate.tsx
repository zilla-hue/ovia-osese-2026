import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Heart, Loader2 } from "lucide-react";

// ── Paystack inline popup type declaration ────────────────────────────────────
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number; // kobo
        currency?: string;
        ref: string;
        label?: string;
        metadata?: {
          custom_fields?: {
            display_name: string;
            variable_name: string;
            value: string;
          }[];
        };
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PREDEFINED_AMOUNTS = [5_000, 10_000, 25_000, 50_000];

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

// ── Form schema ───────────────────────────────────────────────────────────────

const donationSchema = z.object({
  donorName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  amount: z
    .string()
    .min(1, "Please select or enter a donation amount")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 100, {
      message: "Minimum donation amount is ₦100",
    }),
  donationType: z.enum(["one-time", "recurring"]),
  message: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

// ── Shared style constants ────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-wine-500 focus:border-wine-500 bg-white text-stone-900";
const labelClass = "block text-sm font-medium text-stone-700 mb-1";
const errorClass = "mt-1 text-sm text-red-600";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Donate() {
  const [paystackReady, setPaystackReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  // Load Paystack inline script once on mount
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () =>
      console.warn("Paystack inline script failed to load.");
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { donationType: "one-time", amount: "" },
  });

  const watchedAmount = watch("amount");

  const { onChange: onAmountChange, ...amountRegisterProps } = register("amount");

  const handlePresetSelect = (amount: number) => {
    setValue("amount", String(amount), { shouldValidate: true });
  };

  const onSubmit = async (data: DonationFormValues) => {
    setSubmitError("");

    // Guard: Paystack key required
    if (!PAYSTACK_PUBLIC_KEY) {
      setSubmitError(
        "Online payment is not configured. Please contact the festival team."
      );
      return;
    }

    // Guard: Paystack script must be loaded
    if (!paystackReady || !window.PaystackPop) {
      setSubmitError(
        "Payment system is still loading. Please wait a moment and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create pending donation record → receive reference
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount: parseFloat(data.amount) }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to initialise donation");
      }

      const { reference: ref } = result as { reference: string };
      const amountNgn = parseFloat(data.amount);

      setIsSubmitting(false);

      // Step 2: Open Paystack popup
      const handler = window.PaystackPop!.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount: Math.round(amountNgn * 100), // Paystack requires kobo
        currency: "NGN",
        ref,
        label: data.donorName,
        metadata: {
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: data.donorName,
            },
            ...(data.message
              ? [
                  {
                    display_name: "Message",
                    variable_name: "message",
                    value: data.message,
                  },
                ]
              : []),
          ],
        },

        // Step 3: Paystack calls this after a successful payment.
        // Must be a regular (non-async) function — Paystack v1 inline.js
        // validates with typeof, which can fail for async functions in some runtimes.
        callback: (paystackResponse: { reference: string }) => {
          setIsVerifying(true);
          fetch(`/api/donations/verify/${paystackResponse.reference}`)
            .then((r) => r.json())
            .then((verifyData: { success: boolean; status: string; reference: string }) => {
              if (verifyData.success && verifyData.status === "success") {
                setPaidAmount(amountNgn);
                setReference(paystackResponse.reference);
                setSubmitSuccess(true);
                reset();
              } else {
                setSubmitError(
                  `Payment completed but verification is pending. ` +
                    `Please quote reference ${paystackResponse.reference} ` +
                    `if you need assistance.`
                );
              }
            })
            .catch(() => {
              setSubmitError(
                `Verification failed. Please contact us with reference: ${paystackResponse.reference}`
              );
            })
            .finally(() => {
              setIsVerifying(false);
            });
        },

        // User closed the popup without paying — let them try again quietly
        onClose: () => {},
      });

      handler.openIframe();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleDonateAgain = () => {
    setSubmitSuccess(false);
    setReference("");
    setPaidAmount(0);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-royal-700">
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-royal-700/90 via-royal-700/60 to-royal-700/40" />
        <div className="relative z-10 text-center px-4">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Support Ovia Osese
          </h1>
          <p className="text-base md:text-lg text-stone-200 max-w-2xl mx-auto">
            Your generosity keeps our culture alive for generations to come.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-stone-700 leading-relaxed mb-10">
            Your donation directly supports the preservation of Ogori cultural
            heritage, enables festival infrastructure, and creates meaningful
            experiences for our community. Every contribution — large or small —
            makes a difference.
          </p>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200">

            {/* ── Verifying overlay ── */}
            {isVerifying && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-wine-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-stone-700">
                  Verifying your payment…
                </p>
                <p className="text-sm text-stone-400 mt-1">Please do not close this page.</p>
              </div>
            )}

            {/* ── Success screen ── */}
            {!isVerifying && submitSuccess && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  Payment Confirmed!
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-4">
                  ₦{paidAmount.toLocaleString()}
                </p>
                <p className="text-stone-600 mb-6 max-w-md mx-auto">
                  Thank you for your generosity. Your contribution will help
                  preserve the heritage and culture of the Ogori people at
                  Ovia Osese 2026.
                </p>

                <div className="bg-stone-50 border border-stone-200 rounded-lg px-6 py-4 inline-block mb-8">
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                    Transaction Reference
                  </p>
                  <p className="font-mono font-bold text-stone-700 tracking-wider">
                    {reference}
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleDonateAgain}
                    className="text-wine-600 font-medium hover:underline"
                  >
                    Make another donation
                  </button>
                </div>
              </div>
            )}

            {/* ── Donation form ── */}
            {!isVerifying && !submitSuccess && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {submitError}
                  </div>
                )}

                {/* Donation Type */}
                <div>
                  <label className={labelClass}>Donation Type</label>
                  <div className="flex gap-6 mt-1">
                    {(
                      [
                        { value: "one-time", label: "One-time" },
                        { value: "recurring", label: "Monthly (recurring)" },
                      ] as const
                    ).map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={value}
                          {...register("donationType")}
                          className="w-4 h-4 text-wine-600 border-stone-300 focus:ring-wine-500"
                        />
                        <span className="text-stone-700 text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className={labelClass}>Select Amount (NGN)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {PREDEFINED_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handlePresetSelect(amount)}
                        className={`py-3 px-2 rounded-md border-2 font-semibold text-sm transition-all ${
                          watchedAmount === String(amount)
                            ? "border-wine-600 bg-wine-600 text-white"
                            : "border-stone-300 text-stone-700 hover:border-wine-400"
                        }`}
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium select-none">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      placeholder="Or enter a custom amount"
                      className={`${inputClass} pl-9`}
                      {...amountRegisterProps}
                      onChange={(e) => onAmountChange(e)}
                    />
                  </div>

                  {errors.amount && (
                    <p className={errorClass}>{errors.amount.message}</p>
                  )}
                </div>

                {/* Donor details */}
                <div className="border-t border-stone-100 pt-6 space-y-5">
                  <h3 className="text-lg font-semibold text-stone-900">
                    Your Details
                  </h3>

                  <div>
                    <label htmlFor="donorName" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="donorName"
                      {...register("donorName")}
                      className={inputClass}
                    />
                    {errors.donorName && (
                      <p className={errorClass}>{errors.donorName.message}</p>
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

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message{" "}
                      <span className="text-stone-400">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={3}
                      className={inputClass}
                      placeholder="Leave an optional message with your donation…"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paystackReady}
                    className="w-full py-4 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-wine-600 hover:bg-wine-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wine-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting
                      ? "Preparing…"
                      : !paystackReady
                      ? "Loading payment…"
                      : "Donate Now"}
                  </button>
                  <p className="text-xs text-stone-400 text-center mt-3">
                    Payments are processed securely by{" "}
                    <span className="font-medium">Paystack</span>. Card details
                    are never stored on our servers.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
