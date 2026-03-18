"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Download,
  Trash2,
  Eye,
  X,
  FolderOpen,
  Edit3,
  Save,
  FileUp,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";

type TripOption = {
  id: string;
  name: string;
};

type DocumentRecord = {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  tripId: string;
  notes: string | null;
  createdAt: string;
  trip?: {
    id?: string;
    name: string;
  };
};

type DocumentFormState = {
  name: string;
  type: string;
  tripId: string;
  notes: string;
};

const DOC_TYPE_CONFIG: Record<string, { emoji: string; label: string; accent: string; badge: string }> = {
  PASSPORT: { emoji: "🛂", label: "Passport", accent: "from-sky-500 to-blue-600", badge: "bg-sky-100 text-sky-700" },
  VISA: { emoji: "📋", label: "Visa", accent: "from-fuchsia-500 to-rose-500", badge: "bg-fuchsia-100 text-fuchsia-700" },
  FLIGHT_BOOKING: { emoji: "✈️", label: "Flight", accent: "from-cyan-500 to-teal-500", badge: "bg-cyan-100 text-cyan-700" },
  HOTEL_BOOKING: { emoji: "🏨", label: "Hotel", accent: "from-amber-400 to-orange-500", badge: "bg-amber-100 text-amber-700" },
  INSURANCE: { emoji: "🛡️", label: "Insurance", accent: "from-emerald-500 to-green-600", badge: "bg-emerald-100 text-emerald-700" },
  UMRAH_PERMIT: { emoji: "🕋", label: "Permit", accent: "from-violet-500 to-indigo-600", badge: "bg-violet-100 text-violet-700" },
  CAR_RENTAL: { emoji: "🚗", label: "Car", accent: "from-orange-500 to-red-500", badge: "bg-orange-100 text-orange-700" },
  ITINERARY: { emoji: "📅", label: "Itinerary", accent: "from-pink-500 to-rose-500", badge: "bg-pink-100 text-pink-700" },
  OTHER: { emoji: "📄", label: "Other", accent: "from-slate-500 to-slate-700", badge: "bg-slate-100 text-slate-700" },
};

const defaultForm = (tripId = ""): DocumentFormState => ({
  name: "",
  type: "OTHER",
  tripId,
  notes: "",
});

function formatFileSize(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function stripExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}

