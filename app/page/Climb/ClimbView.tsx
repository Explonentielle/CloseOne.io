"use client";
 
import { useState } from "react";
import { RefreshCw, Play, Clock, Trash2, Bell, Plus } from "lucide-react";
import { toast } from "sonner";
 
const quotes = [
  "The deal is won before the call.",
  "Chaque objection est une opportunité déguisée.",
  "Le silence est l'arme secrète du closer.",
  "La confiance se construit, le deal se ferme.",
  "Un bon closer écoute plus qu'il ne parle.",
];
 
const videos = [
  { title: "Objection Handling Masterclass", level: "Avancé",       duration: "47min", levelColor: "#F87171" },
  { title: "Tonalité & Vocal Power",         level: "Intermédiaire", duration: "32min", levelColor: "#3B82F6" },
  { title: "High-Ticket Closing",            level: "Avancé",        duration: "55min", levelColor: "#F87171" },
  { title: "Mindset du Closer",              level: "Débutant",      duration: "28min", levelColor: "#00C27A" },
  { title: "Gestion des silences",           level: "Intermédiaire", duration: "24min", levelColor: "#3B82F6" },
  { title: "Follow-up Strategy",             level: "Intermédiaire", duration: "38min", levelColor: "#3B82F6" },
];
 
const boosters = [
  { emoji: "💡", text: "Rappelle-toi : chaque non t'approche d'un oui." },
  { emoji: "🧘", text: "5 min de visualisation avant ton call."          },
  { emoji: "📋", text: "Fais ton debrief : 1 appel = 1 apprentissage."   },
  { emoji: "🌙", text: "Prépare tes objections la veille."               },
];
 
const presetTags = ["#Objection", "#Mindset", "#Tonalité", "#Follow-up"];
 
interface Note { text: string; tags: string[]; time: string; }
 
export default function ClimbView() {
  const [quoteIdx,     setQuoteIdx]     = useState(0);
  const [noteText,     setNoteText]     = useState("");
  const [tagInput,     setTagInput]     = useState("");
  const [currentTags,  setCurrentTags]  = useState<string[]>([]);
  const [notes,        setNotes]        = useState<Note[]>([]);
  const [reminders,    setReminders]    = useState([
    { text: "Prépare ton tonality",    active: true  },
    { text: "Note tes objections clés", active: true  },
    { text: "Debrief post-call",        active: false },
  ]);
  const [newReminder,  setNewReminder]  = useState("");
 
  const saveNote = () => {
    if (!noteText.trim()) return;
    setNotes([{
      text: noteText,
      tags: currentTags,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }, ...notes]);
    setNoteText("");
    setCurrentTags([]);
    toast.success("Note sauvegardée !");
  };
 
  const addTag = (tag: string) => {
    const t = tag.startsWith("#") ? tag : `#${tag}`;
    if (!currentTags.includes(t)) setCurrentTags([...currentTags, t]);
    setTagInput("");
  };
 
  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders([...reminders, { text: newReminder, active: true }]);
    setNewReminder("");
  };
 
  const inputClass = "w-full h-9 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-3 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50";
 
  return (
    <div className="space-y-6 animate-slide-up max-w-[1440px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Climb</h2>
        <p className="text-[#A0A0A0] text-sm mt-1">Formations, motivation & progression</p>
      </div>
 
      {/* Zone 1 — Daily Motivation */}
      <div
        className="relative rounded-xl p-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7A00A8, #FF007F)" }}
      >
        <button
          onClick={() => setQuoteIdx((quoteIdx + 1) % quotes.length)}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          title="Nouvelle citation"
        >
          <RefreshCw size={16} />
        </button>
        <p className="text-xs text-white/70 mb-2">Motivation du jour</p>
        <p className="text-xl font-semibold text-white animate-fade-in" key={quoteIdx}>
          "{quotes[quoteIdx]}"
        </p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          {/* Zone 2 — Formations Vidéo */}
          <div>
            <h3 className="font-semibold text-[22px] mb-4">Formations Vidéo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {videos.map((v, i) => (
                <div
                  key={i}
                  className="glass-card overflow-hidden hover:border-[#0EFF9C]/40 hover:scale-[1.02] transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-[#0D1117] flex items-center justify-center">
                    <Play size={36} className="text-[#A0A0A0] group-hover:text-[#0EFF9C] transition-colors" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm">{v.title}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-[#A0A0A0]">
                        <Clock size={12} /> {v.duration}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: `${v.levelColor}20`, color: v.levelColor }}
                      >
                        {v.level}
                      </span>
                    </div>
                    <button
                      onClick={() => toast.info(`Lecture de "${v.title}" bientôt disponible`)}
                      className="w-full h-9 rounded-lg gradient-primary text-[#0D1117] text-xs font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5"
                    >
                      ▶ Regarder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Zone 3 — My Notes */}
          <div>
            <h3 className="font-semibold text-[22px] mb-4">Mes Notes</h3>
            <div className="glass-card p-5 space-y-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Écris tes notes ici..."
                className="w-full min-h-[120px] rounded-xl bg-[#0D1117] border border-[#2A2F35] p-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50 resize-y"
              />
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {presetTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => addTag(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      currentTags.includes(t)
                        ? "border-[#0EFF9C] text-[#0EFF9C] bg-[#0EFF9C]/10"
                        : "border-[#2A2F35] text-[#A0A0A0] hover:text-[#0EFF9C] hover:border-[#0EFF9C]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) addTag(tagInput); }}
                  placeholder="+ Tag"
                  className="h-7 px-3 rounded-full border border-[#2A2F35] bg-transparent text-xs text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#0EFF9C] w-20"
                />
              </div>
              <button
                onClick={saveNote}
                className="h-10 px-6 rounded-lg gradient-primary text-[#0D1117] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                💾 Sauvegarder
              </button>
 
              {/* Saved notes */}
              {notes.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#2A2F35]">
                  {notes.map((n, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{n.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {n.tags.map((t) => (
                            <span key={t} className="text-[10px] text-[#0EFF9C] font-medium">{t}</span>
                          ))}
                          <span className="text-[10px] text-[#A0A0A0]">{n.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotes(notes.filter((_, j) => j !== i))}
                        className="text-[#A0A0A0] hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
 
          {/* Zone 4 — Performance Boosters */}
          <div>
            <h3 className="font-semibold text-[22px] mb-4">Performance Boosters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boosters.map((b, i) => (
                <div
                  key={i}
                  className="glass-card p-5 text-center hover:border-[#0EFF9C]/40 hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-3xl block mb-3">{b.emoji}</span>
                  <p className="text-sm text-[#A0A0A0]">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Zone 5 — Reminders sticky panel */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-[#0EFF9C]" />
              <h3 className="font-semibold text-base">Rappels</h3>
            </div>
            <div className="space-y-3">
              {reminders.map((r, i) => (
                <label key={i} className="flex items-center justify-between gap-2 py-1 cursor-pointer">
                  <span className={`text-sm ${r.active ? "text-white" : "text-[#A0A0A0]"}`}>{r.text}</span>
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={() => {
                      const updated = [...reminders];
                      updated[i] = { ...updated[i], active: !updated[i].active };
                      setReminders(updated);
                    }}
                    className="w-4 h-4 rounded accent-[#0EFF9C]"
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addReminder(); }}
                placeholder="Nouveau rappel..."
                className={inputClass}
              />
              <button
                onClick={addReminder}
                className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-[#0D1117] hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}