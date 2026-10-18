"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays,
  Check, ChevronLeft, ChevronRight, Clock3, Download, LayoutDashboard,
  LayoutGrid, List, LoaderCircle, Mail, Menu, Moon, MoreHorizontal, Plus, Search, SlidersHorizontal,
  Star, Sun, Users, X, Zap
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { stages } from "@/lib/seed";

const stageStyles = {
  Applied: "bg-slate-100 text-slate-600",
  Screening: "bg-blue-50 text-blue-700",
  Interview: "bg-violet-50 text-violet-700",
  Offer: "bg-amber-50 text-amber-700",
  Hired: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700"
};
const chartColors = ["#6559dc", "#a398f5", "#39b891", "#f5b749", "#ee8392"];
const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const avatarColors = ["bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
const scoreClass = (score) => score >= 90 ? "text-emerald-700 bg-emerald-50" : score >= 78 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50";

function Button({ children, variant = "secondary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles = variant === "primary"
    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
    : variant === "ghost"
      ? "text-slate-600 hover:bg-slate-100"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}

function StagePill({ stage }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${stageStyles[stage] || stageStyles.Applied}`}>{stage}</span>;
}

function Avatar({ name, index = 0, size = "md" }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${avatarColors[index % avatarColors.length]} ${size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"}`}>{initials(name)}</div>;
}

function CandidateModal({ onClose, onAdd, initialStage = "Applied" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Frontend Engineer", department: "Engineering", experience: "2", skills: "", linkedin: "", resume: "", stage: initialStage, score: "82" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onAdd({ ...form, experience: Number(form.experience), score: Number(form.score), skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const field = (label, key, placeholder = "", type = "text", required = false) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <input required={required} type={type} value={form[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="animate-in max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div><h2 className="text-lg font-semibold text-slate-900">Add a candidate</h2><p className="mt-1 text-sm text-slate-500">Create a profile and add them to your hiring pipeline.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Full name", "name", "e.g. Aditi Sharma", "text", true)}
          {field("Email address", "email", "name@email.com", "email", true)}
          {field("Phone number", "phone", "+91 98765 43210", "tel")}
          <label><span className="mb-1.5 block text-xs font-medium text-slate-600">Role applied for <span className="text-rose-500">*</span></span>
            <input required value={form.role} onChange={(event) => update("role", event.target.value)} list="role-options" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            <datalist id="role-options"><option>Frontend Engineer</option><option>Frontend Intern</option><option>Full Stack Engineer</option><option>AI Engineer</option><option>Product Designer</option><option>Product Manager</option></datalist>
          </label>
          <label><span className="mb-1.5 block text-xs font-medium text-slate-600">Department</span><select value={form.department} onChange={(event) => update("department", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400">{["Engineering", "Design", "Product", "AI & Data", "Infrastructure", "Operations"].map((department) => <option key={department}>{department}</option>)}</select></label>
          {field("Experience (years)", "experience", "e.g. 3", "number")}
          {field("AI match score (%)", "score", "0–100", "number")}
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-slate-600">Skills <span className="text-slate-400">(comma separated)</span></span><input value={form.skills} onChange={(event) => update("skills", event.target.value)} placeholder="React, TypeScript, Node.js" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
          {field("LinkedIn URL", "linkedin", "https://linkedin.com/in/...")}
          {field("Resume URL", "resume", "https://...")}
          <label><span className="mb-1.5 block text-xs font-medium text-slate-600">Initial stage</span><select value={form.stage} onChange={(event) => update("stage", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4"><Button type="button" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={saving}>{saving && <LoaderCircle className="animate-spin" size={15} />} Add candidate</Button></div>
      </form>
    </div>
  );
}

function CandidateDrawer({ candidate, index, onClose, onStage, onRating, onNote, onDelete }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const currentIndex = stages.indexOf(candidate.stage);
  const nextStage = stages[currentIndex + 1];
  const handleNote = async (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try { await onNote(candidate.id, note); setNote(""); } finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="animate-in absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Candidate profile</div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></header>
        <div className="scrollbar-none flex-1 overflow-y-auto">
          <section className="border-b border-slate-100 px-6 py-6">
            <div className="flex items-start gap-4"><Avatar name={candidate.name} index={index} /><div className="min-w-0 flex-1"><h2 className="text-xl font-semibold text-slate-900">{candidate.name}</h2><p className="mt-1 text-sm text-slate-500">{candidate.role} · {candidate.experience} {candidate.experience === 1 ? "year" : "years"} experience</p><div className="mt-3 flex flex-wrap items-center gap-2"><StagePill stage={candidate.stage} /><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${scoreClass(candidate.score)}`}>{candidate.score}% match</span></div></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href={`mailto:${candidate.email}`} className="flex min-w-0 items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"><Mail size={15} className="shrink-0 text-slate-400" /><span className="truncate">{candidate.email}</span></a>
              {candidate.phone && <div className="text-sm text-slate-600">{candidate.phone}</div>}
              {candidate.linkedin && <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">LinkedIn <ArrowUpRight size={13} className="inline" /></a>}
              {candidate.resume && <a href={candidate.resume} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">View resume <ArrowUpRight size={13} className="inline" /></a>}
            </div>
            <p className="mt-4 text-xs text-slate-400">Applied {formatDate(candidate.appliedAt)} · {candidate.department}</p>
          </section>
          <section className="border-b border-slate-100 px-6 py-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Hiring progress</h3>
            <div className="flex items-center">
              {stages.map((stage, stageIndex) => {
                const completed = stageIndex <= currentIndex;
                return <div className="flex flex-1 items-center last:flex-none" key={stage}><div title={stage} className={`h-2.5 w-2.5 rounded-full ${completed ? stage === "Rejected" ? "bg-rose-500" : "bg-indigo-500" : "bg-slate-200"}`} />{stageIndex < stages.length - 1 && <div className={`h-0.5 flex-1 ${stageIndex < currentIndex ? "bg-indigo-400" : "bg-slate-100"}`} />}</div>;
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>Applied</span><span>Interview</span><span>Hired</span></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {nextStage && <Button variant="primary" onClick={() => onStage(candidate.id, nextStage)}><ArrowRight size={14} /> Advance to {nextStage}</Button>}
              {!["Rejected", "Hired"].includes(candidate.stage) && <Button onClick={() => onStage(candidate.id, "Rejected")} className="text-rose-600">Reject</Button>}
            </div>
          </section>
          <section className="border-b border-slate-100 px-6 py-5">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Skills</h3><span className="text-xs text-slate-400">{candidate.skills.length} skills</span></div>
            <div className="flex flex-wrap gap-2">{candidate.skills.map((skill) => <span key={skill} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{skill}</span>)}</div>
          </section>
          <section className="border-b border-slate-100 px-6 py-5">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Technical evaluation</h3><span className="text-xs text-slate-400">{candidate.rating ? `${candidate.rating}/5` : "Not rated"}</span></div>
            <div className="flex gap-1" aria-label="Technical rating">
              {[1, 2, 3, 4, 5].map((rating) => <button key={rating} aria-label={`Rate ${rating} out of 5`} onClick={() => onRating(candidate.id, rating)} className="rounded p-1 transition hover:scale-110"><Star size={22} className={rating <= candidate.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} /></button>)}
            </div>
          </section>
          <section className="px-6 py-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Recruiter notes</h3><span className="text-xs text-slate-400">{candidate.notes.length} notes</span></div>
            <form onSubmit={handleNote}><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Add interview feedback or a note..." className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /><div className="mt-2 flex justify-end"><Button type="submit" variant="primary" disabled={busy || !note.trim()}>{busy && <LoaderCircle size={14} className="animate-spin" />} Add note</Button></div></form>
            <div className="mt-4 space-y-3">{candidate.notes.map((item) => <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-sm leading-5 text-slate-700">{item.text}</p><p className="mt-2 text-[11px] text-slate-400">{item.author} · {formatDate(item.createdAt)}</p></article>)}</div>
            {!candidate.notes.length && <p className="mt-4 text-sm text-slate-400">No notes yet. Add your first interview note above.</p>}
          </section>
        </div>
        <footer className="flex items-center justify-between border-t border-slate-100 px-6 py-4"><span className="text-xs text-slate-400">Candidate ID · {candidate.id}</span><button onClick={() => onDelete(candidate)} className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete candidate</button></footer>
      </aside>
    </div>
  );
}

export default function ATSWorkspace({ initialCandidates }) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeView, setActiveView] = useState("Overview");
  const [layout, setLayout] = useState("board");
  const [drawerId, setDrawerId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addInitialStage, setAddInitialStage] = useState("Applied");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All stages");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [experienceFilter, setExperienceFilter] = useState("Any experience");
  const [scoreFilter, setScoreFilter] = useState("Any match score");
  const [sort, setSort] = useState("Newest applied");
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [loading, setLoading] = useState(true);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }, []);

  useEffect(() => {
    let mounted = true;
    const cached = window.localStorage.getItem("earlyjobs-candidates");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          queueMicrotask(() => { if (mounted) setCandidates(parsed); });
        }
      } catch (error) {
        console.error("Could not read saved candidate data.", error);
        queueMicrotask(() => { if (mounted) notify("Saved candidate data could not be loaded."); });
      }
    }
    Promise.all([
      fetch("/api/candidates").then((response) => { if (!response.ok) throw new Error("Unable to load candidates."); return response.json(); }),
      fetch("/api/metrics").then((response) => { if (!response.ok) throw new Error("Unable to load dashboard metrics."); return response.json(); })
    ]).then(([remoteCandidates]) => {
      if (!mounted) return;
      if (!cached) {
        setCandidates(remoteCandidates);
        window.localStorage.setItem("earlyjobs-candidates", JSON.stringify(remoteCandidates));
      }
    }).catch((error) => {
      console.error("API initialization failed; using browser data fallback.", error);
      if (mounted) notify("Using saved demo data; the API is currently unavailable.");
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [notify]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  const persist = (next) => {
    setCandidates(next);
    window.localStorage.setItem("earlyjobs-candidates", JSON.stringify(next));
  };
  const openAdd = (stage = "Applied") => {
    setAddInitialStage(stage);
    setShowAdd(true);
  };

  const updateCandidate = async (id, changes, message) => {
    const current = candidates.find((candidate) => candidate.id === id);
    const optimistic = { ...current, ...changes };
    const next = candidates.map((candidate) => candidate.id === id ? optimistic : candidate);
    persist(next);
    notify(message);
    try {
      const response = await fetch(`/api/candidates/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changes) });
      if (!response.ok) throw new Error((await response.json()).error || "Could not save candidate changes.");
      const saved = await response.json();
      persist(candidates.map((candidate) => candidate.id === id ? saved : candidate));
    } catch (error) {
      console.error("Candidate update failed.", error);
      notify("Saved on this device, but the server could not be updated.");
    }
  };

  const addCandidate = async (candidateData) => {
    const response = await fetch("/api/candidates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(candidateData) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not add candidate.");
    const next = [payload, ...candidates];
    persist(next);
    setShowAdd(false);
    notify(`${payload.name} added to the pipeline`);
  };

  const addNote = (id, note) => updateCandidate(id, { note, author: "You" }, "Note added");
  const setRating = (id, rating) => updateCandidate(id, { rating }, "Technical rating saved");
  const changeStage = (id, stage) => updateCandidate(id, { stage }, `Moved to ${stage}`);
  const deleteCandidate = (candidate) => {
    if (!window.confirm(`Delete ${candidate.name} from the pipeline? This cannot be undone.`)) return;
    const next = candidates.filter((item) => item.id !== candidate.id);
    persist(next);
    setDrawerId(null);
    notify("Candidate deleted");
    fetch(`/api/candidates/${candidate.id}`, { method: "DELETE" }).then((response) => {
      if (!response.ok) throw new Error("Could not delete candidate from the server.");
    }).catch((error) => { console.error("Candidate delete failed.", error); notify("Deleted on this device, but the server could not be updated."); });
  };

  const uniqueRoles = useMemo(() => [...new Set(candidates.map((candidate) => candidate.role))].sort(), [candidates]);
  const filtered = useMemo(() => {
    const result = candidates.filter((candidate) => {
      const searchable = [candidate.name, candidate.email, candidate.role, ...(candidate.skills || [])].join(" ").toLowerCase();
      return (!debouncedQuery || searchable.includes(debouncedQuery))
        && (stageFilter === "All stages" || candidate.stage === stageFilter)
        && (roleFilter === "All roles" || candidate.role === roleFilter)
        && (experienceFilter === "Any experience" || candidate.experience >= Number(experienceFilter))
        && (scoreFilter === "Any match score" || candidate.score >= Number(scoreFilter));
    });
    return result.sort((a, b) => sort === "Highest match score" ? b.score - a.score : sort === "Most experience" ? b.experience - a.experience : new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [candidates, debouncedQuery, stageFilter, roleFilter, experienceFilter, scoreFilter, sort]);

  const metrics = useMemo(() => {
    const offers = candidates.filter((candidate) => ["Offer", "Hired"].includes(candidate.stage)).length;
    const hired = candidates.filter((candidate) => candidate.stage === "Hired").length;
    return {
      total: candidates.length,
      active: candidates.filter((candidate) => !["Hired", "Rejected"].includes(candidate.stage)).length,
      interviews: candidates.filter((candidate) => candidate.stage === "Interview").length,
      hired,
      acceptance: offers ? Math.round(hired / offers * 100) : 0,
      funnel: stages.map((stage) => ({ stage, count: candidates.filter((candidate) => candidate.stage === stage).length })),
      departments: Object.entries(candidates.reduce((acc, candidate) => { acc[candidate.department] = (acc[candidate.department] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value })),
      activity: candidates.flatMap((candidate) => (candidate.activity || []).map((item) => ({ ...item, candidate: candidate.name, role: candidate.role }))).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5)
    };
  }, [candidates]);
  const selectedCandidate = candidates.find((candidate) => candidate.id === drawerId);
  const resetFilters = () => { setStageFilter("All stages"); setRoleFilter("All roles"); setExperienceFilter("Any experience"); setScoreFilter("Any match score"); setQuery(""); };
  const exportCsv = () => {
    const rows = [["Name", "Email", "Role", "Department", "Experience", "Skills", "Match score", "Stage", "Applied"]];
    filtered.forEach((candidate) => rows.push([candidate.name, candidate.email, candidate.role, candidate.department, candidate.experience, candidate.skills.join("; "), candidate.score, candidate.stage, formatDate(candidate.appliedAt)]));
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url; link.download = "earlyjobs-candidates.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className={`app-shell min-h-screen ${dark ? "theme-dark" : ""}`}>
      <div className="flex min-h-screen">
        <aside className={`${mobileNav ? "fixed inset-y-0 left-0 z-30 flex" : "hidden"} w-[246px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen`}>
          <a href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm"><Zap size={19} fill="currentColor" /></div>
            <div><div className="text-sm font-bold tracking-tight text-slate-900">earlyjobs<span className="text-indigo-600">.ai</span></div><div className="mt-0.5 text-[10px] font-medium uppercase tracking-[.14em] text-slate-400">Talent workspace</div></div>
          </a>
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-400">Workspace</div>
          <nav className="space-y-1">
            {[["Overview", LayoutDashboard], ["Pipeline", Users]].map(([label, Icon]) => <button key={label} onClick={() => { setActiveView(label); setMobileNav(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeView === label ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={17} strokeWidth={1.8} />{label}{label === "Pipeline" && <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[10px] text-slate-500">{candidates.length}</span>}</button>)}
          </nav>
          <div className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-400">Your team</div>
          <div className="space-y-1 px-3">
            {[["PS", "Priya Sharma", "bg-violet-100 text-violet-700"], ["RK", "Rahul Kapoor", "bg-blue-100 text-blue-700"], ["MR", "Meera Rao", "bg-emerald-100 text-emerald-700"]].map(([monogram, name, color]) => <div className="flex items-center gap-2.5 py-2" key={name}><span className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ${color}`}>{monogram}</span><span className="text-xs font-medium text-slate-600">{name}</span><span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" /></div>)}
          </div>
          <div className="mt-auto rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-900"><Zap size={14} className="text-indigo-600" /> EarlyJobs AI</div>
            <p className="text-[11px] leading-4 text-indigo-800/75">Focus on the right talent. Your hiring workspace, all in one place.</p>
            <button onClick={() => notify("You’re all set — this is your hiring workspace.")} className="mt-3 text-[11px] font-semibold text-indigo-700 hover:underline">Explore features <ArrowRight size={12} className="inline" /></button>
          </div>
          <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 px-2 pt-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-white">PS</div><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-800">Priya Sharma</div><div className="text-[10px] text-slate-400">Recruiter</div></div><button className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-100" title="Account menu"><MoreHorizontal size={17} /></button></div>
        </aside>

        {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-slate-950/25 lg:hidden" onClick={() => setMobileNav(false)} />}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={19} /></button><div className="hidden text-xs text-slate-400 sm:block">Talent workspace <ChevronRight size={12} className="mx-1 inline" /></div><span className="text-sm font-semibold text-slate-800">{activeView === "Overview" ? "Overview" : "Candidate pipeline"}</span></div>
            <div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All systems operational</div><button onClick={() => setDark((value) => !value)} title={dark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button onClick={() => notify("You’re all caught up!")} aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Activity size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-white" /></button><div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">PS</div></div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9">
            {activeView === "Overview" ? (
              <div className="animate-in">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Workspace</span><ChevronRight size={12} /><span className="text-slate-500">Overview</span></div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Good morning, Priya <span className="inline-block origin-bottom-right animate-[wave_1.5s_ease-in-out_1]">👋</span></h1><p className="mt-1.5 text-sm text-slate-500">Here&apos;s what&apos;s happening with your hiring pipeline today.</p></div><div className="flex gap-2"><Button onClick={exportCsv}><Download size={15} /> Export</Button><Button variant="primary" onClick={() => openAdd()}><Plus size={16} /> Add candidate</Button></div></div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Total candidates", value: metrics.total, icon: Users, note: "Across all open roles", color: "bg-violet-50 text-violet-600", trend: "+12.5%", trendUp: true },
                    { label: "Active pipeline", value: metrics.active, icon: BriefcaseBusiness, note: "In progress right now", color: "bg-blue-50 text-blue-600", trend: "Live", trendUp: false },
                    { label: "Interviews scheduled", value: metrics.interviews, icon: CalendarDays, note: "Candidates at interview stage", color: "bg-amber-50 text-amber-600", trend: "This week", trendUp: false },
                    { label: "Hired", value: metrics.hired, icon: Check, note: `${metrics.acceptance}% offer acceptance`, color: "bg-emerald-50 text-emerald-600", trend: `${metrics.acceptance}%`, trendUp: true }
                  ].map(({ label, value, icon: Icon, note, color, trend, trendUp }) => <div key={label} className="soft-shadow rounded-xl border border-slate-200/80 bg-white p-5"><div className="flex items-start justify-between"><span className="text-xs font-medium text-slate-500">{label}</span><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}><Icon size={16} /></span></div><div className="mt-3 flex items-baseline gap-2"><span className="text-[28px] font-semibold tracking-tight text-slate-900">{value}</span><span className={`text-[10px] font-semibold ${trendUp ? "text-emerald-600" : "text-slate-400"}`}>{trendUp && <ArrowUpRight size={11} className="inline" />} {trend}</span></div><p className="mt-1 text-[11px] text-slate-400">{note}</p></div>)}
                </div>
                <div className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
                  <section className="soft-shadow rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
                    <div className="mb-1 flex items-start justify-between"><div><h2 className="text-sm font-semibold text-slate-800">Hiring funnel</h2><p className="mt-1 text-xs text-slate-400">Candidates by current stage</p></div><button onClick={() => setActiveView("Pipeline")} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50">View pipeline <ArrowRight size={12} className="ml-1 inline" /></button></div>
                    <div className="mt-5 h-[248px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={metrics.funnel} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barCategoryGap="34%"><CartesianGrid vertical={false} stroke="#eef0f5" strokeDasharray="3 4" /><XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: "#8992a4", fontSize: 10 }} interval={0} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#8992a4", fontSize: 10 }} /><Tooltip cursor={{ fill: "#f8f8fc" }} contentStyle={{ border: "1px solid #e8eaf0", borderRadius: 10, fontSize: 12 }} /><Bar dataKey="count" name="Candidates" radius={[5, 5, 0, 0]}>{metrics.funnel.map((entry, index) => <Cell key={entry.stage} fill={index === 2 ? "#6559dc" : "#a69df0"} />)}</Bar></BarChart></ResponsiveContainer></div>
                  </section>
                  <section className="soft-shadow rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6">
                    <div><h2 className="text-sm font-semibold text-slate-800">Candidates by department</h2><p className="mt-1 text-xs text-slate-400">Distribution across your teams</p></div>
                    <div className="relative mt-2 h-[190px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={metrics.departments} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={4} stroke="none">{metrics.departments.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ border: "1px solid #e8eaf0", borderRadius: 10, fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-semibold text-slate-800">{metrics.total}</span><span className="text-[10px] text-slate-400">candidates</span></div></div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">{metrics.departments.slice(0, 4).map((item, index) => <div key={item.name} className="flex min-w-0 items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span className="truncate text-[10px] text-slate-500">{item.name}</span><span className="ml-auto text-[10px] font-semibold text-slate-700">{item.value}</span></div>)}</div>
                  </section>
                </div>
                <section className="soft-shadow mt-5 overflow-hidden rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-sm font-semibold text-slate-800">Recent activity</h2><p className="mt-1 text-xs text-slate-400">Latest updates across your candidates</p></div><button onClick={() => setActiveView("Pipeline")} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">See all <ArrowRight size={12} className="ml-1 inline" /></button></div>
                  {metrics.activity.length ? <div className="divide-y divide-slate-50">{metrics.activity.map((item) => <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6"><Avatar name={item.candidate} size="sm" index={item.candidate.charCodeAt(0)} /><div className="min-w-0 flex-1"><p className="truncate text-xs text-slate-700"><span className="font-semibold">{item.candidate}</span><span className="text-slate-500"> moved from </span><span className="font-medium">{item.from}</span><span className="text-slate-500"> to </span><span className="font-medium text-indigo-600">{item.to}</span></p><p className="mt-1 truncate text-[10px] text-slate-400">{item.role}</p></div><span className="shrink-0 text-[10px] text-slate-400">{formatDate(item.at)}</span></div>)}</div> : <div className="px-6 py-10 text-center"><div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400"><Clock3 size={16} /></div><p className="text-xs text-slate-500">Stage changes will appear here.</p></div>}
                </section>
              </div>
            ) : (
              <div className="animate-in">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Workspace</span><ChevronRight size={12} /><span>Recruiting</span><ChevronRight size={12} /><span className="text-slate-500">Pipeline</span></div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Candidate pipeline</h1><p className="mt-1.5 text-sm text-slate-500">{filtered.length} candidates across {stages.length} hiring stages</p></div><div className="flex gap-2"><Button onClick={exportCsv}><Download size={15} /> <span className="hidden sm:inline">Export</span></Button><Button variant="primary" onClick={() => openAdd()}><Plus size={16} /> Add candidate</Button></div></div>
                <div className="soft-shadow rounded-xl border border-slate-200/80 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[210px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, role, email or skill..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></div>
                    <div className="flex items-center gap-1 text-slate-400"><SlidersHorizontal size={14} /><span className="hidden text-[10px] font-medium sm:inline">Filters</span></div>
                    <select aria-label="Filter by stage" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="filter-select"><option>All stages</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select>
                    <select aria-label="Filter by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="filter-select"><option>All roles</option>{uniqueRoles.map((role) => <option key={role}>{role}</option>)}</select>
                    <select aria-label="Minimum experience" value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)} className="filter-select"><option>Any experience</option><option value="1">1+ years</option><option value="3">3+ years</option><option value="5">5+ years</option></select>
                    <select aria-label="Minimum match score" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className="filter-select"><option>Any match score</option><option value="70">70%+ match</option><option value="80">80%+ match</option><option value="90">90%+ match</option></select>
                    <select aria-label="Sort candidates" value={sort} onChange={(event) => setSort(event.target.value)} className="filter-select sm:ml-auto"><option>Newest applied</option><option>Highest match score</option><option>Most experience</option></select>
                    <div className="flex rounded-lg border border-slate-200 p-0.5"><button aria-label="Board view" onClick={() => setLayout("board")} className={`rounded-md p-1.5 ${layout === "board" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}><LayoutGrid size={16} /></button><button aria-label="Table view" onClick={() => setLayout("table")} className={`rounded-md p-1.5 ${layout === "table" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}><List size={16} /></button></div>
                  </div>
                </div>
                {layout === "board" ? (
                  <div className="scrollbar-none mt-5 flex gap-4 overflow-x-auto pb-5">
                    {stages.map((stage) => {
                      const items = filtered.filter((candidate) => candidate.stage === stage);
                      return <section key={stage} className="w-[275px] shrink-0">
                        <div className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${stage === "Applied" ? "bg-slate-400" : stage === "Screening" ? "bg-blue-500" : stage === "Interview" ? "bg-violet-500" : stage === "Offer" ? "bg-amber-500" : stage === "Hired" ? "bg-emerald-500" : "bg-rose-500"}`} /><h2 className="text-xs font-semibold text-slate-700">{stage}</h2><span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{items.length}</span></div><button onClick={() => openAdd(stage)} title={`Add candidate to ${stage}`} className="rounded p-1 text-slate-400 hover:bg-slate-200/70"><Plus size={15} /></button></div>
                        <div className="min-h-[300px] space-y-2.5 rounded-xl bg-slate-100/75 p-2">
                          {items.map((candidate) => {
                            const index = candidates.indexOf(candidate);
                            return <article onClick={() => setDrawerId(candidate.id)} key={candidate.id} className="soft-shadow cursor-pointer rounded-xl border border-slate-200/80 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                              <div className="flex items-start gap-2.5"><Avatar name={candidate.name} index={index} size="sm" /><div className="min-w-0 flex-1"><h3 className="truncate text-xs font-semibold text-slate-800">{candidate.name}</h3><p className="mt-1 truncate text-[10px] text-slate-500">{candidate.role}</p></div><button onClick={(event) => { event.stopPropagation(); setDrawerId(candidate.id); }} className="rounded p-1 text-slate-300 hover:bg-slate-50 hover:text-slate-600"><MoreHorizontal size={15} /></button></div>
                              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400"><span>{candidate.experience} yrs experience</span><span className={`rounded-full px-2 py-0.5 font-semibold ${scoreClass(candidate.score)}`}>{candidate.score}%</span></div>
                              <div className="mt-2.5 flex min-h-6 flex-wrap gap-1">{candidate.skills.slice(0, 3).map((skill) => <span key={skill} className="rounded bg-slate-100 px-1.5 py-1 text-[9px] font-medium text-slate-500">{skill}</span>)}{candidate.skills.length > 3 && <span className="px-1 py-1 text-[9px] text-slate-400">+{candidate.skills.length - 3}</span>}</div>
                              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5"><span className="flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays size={11} /> {formatDate(candidate.appliedAt)}</span><select aria-label={`Move ${candidate.name} to another stage`} value={candidate.stage} onClick={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); changeStage(candidate.id, event.target.value); }} className="max-w-[110px] truncate rounded-md border-0 bg-slate-50 py-1 pl-1.5 pr-5 text-[9px] font-medium text-slate-600 outline-none focus:ring-1 focus:ring-indigo-300">{stages.map((option) => <option key={option}>{option}</option>)}</select></div>
                            </article>;
                          })}
                          {!items.length && <div className="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-center text-[10px] text-slate-400">{filtered.length ? "No candidates in this stage" : "No matching candidates"}</div>}
                        </div>
                      </section>;
                    })}
                  </div>
                ) : (
                  <div className="soft-shadow mt-5 overflow-hidden rounded-xl border border-slate-200/80 bg-white">
                    <div className="scrollbar-none overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left"><thead className="bg-slate-50/80"><tr>{["Candidate", "Role", "Experience", "Skills", "Match", "Stage", "Applied"].map((heading) => <th key={heading} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((candidate) => { const index = candidates.indexOf(candidate); return <tr onClick={() => setDrawerId(candidate.id)} key={candidate.id} className="cursor-pointer transition hover:bg-slate-50/70"><td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={candidate.name} index={index} size="sm" /><div><div className="text-xs font-semibold text-slate-800">{candidate.name}</div><div className="mt-0.5 text-[10px] text-slate-400">{candidate.email}</div></div></div></td><td className="px-4 py-3 text-xs text-slate-600">{candidate.role}</td><td className="px-4 py-3 text-xs text-slate-600">{candidate.experience} yrs</td><td className="px-4 py-3"><div className="flex max-w-[190px] flex-wrap gap-1">{candidate.skills.slice(0, 2).map((skill) => <span key={skill} className="rounded bg-slate-100 px-1.5 py-1 text-[9px] text-slate-500">{skill}</span>)}{candidate.skills.length > 2 && <span className="px-1 py-1 text-[9px] text-slate-400">+{candidate.skills.length - 2}</span>}</div></td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${scoreClass(candidate.score)}`}>{candidate.score}%</span></td><td className="px-4 py-3" onClick={(event) => event.stopPropagation()}><select aria-label={`Change ${candidate.name} stage`} value={candidate.stage} onChange={(event) => changeStage(candidate.id, event.target.value)} className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[10px] font-semibold outline-none ${stageStyles[candidate.stage]}`}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></td><td className="px-4 py-3 text-xs text-slate-500">{formatDate(candidate.appliedAt)}</td></tr>; })}</tbody></table></div>
                    {filtered.length === 0 && <div className="py-16 text-center"><Search size={22} className="mx-auto mb-2 text-slate-300" /><p className="text-sm font-medium text-slate-600">No candidates found</p><p className="mt-1 text-xs text-slate-400">Try another search or clear your filters.</p><button onClick={resetFilters} className="mt-3 text-xs font-semibold text-indigo-600">Clear filters</button></div>}
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><span className="text-[10px] text-slate-400">Showing <strong className="text-slate-600">{filtered.length}</strong> of {candidates.length} candidates</span><div className="flex gap-1"><button aria-label="Previous page" disabled className="rounded border border-slate-200 p-1 text-slate-300"><ChevronLeft size={14} /></button><button aria-label="Next page" disabled className="rounded border border-slate-200 p-1 text-slate-300"><ChevronRight size={14} /></button></div></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      {showAdd && <CandidateModal initialStage={addInitialStage} onClose={() => setShowAdd(false)} onAdd={addCandidate} />}
      {selectedCandidate && <CandidateDrawer candidate={selectedCandidate} index={candidates.indexOf(selectedCandidate)} onClose={() => setDrawerId(null)} onStage={changeStage} onRating={setRating} onNote={addNote} onDelete={deleteCandidate} />}
      {toast && <div role="status" className="animate-in fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl"><Check size={15} className="text-emerald-400" />{toast}</div>}
      {loading && <div className="fixed bottom-5 right-5 z-10 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm"><LoaderCircle size={13} className="animate-spin text-indigo-500" />Loading workspace</div>}
    </div>
  );
}
