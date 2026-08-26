import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCareers, getMyCareer, selectCareer } from "../services/careerService";
import { getMyCertificates } from "../services/certificateService";
import CareerRoadmap from "../components/CareerRoadmap";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";

function MyCareer() {
  const navigate = useNavigate();
  const toast = useToast();
  const [careers, setCareers] = useState([]);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [modules, setModules] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);
  const [error, setError] = useState("");
  const [userCert, setUserCert] = useState(null);

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [careerData, enrollmentData] = await Promise.all([
        getCareers(),
        getMyCareer().catch(() => ({ enrollment: null, career: null, modules: [], summary: {} })),
      ]);

      setCareers(careerData.careers || careerData.data || []);
      const activeCareer = enrollmentData.career || enrollmentData.enrollment?.career || null;
      setCurrentCareer(activeCareer);
      setModules(enrollmentData.modules || []);
      setOverallProgress(enrollmentData.summary?.overallProgress || enrollmentData.enrollment?.overallProgress || 0);
    } catch (err) {
      console.error("Career loading failed:", err);
      setError("Unable to load career information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareerData();
  }, []);

  useEffect(() => {
    if (currentCareer && overallProgress >= 100) {
      getMyCertificates()
        .then((res) => {
          if (res?.success && res?.certificates?.length > 0) {
            const currentId = currentCareer._id || currentCareer.id;
            const match =
              res.certificates.find(
                (c) => (c.career?._id || c.career?.id || c.career) === currentId
              ) || res.certificates[0];
            setUserCert(match);
          }
        })
        .catch((err) => console.warn("Failed to fetch certificate in MyCareer:", err));
    }
  }, [currentCareer, overallProgress]);

  const handleSelectCareer = async (careerId) => {
    try {
      setSelectingId(careerId);
      setError("");

      const data = await selectCareer(careerId);
      const selected = data.career || data.enrollment?.career;
      setCurrentCareer(selected);
      toast.success(`Career path selected: ${selected?.title || selected?.name || "Career"}`);
      await loadCareerData();
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.enrollment) {
        await loadCareerData();
      } else {
        const msg = err.response?.data?.message || err.message || "Unable to select this career path.";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setSelectingId(null);
    }
  };

  // 2. Career Snapshot Calculations
  const completedModules = useMemo(
    () => modules.filter((m) => m.status === "completed" || (m.progressPercentage || m.progress || 0) >= 100).length,
    [modules]
  );

  const currentModuleIndex = useMemo(
    () => modules.findIndex((m) => (m.progressPercentage || m.progress || 0) < 100),
    [modules]
  );
  const activeIndex = currentModuleIndex !== -1 ? currentModuleIndex : 0;
  const currentStageTitle = modules[activeIndex]?.title || "Stage 1";

  const estCompletionTime = useMemo(() => {
    const totalHours = modules.reduce((acc, m) => acc + (m.estimatedHours || 2), 0);
    return `~${totalHours || 24} Hours`;
  }, [modules]);

  // 3. Dedicated Skills List (10 skills)
  const skillsList = useMemo(() => {
    const defaultSkills = [
      { name: "HTML", icon: "🌐" },
      { name: "CSS", icon: "🎨" },
      { name: "JavaScript", icon: "⚡" },
      { name: "React", icon: "⚛️" },
      { name: "Node.js", icon: "🟢" },
      { name: "Express", icon: "🚂" },
      { name: "MongoDB", icon: "🍃" },
      { name: "REST API", icon: "🔗" },
      { name: "Responsive Design", icon: "📱" },
      { name: "Git", icon: "📦" },
    ];
    return defaultSkills;
  }, []);

  // Career Outcomes (4 cards)
  const careerOutcomes = [
    {
      title: "Build Real-World Projects",
      desc: "Produce end-to-end applications demonstrating core software architecture capabilities.",
      icon: "🛠️",
    },
    {
      title: "Master Full-Stack Technologies",
      desc: "Gain fluency in industry-standard frontend and backend frameworks.",
      icon: "🚀",
    },
    {
      title: "Create Portfolio-Ready Applications",
      desc: "Showcase verified project deliverables to recruiters and hiring managers.",
      icon: "💼",
    },
    {
      title: "Become Internship & Job Ready",
      desc: "Develop practical engineering competencies and workflow confidence.",
      icon: "🎯",
    },
  ];

  // Learning Resources (4 UI cards)
  const learningResources = [
    { title: "Documentation", desc: "Curated guides, cheat sheets, and official reference manuals.", icon: "📚", link: "#" },
    { title: "Practice Drills", desc: "Interactive exercises to reinforce algorithm & syntax mastery.", icon: "💻", link: "#" },
    { title: "Projects Library", desc: "Real-world project specifications and starter boilerplate repos.", icon: "📂", link: "#" },
    { title: "Self Assessments", desc: "Skill validation quizzes to test your conceptual knowledge.", icon: "📝", link: "#" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      {loading && <LoadingState message="Loading career path & roadmap..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadCareerData} />
      )}

      {!loading && !error && (
        <>
          {currentCareer ? (
            <div className="space-y-8">
              {/* 1. PREMIUM HERO SECTION */}
              <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-xl md:p-8 border border-slate-800 relative overflow-hidden transition-all hover:shadow-2xl">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active Career Path
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {currentCareer.title || currentCareer.name}
                    </h1>

                    <p className="text-sm leading-relaxed text-slate-300">
                      {currentCareer.overview || currentCareer.description || "Master industry competencies through structured, sequential learning stages."}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <span>🎯 Current Stage:</span>
                        <span className="text-white font-extrabold">Stage {activeIndex + 1} ({currentStageTitle})</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <span>⏱ Est. Completion:</span>
                        <span className="text-white font-extrabold">{estCompletionTime}</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-64 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shrink-0 text-center space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</p>
                    <p className="text-4xl font-extrabold text-white">{overallProgress}%</p>
                    <div className="pt-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => navigate("/learning-modules")}
                        className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-extrabold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95"
                      >
                        <span>{overallProgress >= 100 ? "Review Modules" : "Continue Learning"}</span>
                        <span>→</span>
                      </button>

                      {overallProgress >= 100 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (userCert?.certificateId) {
                              navigate(`/verify-certificate/${userCert.certificateId}`);
                            } else {
                              navigate("/progress");
                            }
                          }}
                          className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-extrabold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                        >
                          <span>🎓 {userCert ? "View Certificate" : "Claim Certificate"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. CAREER SNAPSHOT CARDS */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-emerald-300 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modules Completed</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-600">{completedModules}/{modules.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Mastered stages</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
                    ✓
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-blue-300 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Learned</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#2563EB]">{completedModules * 2}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Verified competencies</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] font-bold">
                    ⚡
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-indigo-300 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects Planned</p>
                    <p className="mt-1 text-2xl font-extrabold text-indigo-600">{modules.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Portfolio deliverables</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold">
                    📂
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-slate-300 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{overallProgress}%</p>
                    <p className="text-xs text-slate-400 mt-0.5">Roadmap completion</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-bold">
                    📊
                  </div>
                </div>
              </section>

              {/* 3. SKILLS YOU'LL LEARN */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Core Curriculum</span>
                  <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
                    Skills You'll Learn
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Key domain tools, frameworks, and engineering standards included in this career path.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {skillsList.map((skill, idx) => {
                    const isLearned = idx < completedModules * 2;
                    return (
                      <div
                        key={idx}
                        className={`group flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isLearned
                            ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                            : "bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-white"
                          }`}
                      >
                        <span className="text-sm">{skill.icon}</span>
                        <span>{skill.name}</span>
                        {isLearned && <span className="text-emerald-600 font-extrabold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 4. ROADMAP TIMELINE */}
              <CareerRoadmap
                career={currentCareer}
                modules={modules}
                overallProgress={overallProgress}
              />

              {/* 5. CAREER OUTCOME SECTION */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Career Impact</span>
                  <h3 className="text-2xl font-extrabold text-[#0F172A]">What You'll Achieve</h3>
                  <p className="text-xs text-slate-500">Measurable career outcomes upon completing this active curriculum.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {careerOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-xs transition-all hover:border-blue-300 hover:bg-white hover:shadow-md space-y-2"
                    >
                      <div className="text-2xl">{outcome.icon}</div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{outcome.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{outcome.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. LEARNING RESOURCES */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Supporting Hub</span>
                  <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
                    Learning Resources
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {learningResources.map((res, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-xs transition-all hover:border-[#2563EB] hover:bg-white hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="text-2xl">{res.icon}</div>
                        <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{res.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{res.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#2563EB] flex items-center justify-between">
                        <span>Access Resource</span>
                        <span>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. CONTINUE LEARNING CTA */}
              <section className="rounded-3xl bg-[#0F172A] p-8 text-white text-center shadow-xl border border-slate-800 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Ready to Advance Your Career Roadmap?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Continue your active lessons and master your next milestone stage.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/learning-modules")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 text-sm font-extrabold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>Continue Learning</span>
                    <span>→</span>
                  </button>
                </div>
              </section>
            </div>
          ) : (
            /* 8. BETTER EMPTY STATE */
            <EmptyState
              title="No Career Selected"
              description="Choose a learning path to begin your journey and activate your career roadmap."
              actionText="Explore Careers"
              actionOnClick={() => {
                const el = document.getElementById("career-catalog");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              icon={
                <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          )}

          {/* CAREER CATALOG OPTIONS */}
          <section id="career-catalog" className="pt-8 border-t border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                All Available Career Paths
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Switching paths updates your active curriculum roadmap.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {careers.map((career) => {
                const isSelected = currentCareer?._id === career._id;

                return (
                  <article
                    key={career._id}
                    className={`flex flex-col justify-between rounded-3xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isSelected
                        ? "border-[#2563EB] bg-white ring-2 ring-[#2563EB]/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-[#0F172A]">
                          {career.title || career.name}
                        </h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
                            Enrolled
                          </span>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {career.description || career.overview}
                      </p>

                      {career.skills && career.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {career.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={selectingId === career._id || isSelected}
                        onClick={() => handleSelectCareer(career._id)}
                        className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold transition-all duration-200 active:scale-[0.98] ${isSelected
                            ? "bg-slate-100 text-slate-400 cursor-default"
                            : "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-60"
                          }`}
                      >
                        {selectingId === career._id
                          ? "Selecting..."
                          : isSelected
                            ? "Active Career Path"
                            : "Select Career Path"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default MyCareer;