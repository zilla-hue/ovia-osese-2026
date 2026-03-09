import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Heart,
  Users,
  UserCheck,
  TrendingUp,
  RefreshCw,
  LogOut,
  MessageSquare,
  Trash2,
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
} from "lucide-react";

const ADMIN_TOKEN_KEY = "ovia-admin-token";
const PAGE_SIZE = 25;

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
  state: string | null;
  indigene: string | null;
  planningToAttend: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  groupSize: string | null;
  accommodation: string | null;
  interests: string | null;
  status: string;
  createdAt: string;
};

type Sponsor = {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  sponsorshipLevel: string;
  message: string | null;
  status: string;
  createdAt: string;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

type TabKey = "donations" | "volunteers" | "registrations" | "sponsors" | "messages";

type TableState = {
  search: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  page: number;
};

type DeleteTarget = { entity: TabKey; id: number; label: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function defaultTableState(): TableState {
  return { search: "", sortKey: "createdAt", sortDir: "desc", page: 0 };
}

function filterAndSort<T extends Record<string, unknown>>(
  rows: T[],
  ts: TableState
): T[] {
  const q = ts.search.toLowerCase().trim();
  let filtered = q
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v ?? "").toLowerCase().includes(q)
        )
      )
    : rows;

  filtered = [...filtered].sort((a, b) => {
    const av = String(a[ts.sortKey] ?? "");
    const bv = String(b[ts.sortKey] ?? "");
    const n = ts.sortDir === "asc" ? 1 : -1;
    return av.localeCompare(bv, undefined, { numeric: true }) * n;
  });

  return filtered;
}

function paginate<T>(rows: T[], page: number): T[] {
  return rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
}

function exportCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv =
    "\uFEFF" + // BOM for Excel UTF-8
    [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join(
      "\r\n"
    );
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => String(v ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html =
    `<html><head><meta charset="utf-8"></head><body><table>` +
    `<thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>` +
    `<tbody>${rows
      .map((r) => `<tr>${headers.map((h) => `<td>${esc(r[h])}</td>`).join("")}</tr>`)
      .join("")}</tbody>` +
    `</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    contacted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    confirmed: "bg-green-100 text-green-800",
    unread: "bg-amber-100 text-amber-800",
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

function SortIcon({
  col,
  state,
}: {
  col: string;
  state: TableState;
}) {
  if (state.sortKey !== col)
    return <span className="opacity-20 ml-1 inline-block">↕</span>;
  return state.sortDir === "asc" ? (
    <ChevronUp size={13} className="ml-0.5 inline-block text-wine-600" />
  ) : (
    <ChevronDown size={13} className="ml-0.5 inline-block text-wine-600" />
  );
}

function Th({
  col,
  label,
  state,
  onSort,
}: {
  col: string;
  label: string;
  state: TableState;
  onSort: (col: string) => void;
}) {
  return (
    <th
      className="px-4 py-3 font-semibold text-stone-600 cursor-pointer select-none hover:text-stone-900 whitespace-nowrap"
      onClick={() => onSort(col)}
    >
      {label}
      <SortIcon col={col} state={state} />
    </th>
  );
}

function TableToolbar({
  state,
  onChange,
  totalFiltered,
  totalAll,
  exportLabel,
  onExportCSV,
  onExportExcel,
  children,
}: {
  state: TableState;
  onChange: (patch: Partial<TableState>) => void;
  totalFiltered: number;
  totalAll: number;
  exportLabel: string;
  onExportCSV: () => void;
  onExportExcel: () => void;
  children?: React.ReactNode;
}) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search…"
            value={state.search}
            onChange={(e) => onChange({ search: e.target.value, page: 0 })}
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:ring-wine-500 focus:border-wine-500"
          />
        </div>

        {children}

        {/* Export */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-300 rounded-md bg-white hover:bg-stone-50 text-stone-700 transition-colors"
          >
            <Download size={13} /> CSV
          </button>
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-300 rounded-md bg-white hover:bg-stone-50 text-stone-700 transition-colors"
          >
            <Download size={13} /> Excel
          </button>
        </div>
      </div>

      {/* Count + Pagination */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {totalFiltered === totalAll
            ? `${totalAll} ${exportLabel}`
            : `${totalFiltered} of ${totalAll} ${exportLabel}`}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              disabled={state.page === 0}
              onClick={() => onChange({ page: state.page - 1 })}
              className="p-1 rounded hover:bg-stone-100 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              {state.page + 1} / {totalPages}
            </span>
            <button
              disabled={state.page >= totalPages - 1}
              onClick={() => onChange({ page: state.page + 1 })}
              className="p-1 rounded hover:bg-stone-100 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Delete"
      className="p-1.5 rounded text-stone-300 hover:text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}

function ConfirmModal({
  target,
  onConfirm,
  onCancel,
}: {
  target: DeleteTarget;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-stone-900">Confirm Delete</h3>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-stone-600 mb-6">
          Permanently delete{" "}
          <strong className="text-stone-900">{target.label}</strong>? This cannot
          be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
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

  const [activeTab, setActiveTab] = useState<TabKey>("donations");

  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState("all");

  // Per-tab table state
  const [ts, setTs] = useState<Record<TabKey, TableState>>({
    donations: defaultTableState(),
    volunteers: defaultTableState(),
    registrations: defaultTableState(),
    sponsors: defaultTableState(),
    messages: defaultTableState(),
  });

  const patchTs = (tab: TabKey, patch: Partial<TableState>) =>
    setTs((prev) => ({ ...prev, [tab]: { ...prev[tab], ...patch } }));

  const sortTab = (tab: TabKey, col: string) =>
    setTs((prev) => {
      const cur = prev[tab];
      return {
        ...prev,
        [tab]: {
          ...cur,
          sortKey: col,
          sortDir: cur.sortKey === col && cur.sortDir === "asc" ? "desc" : "asc",
          page: 0,
        },
      };
    });

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

  const fetchVolunteers = useCallback(async () => {
    const res = await fetch("/api/volunteers", { headers: authHeaders() });
    if (res.ok) setVolunteers((await res.json()).data);
  }, [authHeaders]);

  const fetchRegistrations = useCallback(async () => {
    const res = await fetch("/api/admin/registrations", { headers: authHeaders() });
    if (res.ok) setRegistrations((await res.json()).data);
  }, [authHeaders]);

  const fetchSponsors = useCallback(async () => {
    const res = await fetch("/api/admin/sponsors", { headers: authHeaders() });
    if (res.ok) setSponsors((await res.json()).data);
  }, [authHeaders]);

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/admin/messages", { headers: authHeaders() });
    if (res.ok) setMessages((await res.json()).data);
  }, [authHeaders]);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    Promise.all([
      fetchStats(),
      fetchDonations(),
      fetchVolunteers(),
      fetchRegistrations(),
      fetchSponsors(),
      fetchMessages(),
    ]).finally(() => setIsLoading(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

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
    fetchDonations();
    fetchVolunteers();
    fetchRegistrations();
    fetchSponsors();
    fetchMessages();
  };

  // ── Status updates ─────────────────────────────────────────────────────────

  const updateDonationStatus = async (id: number, paymentStatus: string) => {
    await fetch(`/api/donations/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ paymentStatus }),
    });
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, paymentStatus } : d)));
  };

  const updateVolunteerStatus = async (id: number, status: string) => {
    await fetch(`/api/volunteers/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  const updateSponsorStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/sponsors/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const updateMessageStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    fetchStats();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { entity, id } = deleteTarget;

    const urlMap: Record<TabKey, string> = {
      donations: `/api/donations/${id}`,
      volunteers: `/api/volunteers/${id}`,
      registrations: `/api/admin/registrations/${id}`,
      sponsors: `/api/admin/sponsors/${id}`,
      messages: `/api/admin/messages/${id}`,
    };

    await fetch(urlMap[entity], { method: "DELETE", headers: authHeaders() });

    if (entity === "donations") setDonations((p) => p.filter((r) => r.id !== id));
    if (entity === "volunteers") setVolunteers((p) => p.filter((r) => r.id !== id));
    if (entity === "registrations") setRegistrations((p) => p.filter((r) => r.id !== id));
    if (entity === "sponsors") setSponsors((p) => p.filter((r) => r.id !== id));
    if (entity === "messages") setMessages((p) => p.filter((r) => r.id !== id));

    setDeleteTarget(null);
    fetchStats();
  };

  // ── Filtered/sorted/paginated data ─────────────────────────────────────────

  const filteredDonations = useMemo(
    () => filterAndSort(donations as unknown as Record<string, unknown>[], ts.donations) as unknown as Donation[],
    [donations, ts.donations]
  );
  const filteredVolunteers = useMemo(() => {
    let rows = filterAndSort(
      volunteers as unknown as Record<string, unknown>[],
      ts.volunteers
    ) as unknown as Volunteer[];
    if (volunteerStatusFilter !== "all") {
      rows = rows.filter((v) => v.status === volunteerStatusFilter);
    }
    return rows;
  }, [volunteers, ts.volunteers, volunteerStatusFilter]);
  const filteredRegistrations = useMemo(
    () => filterAndSort(registrations as unknown as Record<string, unknown>[], ts.registrations) as unknown as Registration[],
    [registrations, ts.registrations]
  );
  const filteredSponsors = useMemo(
    () => filterAndSort(sponsors as unknown as Record<string, unknown>[], ts.sponsors) as unknown as Sponsor[],
    [sponsors, ts.sponsors]
  );
  const filteredMessages = useMemo(
    () => filterAndSort(messages as unknown as Record<string, unknown>[], ts.messages) as unknown as Message[],
    [messages, ts.messages]
  );

  const pageDonations = useMemo(
    () => paginate(filteredDonations, ts.donations.page),
    [filteredDonations, ts.donations.page]
  );
  const pageVolunteers = useMemo(
    () => paginate(filteredVolunteers, ts.volunteers.page),
    [filteredVolunteers, ts.volunteers.page]
  );
  const pageRegistrations = useMemo(
    () => paginate(filteredRegistrations, ts.registrations.page),
    [filteredRegistrations, ts.registrations.page]
  );
  const pageSponsors = useMemo(
    () => paginate(filteredSponsors, ts.sponsors.page),
    [filteredSponsors, ts.sponsors.page]
  );
  const pageMessages = useMemo(
    () => paginate(filteredMessages, ts.messages.page),
    [filteredMessages, ts.messages.page]
  );

  // ── Export helpers ──────────────────────────────────────────────────────────

  const doExport = (type: "csv" | "excel", tab: TabKey) => {
    const fn = type === "csv" ? exportCSV : exportExcel;
    const label = `ovia-${tab}-${new Date().toISOString().slice(0, 10)}`;
    if (tab === "donations")
      fn(filteredDonations as unknown as Record<string, unknown>[], label);
    if (tab === "volunteers")
      fn(filteredVolunteers as unknown as Record<string, unknown>[], label);
    if (tab === "registrations")
      fn(filteredRegistrations as unknown as Record<string, unknown>[], label);
    if (tab === "sponsors")
      fn(filteredSponsors as unknown as Record<string, unknown>[], label);
    if (tab === "messages")
      fn(filteredMessages as unknown as Record<string, unknown>[], label);
  };

  // ── Login screen ───────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-1 text-center">
            Admin Dashboard
          </h1>
          <p className="text-sm text-stone-500 text-center mb-8">Ovia Osese 2026</p>

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

  // ── Dashboard ──────────────────────────────────────────────────────────────

  const tabs: { key: TabKey; label: string }[] = [
    { key: "donations", label: `Donations (${donations.length})` },
    { key: "volunteers", label: `Volunteers (${volunteers.length})` },
    { key: "registrations", label: `Registrations (${registrations.length})` },
    { key: "sponsors", label: `Sponsors (${sponsors.length})` },
    { key: "messages", label: `Messages (${messages.length})` },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {deleteTarget && (
        <ConfirmModal
          target={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Registrations", value: stats.totalVisitors, icon: UserCheck, color: "text-royal-600" },
              { label: "Donations", value: stats.totalDonations, icon: Heart, color: "text-wine-600" },
              { label: "Total Raised", value: `₦${stats.totalAmount.toLocaleString()}`, icon: TrendingUp, color: "text-green-700" },
              { label: "Volunteers", value: stats.totalVolunteers, icon: Users, color: "text-stone-700" },
              { label: "Messages", value: stats.totalMessages, icon: MessageSquare, color: "text-stone-500" },
              { label: "Pending Volunteers", value: stats.pendingVolunteers, icon: Users, color: "text-yellow-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-stone-200 p-5">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="text-2xl font-bold text-stone-900">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-6 overflow-x-auto">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
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
            {/* ── Donations ── */}
            {activeTab === "donations" && (
              <div>
                <TableToolbar
                  state={ts.donations}
                  onChange={(p) => patchTs("donations", p)}
                  totalFiltered={filteredDonations.length}
                  totalAll={donations.length}
                  exportLabel="donations"
                  onExportCSV={() => doExport("csv", "donations")}
                  onExportExcel={() => doExport("excel", "donations")}
                />
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <Th col="donorName" label="Donor" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <Th col="amount" label="Amount" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <Th col="donationType" label="Type" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <Th col="paymentReference" label="Reference" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <Th col="paymentStatus" label="Status" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <Th col="createdAt" label="Date" state={ts.donations} onSort={(c) => sortTab("donations", c)} />
                        <th className="px-4 py-3 font-semibold text-stone-600">Update</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pageDonations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-stone-400">
                            No donations found.
                          </td>
                        </tr>
                      ) : (
                        pageDonations.map((d) => (
                          <tr key={d.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-stone-900">{d.donorName}</p>
                              <p className="text-xs text-stone-400">{d.email}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-stone-900">
                              ₦{Number(d.amount).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 capitalize text-stone-600">{d.donationType}</td>
                            <td className="px-4 py-3 font-mono text-xs text-stone-500">{d.paymentReference}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={d.paymentStatus} />
                            </td>
                            <td className="px-4 py-3 text-stone-400 text-xs">{fmt(d.createdAt)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={d.paymentStatus}
                                onChange={(e) => updateDonationStatus(d.id, e.target.value)}
                                className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:ring-wine-500 focus:border-wine-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <DeleteBtn
                                onClick={() =>
                                  setDeleteTarget({ entity: "donations", id: d.id, label: `donation from ${d.donorName}` })
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Volunteers ── */}
            {activeTab === "volunteers" && (
              <div>
                <TableToolbar
                  state={ts.volunteers}
                  onChange={(p) => patchTs("volunteers", p)}
                  totalFiltered={filteredVolunteers.length}
                  totalAll={volunteers.length}
                  exportLabel="volunteers"
                  onExportCSV={() => doExport("csv", "volunteers")}
                  onExportExcel={() => doExport("excel", "volunteers")}
                >
                  <select
                    value={volunteerStatusFilter}
                    onChange={(e) => {
                      setVolunteerStatusFilter(e.target.value);
                      patchTs("volunteers", { page: 0 });
                    }}
                    className="text-sm border border-stone-300 rounded-md px-3 py-2 bg-white focus:ring-wine-500 focus:border-wine-500"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                  </select>
                </TableToolbar>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <Th col="fullName" label="Name" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="email" label="Contact" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="country" label="Country" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="areaOfInterest" label="Area" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="availability" label="Availability" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="status" label="Status" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <Th col="createdAt" label="Date" state={ts.volunteers} onSort={(c) => sortTab("volunteers", c)} />
                        <th className="px-4 py-3 font-semibold text-stone-600">Update</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pageVolunteers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-stone-400">
                            No volunteers found.
                          </td>
                        </tr>
                      ) : (
                        pageVolunteers.map((v) => (
                          <tr key={v.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-stone-900">{v.fullName}</td>
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
                            <td className="px-4 py-3 text-stone-400 text-xs">{fmt(v.createdAt)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={v.status}
                                onChange={(e) => updateVolunteerStatus(v.id, e.target.value)}
                                className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:ring-wine-500 focus:border-wine-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="approved">Approved</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <DeleteBtn
                                onClick={() =>
                                  setDeleteTarget({ entity: "volunteers", id: v.id, label: v.fullName })
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Registrations ── */}
            {activeTab === "registrations" && (
              <div>
                <TableToolbar
                  state={ts.registrations}
                  onChange={(p) => patchTs("registrations", p)}
                  totalFiltered={filteredRegistrations.length}
                  totalAll={registrations.length}
                  exportLabel="registrations"
                  onExportCSV={() => doExport("csv", "registrations")}
                  onExportExcel={() => doExport("excel", "registrations")}
                />
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <Th col="fullName" label="Name" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="email" label="Email" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="phone" label="Phone" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="country" label="Country" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="planningToAttend" label="Attending?" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="groupSize" label="Group" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="interests" label="Interests" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <Th col="createdAt" label="Date" state={ts.registrations} onSort={(c) => sortTab("registrations", c)} />
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pageRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-stone-400">
                            No registrations found.
                          </td>
                        </tr>
                      ) : (
                        pageRegistrations.map((r) => (
                          <tr key={r.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-stone-900">{r.fullName}</td>
                            <td className="px-4 py-3 text-stone-600">{r.email}</td>
                            <td className="px-4 py-3 text-stone-600">{r.phone}</td>
                            <td className="px-4 py-3 text-stone-600">
                              {r.country}
                              {r.state ? <span className="text-stone-400"> / {r.state}</span> : null}
                            </td>
                            <td className="px-4 py-3 text-stone-600 capitalize">
                              {r.planningToAttend ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-stone-600">{r.groupSize ?? "—"}</td>
                            <td className="px-4 py-3 text-stone-500 text-xs max-w-[160px] truncate">
                              {r.interests ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-stone-400 text-xs">{fmt(r.createdAt)}</td>
                            <td className="px-4 py-3">
                              <DeleteBtn
                                onClick={() =>
                                  setDeleteTarget({ entity: "registrations", id: r.id, label: r.fullName })
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Sponsors ── */}
            {activeTab === "sponsors" && (
              <div>
                <TableToolbar
                  state={ts.sponsors}
                  onChange={(p) => patchTs("sponsors", p)}
                  totalFiltered={filteredSponsors.length}
                  totalAll={sponsors.length}
                  exportLabel="sponsors"
                  onExportCSV={() => doExport("csv", "sponsors")}
                  onExportExcel={() => doExport("excel", "sponsors")}
                />
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <Th col="companyName" label="Organisation" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="contactName" label="Contact" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="email" label="Email" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="phone" label="Phone" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="sponsorshipLevel" label="Level" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="status" label="Status" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <Th col="createdAt" label="Date" state={ts.sponsors} onSort={(c) => sortTab("sponsors", c)} />
                        <th className="px-4 py-3 font-semibold text-stone-600">Update</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pageSponsors.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-stone-400">
                            No sponsor inquiries found.
                          </td>
                        </tr>
                      ) : (
                        pageSponsors.map((s) => (
                          <tr key={s.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-stone-400 flex-shrink-0" />
                                <span className="font-medium text-stone-900">{s.companyName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-stone-700">{s.contactName}</td>
                            <td className="px-4 py-3 text-stone-600">{s.email}</td>
                            <td className="px-4 py-3 text-stone-600">{s.phone}</td>
                            <td className="px-4 py-3 capitalize text-stone-600">{s.sponsorshipLevel}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={s.status} />
                            </td>
                            <td className="px-4 py-3 text-stone-400 text-xs">{fmt(s.createdAt)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={s.status}
                                onChange={(e) => updateSponsorStatus(s.id, e.target.value)}
                                className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:ring-wine-500 focus:border-wine-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <DeleteBtn
                                onClick={() =>
                                  setDeleteTarget({ entity: "sponsors", id: s.id, label: s.companyName })
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Messages ── */}
            {activeTab === "messages" && (
              <div>
                <TableToolbar
                  state={ts.messages}
                  onChange={(p) => patchTs("messages", p)}
                  totalFiltered={filteredMessages.length}
                  totalAll={messages.length}
                  exportLabel="messages"
                  onExportCSV={() => doExport("csv", "messages")}
                  onExportExcel={() => doExport("excel", "messages")}
                />
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl border border-stone-200 text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-left">
                        <Th col="name" label="From" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <Th col="email" label="Email" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <Th col="subject" label="Subject" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <Th col="message" label="Message" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <Th col="status" label="Status" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <Th col="createdAt" label="Date" state={ts.messages} onSort={(c) => sortTab("messages", c)} />
                        <th className="px-4 py-3 font-semibold text-stone-600">Mark</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pageMessages.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-stone-400">
                            No messages found.
                          </td>
                        </tr>
                      ) : (
                        pageMessages.map((m) => (
                          <tr
                            key={m.id}
                            className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${
                              m.status === "unread" ? "bg-amber-50/40" : ""
                            }`}
                          >
                            <td className="px-4 py-3 font-medium text-stone-900">{m.name}</td>
                            <td className="px-4 py-3 text-stone-600">{m.email}</td>
                            <td className="px-4 py-3 font-medium text-stone-800">{m.subject}</td>
                            <td className="px-4 py-3 text-stone-500 text-xs max-w-[240px]">
                              <p className="line-clamp-2">{m.message}</p>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={m.status} />
                            </td>
                            <td className="px-4 py-3 text-stone-400 text-xs">{fmt(m.createdAt)}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  updateMessageStatus(
                                    m.id,
                                    m.status === "unread" ? "read" : "unread"
                                  )
                                }
                                className="text-xs text-stone-400 hover:text-stone-700 border border-stone-200 rounded px-2 py-1 bg-white hover:bg-stone-50 transition-colors"
                              >
                                {m.status === "unread" ? "Mark read" : "Mark unread"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <DeleteBtn
                                onClick={() =>
                                  setDeleteTarget({ entity: "messages", id: m.id, label: `message from ${m.name}` })
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