function DocumentModal({
  open,
  editingDoc,
  form,
  trips,
  selectedFile,
  saving,
  error,
  onChange,
  onPickFile,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editingDoc: DocumentRecord | null;
  form: DocumentFormState;
  trips: TripOption[];
  selectedFile: File | null;
  saving: boolean;
  error: string | null;
  onChange: (updates: Partial<DocumentFormState>) => void;
  onPickFile: () => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  const currentType = DOC_TYPE_CONFIG[form.type] || DOC_TYPE_CONFIG.OTHER;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.2)]"
      >
        <div className={`bg-gradient-to-r ${currentType.accent} px-6 py-5 text-white`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/70">
                {editingDoc ? "Update Document" : "Upload Document"}
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {editingDoc ? form.name || "Edit document" : "Add a real file to the vault"}
              </h2>
              <p className="mt-2 max-w-xl text-sm font-semibold text-white/80">
                Upload passports, visas, confirmations, and permits so each trip has the files attached to it.
              </p>
            </div>
            <button onClick={onClose} className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          {!editingDoc && (
            <button
              type="button"
              onClick={onPickFile}
              className="flex w-full items-center justify-between rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-coral hover:bg-white"
            >
              <div>
                <p className="text-sm font-black text-slate-700">
                  {selectedFile ? selectedFile.name : "Choose a file to upload"}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type || "Unknown file type"}`
                    : "PDFs, images, or travel confirmations work best here."}
                </p>
              </div>
              <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                {selectedFile ? "Replace" : "Pick File"}
              </span>
            </button>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Document Name</span>
              <input
                value={form.name}
                onChange={(event) => onChange({ name: event.target.value })}
                placeholder="Saudi eVisa"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Document Type</span>
              <select
                value={form.type}
                onChange={(event) => onChange({ type: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
              >
                {Object.entries(DOC_TYPE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.emoji} {config.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Trip</span>
              <select
                value={form.tripId}
                onChange={(event) => onChange({ tripId: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>{trip.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Selected File</span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                {editingDoc ? editingDoc.fileName : selectedFile?.name || "Pick a file before saving"}
              </div>
            </label>
          </div>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => onChange({ notes: event.target.value })}
              rows={3}
              placeholder="Any expiry dates, traveler names, or booking details worth keeping handy"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || !form.name || !form.tripId || (!editingDoc && !selectedFile)}
              onClick={onSubmit}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingDoc ? "Save Changes" : "Upload to Vault"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [tripFilter, setTripFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<DocumentFormState>(defaultForm());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [documentsResponse, tripsResponse] = await Promise.all([
        fetch("/api/documents", { cache: "no-store" }),
        fetch("/api/trips", { cache: "no-store" }),
      ]);

      if (!documentsResponse.ok) {
        throw new Error("Failed to load documents.");
      }

      const loadedDocuments = (await documentsResponse.json()) as DocumentRecord[];
      const loadedTrips = tripsResponse.ok ? ((await tripsResponse.json()) as TripOption[]) : [];
      const normalizedTrips = loadedTrips.map((trip) => ({ id: trip.id, name: trip.name }));

      setDocuments(loadedDocuments);
      setTrips(normalizedTrips);
      setPageError(null);

      if (!form.tripId && normalizedTrips[0]) {
        setForm(defaultForm(normalizedTrips[0].id));
      }
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [form.tripId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openNewDocumentModal = () => {
    setEditingDoc(null);
    setSelectedFile(null);
    setModalError(null);
    setForm(defaultForm(trips[0]?.id || form.tripId));
    setShowModal(true);
  };

  const openEditDocumentModal = (document: DocumentRecord) => {
    setEditingDoc(document);
    setSelectedFile(null);
    setModalError(null);
    setForm({
      name: document.name,
      type: document.type,
      tripId: document.tripId,
      notes: document.notes || "",
    });
    setShowModal(true);
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setModalError(null);
    setForm((current) => ({
      ...current,
      name: current.name || stripExtension(file.name),
    }));

    if (!showModal) {
      setEditingDoc(null);
      setShowModal(true);
    }

    event.target.value = "";
  };

  const handleSubmit = async () => {
    setSaving(true);
    setModalError(null);

    try {
      if (editingDoc) {
        const response = await fetch(`/api/documents/${editingDoc.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            type: form.type,
            notes: form.notes || null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update document.");
        }
      } else {
        if (!selectedFile) {
          throw new Error("Choose a file before uploading.");
        }

        const payload = new FormData();
        payload.append("file", selectedFile);
        payload.append("name", form.name);
        payload.append("type", form.type);
        payload.append("tripId", form.tripId);
        payload.append("notes", form.notes);

        const response = await fetch("/api/documents", {
          method: "POST",
          body: payload,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error || "Failed to upload document.");
        }
      }

      setShowModal(false);
      setSelectedFile(null);
      setEditingDoc(null);
      await loadData();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Document save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete document.");
      }

      await loadData();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to delete document.");
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      if (search && !`${document.name} ${document.fileName}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (typeFilter !== "ALL" && document.type !== typeFilter) {
        return false;
      }

      if (tripFilter !== "ALL" && document.tripId !== tripFilter) {
        return false;
      }

      return true;
    });
  }, [documents, search, tripFilter, typeFilter]);

  const groupedDocuments = useMemo(() => {
    return filteredDocuments.reduce<Record<string, DocumentRecord[]>>((groups, document) => {
      const label = document.trip?.name || trips.find((trip) => trip.id === document.tripId)?.name || "Unassigned Trip";
      groups[label] = groups[label] ? [...groups[label], document] : [document];
      return groups;
    }, {});
  }, [filteredDocuments, trips]);

  const availableTypes = useMemo(() => {
    return Object.keys(DOC_TYPE_CONFIG).filter((type) => documents.some((document) => document.type === type));
  }, [documents]);

  const tripCount = new Set(documents.map((document) => document.tripId)).size;

  return (
    <AppShell>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelection}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
      />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(255,240,225,0.85)_34%,_rgba(232,245,255,0.95)_100%)] px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ff6b6b_0%,#ff9f43_35%,#7c5cff_100%)] px-6 py-7 text-white shadow-[0_25px_80px_rgba(255,107,107,0.28)] sm:px-8 sm:py-9">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/15" />
            <div className="absolute bottom-0 right-24 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute left-1/2 top-3 h-16 w-16 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.35em] text-white/70">Document Vault</p>
                <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                  Bigger, brighter, and finally wired to real uploads.
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold text-white/85 sm:text-base">
                  Keep passports, visas, bookings, permits, and confirmations attached to the right trip instead of trapped in a fake demo list.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openNewDocumentModal}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <Upload size={16} /> Upload Document
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-5 py-3 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <FileUp size={16} /> Quick File Pick
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Documents", value: documents.length, accent: "from-pink-500 to-orange-500", emoji: "📄" },
              { label: "Trips Covered", value: tripCount, accent: "from-sky-500 to-cyan-500", emoji: "🗺️" },
              { label: "Uploads Ready", value: availableTypes.length, accent: "from-violet-500 to-indigo-600", emoji: "✨" },
              { label: "Filtered View", value: filteredDocuments.length, accent: "from-emerald-500 to-teal-500", emoji: "🧭" },
            ].map((stat) => (
              <div key={stat.label} className={`overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${stat.accent} px-5 py-5 text-white shadow-lg`}>
                <div className="text-3xl">{stat.emoji}</div>
                <p className="mt-5 text-3xl font-black">{stat.value}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by document name or file name"
                  className="w-full rounded-full border border-slate-200 bg-white px-12 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={tripFilter}
                  onChange={(event) => setTripFilter(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
                >
                  <option value="ALL">All Trips</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>{trip.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => setTypeFilter("ALL")}
                  className={`rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${typeFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  All Types
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {availableTypes.map((type) => {
                const config = DOC_TYPE_CONFIG[type] || DOC_TYPE_CONFIG.OTHER;
                const active = typeFilter === type;

                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(active ? "ALL" : type)}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${active ? "bg-slate-900 text-white" : `${config.badge} hover:brightness-95`}`}
                  >
                    {config.emoji} {config.label}
                  </button>
                );
              })}
            </div>
          </section>

          {pageError && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {pageError}
            </div>
          )}

          {loading ? (
            <div className="rounded-[2rem] border border-white/70 bg-white/80 px-6 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-coral" />
              <p className="mt-4 text-sm font-bold text-slate-500">Loading your document vault...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="rounded-[2rem] border border-white/70 bg-white/80 px-6 py-20 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="text-6xl">📂</div>
              <h2 className="mt-4 text-2xl font-black text-slate-700">Nothing in this filter yet</h2>
              <p className="mt-2 text-sm font-semibold text-slate-400">Upload your first real file and attach it to a trip.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedDocuments).map(([tripName, tripDocuments]) => (
                <section key={tripName} className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                      <FolderOpen size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">{tripName}</h2>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                        {tripDocuments.length} document{tripDocuments.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {tripDocuments.map((document) => {
                      const config = DOC_TYPE_CONFIG[document.type] || DOC_TYPE_CONFIG.OTHER;

                      return (
                        <motion.div
                          key={document.id}
                          whileHover={{ y: -4 }}
                          className="rounded-[1.6rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fff7f3_100%)] p-5 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.accent} text-2xl text-white shadow-md`}>
                              {config.emoji}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-black text-slate-800">{document.name}</h3>
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${config.badge}`}>
                                  {config.label}
                                </span>
                              </div>

                              <p className="mt-1 truncate text-sm font-semibold text-slate-500">{document.fileName}</p>
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                                <span>{formatFileSize(document.fileSize)}</span>
                                <span>{document.mimeType || "Unknown Type"}</span>
                              </div>

                              {document.notes && (
                                <p className="mt-3 text-sm font-semibold text-slate-500">{document.notes}</p>
                              )}

                              <div className="mt-4 flex flex-wrap gap-2">
                                <a
                                  href={document.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                                >
                                  <Eye size={14} /> Preview
                                </a>
                                <a
                                  href={document.fileUrl}
                                  download={document.fileName}
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-200"
                                >
                                  <Download size={14} /> Download
                                </a>
                                <button
                                  onClick={() => openEditDocumentModal(document)}
                                  className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700 transition hover:bg-amber-200"
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  onClick={() => void handleDelete(document.id)}
                                  className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-600 transition hover:bg-red-200"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        <DocumentModal
          open={showModal}
          editingDoc={editingDoc}
          form={form}
          trips={trips}
          selectedFile={selectedFile}
          saving={saving}
          error={modalError}
          onChange={(updates) => setForm((current) => ({ ...current, ...updates }))}
          onPickFile={() => fileInputRef.current?.click()}
          onClose={() => {
            setShowModal(false);
            setSelectedFile(null);
            setEditingDoc(null);
            setModalError(null);
          }}
          onSubmit={() => void handleSubmit()}
        />
      </AnimatePresence>
    </AppShell>
  );
}
