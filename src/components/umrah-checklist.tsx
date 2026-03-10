"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Info,
} from "lucide-react";

// ─── Umrah Steps Data ────────────────────────────────────────────────────────

interface UmrahStep {
  id: string;
  title: string;
  titleAr: string;
  emoji: string;
  description: string;
  dua?: string;
  duaTranslation?: string;
  tips?: string[];
  kidFriendlyNote?: string;
}

const UMRAH_STEPS: UmrahStep[] = [
  {
    id: "ihram",
    title: "Enter State of Ihram",
    titleAr: "الإحرام",
    emoji: "🕊️",
    description:
      "Wear the Ihram garments (two white unstitched cloths for men). Make the intention (niyyah) for Umrah and recite the Talbiyah.",
    dua: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    duaTranslation:
      "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Indeed, all praise, grace, and sovereignty belong to You. You have no partner.",
    tips: [
      "Enter Ihram at or before the Miqat point",
      "Pray two rak'ahs before changing",
      "Use unscented soap and products",
    ],
    kidFriendlyNote:
      "Kids don't have to wear Ihram, but they can wear simple white clothes to feel included! 👶",
  },
  {
    id: "tawaf",
    title: "Tawaf (7 Rounds)",
    titleAr: "الطواف",
    emoji: "🕋",
    description:
      "Walk around the Ka'bah seven times in a counterclockwise direction, starting from the Black Stone (Hajr al-Aswad).",
    dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    duaTranslation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    tips: [
      "Stay in Wudu throughout Tawaf",
      "Men can do Idtiba (bare right shoulder) during Tawaf",
      "Make du'a freely during each round",
      "Point or kiss the Black Stone if possible at the start of each round",
    ],
    kidFriendlyNote:
      "Use a stroller for little ones! The Mataf area can be crowded, so keep kids close. Front baby carriers work great for babies. 👶🏻",
  },
  {
    id: "pray-maqam",
    title: "Pray 2 Rak'ahs at Maqam Ibrahim",
    titleAr: "صلاة ركعتين",
    emoji: "🤲",
    description:
      "After completing Tawaf, pray two rak'ahs behind Maqam Ibrahim (Station of Ibrahim). If crowded, you can pray anywhere in the Masjid.",
    dua: "وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى",
    duaTranslation:
      "And take the standing place of Ibrahim as a place of prayer.",
    tips: [
      "Recite Surah Al-Kafirun in the first rak'ah",
      "Recite Surah Al-Ikhlas in the second rak'ah",
      "If the area is crowded, pray anywhere in the mosque",
    ],
    kidFriendlyNote:
      "Let the kids see Maqam Ibrahim — it has Ibrahim's (AS) footprints preserved in stone! ✨",
  },
  {
    id: "zamzam",
    title: "Drink Zamzam Water",
    titleAr: "ماء زمزم",
    emoji: "💧",
    description:
      "Drink Zamzam water from the coolers available in the Masjid. Make du'a before drinking as the Prophet ﷺ said Zamzam water is for whatever purpose it is drunk for.",
    tips: [
      "Face the Ka'bah while drinking",
      "Drink in three sips",
      "Make du'a before each sip",
      "Zamzam coolers are available throughout the Masjid",
    ],
    kidFriendlyNote:
      "Kids love Zamzam water! Bring a small cup for them and let them drink too. You can take some home in bottles! 🧃",
  },
  {
    id: "sai",
    title: "Sa'i (7 Laps between Safa & Marwa)",
    titleAr: "السعي",
    emoji: "🏃",
    description:
      "Walk between the hills of Safa and Marwa seven times. Start at Safa and end at Marwa. One trip from Safa to Marwa counts as one lap.",
    dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
    duaTranslation:
      "Indeed, Safa and Marwa are among the symbols of Allah.",
    tips: [
      "Start from Safa hill",
      "Men should jog between the green lights",
      "Make du'a at the top of Safa and Marwa",
      "You don't need to be in Wudu for Sa'i (but it's better)",
      "The Sa'i area is now air-conditioned",
    ],
    kidFriendlyNote:
      "The Sa'i walkway is long (about 450m each way). Use a stroller or wheelchair for tired little ones. There are rest areas along the way! 🍼",
  },
  {
    id: "shave",
    title: "Shave or Trim Hair",
    titleAr: "الحلق أو التقصير",
    emoji: "💈",
    description:
      "Men should shave their head completely (Halq) or trim their hair short (Taqsir). Women trim a fingertip's length from their hair. This completes the Umrah!",
    tips: [
      "Halq (shaving) is recommended for men",
      "Women only trim a small amount (fingertip length)",
      "Many barber shops are near the Masjid",
      "After this step, all Ihram restrictions are lifted",
    ],
    kidFriendlyNote:
      "For boys, a small trim is fine! Girls only need a tiny snip. Some barbers are very gentle with kids. 💇‍♂️",
  },
];

