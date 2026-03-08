import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Users,
  UserCheck,
  TrendingUp,
  RefreshCw,
  LogOut,
  MessageSquare,
} from "lucide-react";

const ADMIN_TOKEN_KEY = "ovia-admin-token";

// ── Types ─────────────────────────────────────────────────────────────────────

type Stats = {
  totalVisitors: number;
  totalDonations: number;
  totalAmount: number;
  totalVolunteers: number;
  totalMessages: number;
  pendingVolunteers: number;
};

type Donation = {
  id: number;
  donorName: string;
  email: string;
  amount: number;
  donationType: string;
  paymentStatus: string;
  paymentReference: string;
  message: string | null;
  createdAt: string;
};

type Volunteer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  areaOfInterest: string;
  availability: string;
  message: string | null;
  status: string;
  createdAt: string;
};

type Registration = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  participationInterest: string;
  status: string;
  createdAt: string;
};

// ── Display maps ──────────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  event_management: "Event Management",
  cultural_documentation: "Cultural Documentation",
  security_crowd: "Security & Crowd",
  medical_support: "Medical Support",
  technical_it: "Technical / IT",
  hospitality: "Hospitality",
  media_communications: "Media & Comms",
  general_support: "General Support",
};

const AVAIL_LABELS: Record<string, string> = {
  full_festival: "Full Festival",
  weekdays: "Weekdays",
  weekends: "Weekends",
  remote: "Remote",
  flexible: "Flexible",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    contacted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    unread: "bg-yellow-100 text-yellow-800",
    read: "bg-stone-100 text-stone-500",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        colorMap[status] ?? "bg-stone-100 text-stone-500"
      }`}
    >
      {status}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? ""
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "donations" | "volunteers" | "registrations"
  >("donations");

  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [volunteerFilter, setVolunteerFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats", { headers: authHeaders() });
    if (res.ok) setStats((await res.json()).data);
  }, [authHeaders]);

  const fetchDonations = useCallback(async () => {
    const res = await fetch("/api/donations", { headers: authHeaders() });
    if (res.ok) setDonations((await res.json()).data);
  }, [authHeaders]);

  const fetchVolunteers = useCallback(
    async (filter = volunteerFilter) => {
      const url =
        filter !== "all"
          ? `/api/volunteers?status=${filter}`
          : "/api/volunteers";
      const res = await fetch(url, { headers: authHeaders() });
      if (res.ok) setVolunteers((await res.json()).data);
    },
    [authHeaders, volunteerFilter]
  );

  const fetchRegistrations = useCallback(async () => {
    const res = await fetch("/api/admin/registrations", { headers: authHeaders() });
    if (res.ok) setRegistrations((await res.json()).data);
  }, [authHeaders]);

  // Initial load
  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    Promise.all([
      fetchStats(),
      fetchDonations(),
      fetchVolunteers(),
      fetchRegistrations(),
    ]).finally(() => setIsLoading(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volunteer filter change
  useEffect(() => {
    if (token) fetchVolunteers(volunteerFilter);
  }, [volunteerFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, password);
        setToken(password);
      } else {
        setLoginError("Incorrect password. Please try again.");
      }
    } catch {
      setLoginError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setPassword("");
  };

  const handleRefresh = () => {
    fetchStats();
    if (activeTab === "donations") fetchDonations();
    if (activeTab === "volunteers") fetchVolunteers();
    if (activeTab === "registrations") fetchRegistrations();
  };

  const updateDonationStatus = async (id: number, paymentStatus: string) => {
    try {
      await fetch(`/api/donations/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ paymentStatus }),
      });
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, paymentStatus } : d))
      );
    } catch {
      // silent — table will show stale value; user can refresh
    }
  };

  const updateVolunteerStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/volunteers/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v))
      );
    } catch {
      // silent
    }
  };

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-1 text-center">
            Admin Dashboard
          </h1>
          <p className="text-sm text-stone-500 text-center mb-8">
            Ovia Osese 2026
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {loginError}
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-wine-500 focus:border-wine-500 bg-white text-stone-900"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-md bg-wine-600 text-white font-medium hover:bg-wine-700 disabled:opacity-50 transition-colors"
            >
              {isLoggingIn ? "Verifying…" : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <div className="bg-royal-700 text-white px-6 py-3 flex justify-between items-center">
        <span className="font-serif font-bold text-lg">Ovia Osese Admin</span>
        <div className="flex items-center gap-4 text-sm text-stone-300">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Registrations",
                value: stats.totalVisitors,
                icon: UserCheck,
                color: "text-royal-600",
              },
              {
                label: "Donations",
                value: stats.totalDonations,
                icon: Heart,
                color: "text-wine-600",
              },
              {
                label: "Total Raised",
                value: `₦${stats.totalAmount.toLocaleString()}`,
                icon: TrendingUp,
                color: "text-green-700",
              },
              {
                label: "Volunteers",
                value: stats.totalVolunteers,
                icon: Users,
                color: "text-stone-700",
              },
              {
                label: "Messages",
                value: stats.totalMessages,
                icon: MessageSquare,
                color: "text-stone-500",
              },
              {
                label: "Pending Volunteers",
                value: stats.pendingVolunteers,
                icon: Users,
                color: "text-yellow-600",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-stone-200 p-5"
              >
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="text-2xl font-bold text-stone-900">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-6">
          {(
            [
              { key: "donations", label: "Donations" },
              { key: "volunteers", label: "Volunteers" },
              { key: "registrations", label: "Registrations" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === key
                  ? "border-wine-600 text-wine-600"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-stone-400">Loading…</div>
        ) : (
          <>
            {/* ── Donations tab ── */}
            {activeTab === "donations" && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-left">
                      <th className="px-4 py-3 font-semibold text-stone-600">Donor</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Amount</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Type</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Reference</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Date</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-stone-400">
                          No donations yet.
                        </td>
                      </tr>
                    ) : (
                      donations.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-stone-900">{d.donorName}</p>
                            <p className="text-xs text-stone-400">{d.email}</p>
                          </td>
                          <td className="px-4 py-3 font-semibold text-stone-900">
                            ₦{d.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 capitalize text-stone-600">
                            {d.donationType}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-stone-500">
                            {d.paymentReference}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={d.paymentStatus} />
                          </td>
                          <td className="px-4 py-3 text-stone-400 text-xs">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={d.paymentStatus}
                              onChange={(e) =>
                                updateDonationStatus(d.id, e.target.value)
                              }
                              className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:ring-wine-500 focus:border-wine-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Volunteers tab ── */}
            {activeTab === "volunteers" && (
              <div>
                {/* Filter */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-medium text-stone-600">
                    Filter by status:
                  </label>
                  <select
                    value={volunteerFilter}
                    onChange={(e) => setVolunteerFilter(e.target.value)}
                    className="text-sm border border-stone-300 rounded-md px-3 py-2 bg-white focus:ring-wine-500 focus:border-wine-500"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <th className="px-4 py-3 font-semibold text-stone-600">Name</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Contact</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Country</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Area</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Availability</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Status</th>
                        <th className="px-4 py-3 font-semibold text-stone-600">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-stone-400">
                            No volunteers found.
                          </td>
                        </tr>
                      ) : (
                        volunteers.map((v) => (
                          <tr
                            key={v.id}
                            className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-stone-900">
                              {v.fullName}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-stone-700">{v.email}</p>
                              <p className="text-xs text-stone-400">{v.phone}</p>
                            </td>
                            <td className="px-4 py-3 text-stone-600">{v.country}</td>
                            <td className="px-4 py-3 text-stone-600">
                              {AREA_LABELS[v.areaOfInterest] ?? v.areaOfInterest}
                            </td>
                            <td className="px-4 py-3 text-stone-600">
                              {AVAIL_LABELS[v.availability] ?? v.availability}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={v.status} />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={v.status}
                                onChange={(e) =>
                                  updateVolunteerStatus(v.id, e.target.value)
                                }
                                className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:ring-wine-500 focus:border-wine-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="approved">Approved</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Registrations tab ── */}
            {activeTab === "registrations" && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-left">
                      <th className="px-4 py-3 font-semibold text-stone-600">Name</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Email</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Phone</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Country</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Interests</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-stone-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-stone-400">
                          No registrations yet.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-stone-900">
                            {r.fullName}
                          </td>
                          <td className="px-4 py-3 text-stone-600">{r.email}</td>
                          <td className="px-4 py-3 text-stone-600">{r.phone}</td>
                          <td className="px-4 py-3 text-stone-600">{r.country}</td>
                          <td className="px-4 py-3 text-stone-500 text-xs">
                            {r.participationInterest}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-4 py-3 text-stone-400 text-xs">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
