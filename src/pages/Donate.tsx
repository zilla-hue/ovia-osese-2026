import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Heart, Loader2, Landmark, Copy, Check } from "lucide-react";

// ── Paystack integration is temporarily disabled. ─────────────────────────────
// To restore: revert this file from git history or the "paystack-backup" tag.
// The Paystack type declarations, script loader, popup flow, and verify callback
// have been removed from this file but preserved in the backend verify route
// (lib/app.ts) and the VITE_PAYSTACK_PUBLIC_KEY env var.

// ── Bank transfer details ────────────────────────────────────────────────────

const BANK_ACCOUNTS = [
  {
    label: "Naira Account",
    accountName: "Ogori Descendants Union",
    accountNumber: "1028075458",
    bank: "United Bank for Africa",
  },
  {
    label: "Domiciliary Account",
    accountName: "Ogori Descendants Union",
    accountNumber: "3004759118",
    bank: "United Bank for Africa",
  },
] as const;

// ── Constants ─────────────────────────────────────────────────────────────────

const PREDEFINED_AMOUNTS = [5_000, 10_000, 25_000, 50_000];

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

// ── Copy-to-clipboard helper ─────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can still copy manually */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 inline-flex items-center text-stone-400 hover:text-wine-600 transition-colors"
      aria-label={`Copy ${text}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Donate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

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
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount: parseFloat(data.amount) }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to record donation");
      }

      const { reference: ref } = result as { reference: string };
      setPaidAmount(parseFloat(data.amount));
      setReference(ref);
      setSubmitSuccess(true);
      reset();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
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

          {/* ── Bank Transfer Details ── */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Landmark className="w-6 h-6 text-wine-600" />
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Bank Transfer Payment Details
              </h2>
            </div>

            <p className="text-stone-600 mb-6">
              Please make payment using one of the account details below and
              send proof of payment for confirmation.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {BANK_ACCOUNTS.map((account) => (
                <div
                  key={account.accountNumber}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-wine-600 mb-3">
                    {account.label}
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-stone-400">Account Name</dt>
                      <dd className="font-medium text-stone-800">
                        {account.accountName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">Account Number</dt>
                      <dd className="font-mono font-bold text-stone-900 flex items-center">
                        {account.accountNumber}
                        <CopyButton text={account.accountNumber} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">Bank</dt>
                      <dd className="font-medium text-stone-800">
                        {account.bank}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          {/* ── Donation form (records intent, no online payment) ── */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200">

            {/* ── Success screen ── */}
            {submitSuccess && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  Donation Recorded — Awaiting Payment Confirmation
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-4">
                  ₦{paidAmount.toLocaleString()}
                </p>
                <p className="text-stone-600 mb-6 max-w-md mx-auto">
                  Thank you! Please complete your bank transfer using the
                  account details above and send your proof of payment. Your
                  donation will be confirmed once we verify receipt.
                </p>

                <div className="bg-stone-50 border border-stone-200 rounded-lg px-6 py-4 inline-block mb-8">
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                    Reference Number
                  </p>
                  <p className="font-mono font-bold text-stone-700 tracking-wider">
                    {reference}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Please include this reference in your transfer narration.
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
            {!submitSuccess && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Register Your Donation
                </h3>
                <p className="text-sm text-stone-500 -mt-4">
                  Fill in the form below so we can match your bank transfer to
                  your donation record.
                </p>

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
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-wine-600 hover:bg-wine-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wine-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? "Submitting…" : "Submit Donation"}
                  </button>
                  <p className="text-xs text-stone-400 text-center mt-3">
                    After submitting, please complete your bank transfer and
                    send proof of payment. Your donation status will show as
                    "Awaiting Payment Confirmation" until verified.
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