// ─── Duas Reference ──────────────────────────────────────────────────────────

interface Dua {
  id: string;
  title: string;
  occasion: string;
  arabic: string;
  transliteration: string;
  translation: string;
  emoji: string;
}

const DUAS: Dua[] = [
  {
    id: "entering-masjid",
    title: "Entering the Masjid",
    occasion: "When entering Masjid al-Haram",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahummaf-tah li abwaba rahmatik",
    translation: "O Allah, open the gates of Your mercy for me.",
    emoji: "🚪",
  },
  {
    id: "seeing-kaaba",
    title: "Seeing the Ka'bah",
    occasion: "First time seeing the Ka'bah",
    arabic: "اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً",
    transliteration:
      "Allahumma zid hadhal-bayta tashrifan wa ta'zeeman wa takreeman wa mahabah",
    translation:
      "O Allah, increase this House in honor, esteem, respect, and reverence.",
    emoji: "🕋",
  },
  {
    id: "between-rukn-yamani",
    title: "Between Rukn Yamani & Black Stone",
    occasion: "During each round of Tawaf",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adhaban-naar",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    emoji: "🤲",
  },
  {
    id: "safa-marwa",
    title: "At Safa & Marwa",
    occasion: "When climbing Safa or Marwa during Sa'i",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
    transliteration: "Innas-Safa wal-Marwata min sha'aa'irillah",
    translation: "Indeed, Safa and Marwa are among the symbols of Allah.",
    emoji: "⛰️",
  },
  {
    id: "zamzam-dua",
    title: "Before Drinking Zamzam",
    occasion: "When about to drink Zamzam water",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    transliteration:
      "Allahumma inni as'aluka 'ilman nafi'an wa rizqan wasi'an wa shifa'an min kulli da'",
    translation:
      "O Allah, I ask You for beneficial knowledge, abundant provision, and healing from every illness.",
    emoji: "💧",
  },
  {
    id: "leaving-masjid",
    title: "Leaving the Masjid",
    occasion: "When exiting Masjid al-Haram",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik",
    translation: "O Allah, I ask You from Your bounty.",
    emoji: "🚶",
  },
  {
    id: "travel-dua",
    title: "Travel Du'a",
    occasion: "When starting the journey",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamun-qalibun",
    translation:
      "Glory be to Him who has subjected this to us, and we could never have it (by our efforts), and to our Lord we shall surely return.",
    emoji: "✈️",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface UmrahChecklistProps {
  onProgressChange?: (completed: number, total: number) => void;
}

export function UmrahChecklist({ onProgressChange }: UmrahChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<string | null>("ihram");
  const [activeTab, setActiveTab] = useState<"checklist" | "duas">("checklist");
  const [expandedDua, setExpandedDua] = useState<string | null>(null);

  const toggleStep = (stepId: string) => {
    const next = new Set(completedSteps);
    if (next.has(stepId)) {
      next.delete(stepId);
    } else {
      next.add(stepId);
    }
    setCompletedSteps(next);
    onProgressChange?.(next.size, UMRAH_STEPS.length);
  };

  const progress = (completedSteps.size / UMRAH_STEPS.length) * 100;

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
            activeTab === "checklist"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          🕋 Umrah Steps
        </button>
        <button
          onClick={() => setActiveTab("duas")}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
            activeTab === "duas"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          📖 Du&apos;as Reference
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "checklist" ? (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">
                  Umrah Progress
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {completedSteps.size}/{UMRAH_STEPS.length} steps
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
              {completedSteps.size === UMRAH_STEPS.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-center"
                >
                  <Sparkles className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-emerald-700">
                    Umrah Complete! Masha&apos;Allah! 🎉
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    May Allah accept your Umrah. Ameen.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {UMRAH_STEPS.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isExpanded = expandedStep === step.id;

                return (
                  <motion.div
                    key={step.id}
                    layout
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      isCompleted
                        ? "bg-emerald-50/80 border-emerald-200"
                        : "bg-white/80 border-slate-100"
                    }`}
                  >
                    {/* Step Header */}
                    <div className="flex items-center gap-3 p-4">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="flex-shrink-0"
                      >
                        <motion.div
                          whileTap={{ scale: 0.8 }}
                          className="relative"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <Circle className="w-7 h-7 text-slate-300" />
                          )}
                        </motion.div>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedStep(isExpanded ? null : step.id)
                        }
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            Step {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-lg">{step.emoji}</span>
                          <span
                            className={`font-bold ${
                              isCompleted
                                ? "text-emerald-700 line-through"
                                : "text-slate-800"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {step.titleAr}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedStep(isExpanded ? null : step.id)
                        }
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {/* Description */}
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {step.description}
                            </p>

                            {/* Dua */}
                            {step.dua && (
                              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="text-xs font-bold text-amber-700">
                                    Du&apos;a
                                  </span>
                                </div>
                                <p
                                  className="text-right text-lg leading-loose text-amber-900 font-semibold"
                                  dir="rtl"
                                >
                                  {step.dua}
                                </p>
                                {step.duaTranslation && (
                                  <p className="text-xs text-amber-700 mt-2 italic">
                                    &quot;{step.duaTranslation}&quot;
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Tips */}
                            {step.tips && step.tips.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-xs font-bold text-slate-500">
                                  💡 Tips
                                </span>
                                {step.tips.map((tip, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-slate-600"
                                  >
                                    <span className="text-emerald-400 mt-0.5">
                                      •
                                    </span>
                                    <span>{tip}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Kid-Friendly Note */}
                            {step.kidFriendlyNote && (
                              <div className="rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Info className="w-3.5 h-3.5 text-sky-600" />
                                  <span className="text-xs font-bold text-sky-700">
                                    Kids Note
                                  </span>
                                </div>
                                <p className="text-sm text-sky-700">
                                  {step.kidFriendlyNote}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="duas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-3">
              {DUAS.map((dua) => {
                const isExpanded = expandedDua === dua.id;

                return (
                  <motion.div
                    key={dua.id}
                    layout
                    className="rounded-2xl bg-white/80 border border-slate-100 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedDua(isExpanded ? null : dua.id)
                      }
                      className="flex items-center gap-3 p-4 w-full text-left"
                    >
                      <span className="text-2xl">{dua.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">
                          {dua.title}
                        </p>
                        <p className="text-xs text-slate-400">{dua.occasion}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {/* Arabic */}
                            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4">
                              <p
                                className="text-right text-xl leading-loose text-emerald-900 font-semibold"
                                dir="rtl"
                              >
                                {dua.arabic}
                              </p>
                            </div>

                            {/* Transliteration */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Transliteration
                              </span>
                              <p className="text-sm text-slate-600 italic mt-0.5">
                                {dua.transliteration}
                              </p>
                            </div>

                            {/* Translation */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Translation
                              </span>
                              <p className="text-sm text-slate-700 mt-0.5">
                                &quot;{dua.translation}&quot;
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
