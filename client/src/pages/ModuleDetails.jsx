import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getModuleById } from "../services/moduleService";
import { getMyProgress, updateModuleProgress } from "../services/progressService";
import ProgressBar from "../components/ProgressBar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

function ModuleDetails() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIndices, setCompletedLessonIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const defaultObjectives = [
    "Master foundational concepts and architecture principles.",
    "Develop hands-on implementation competency.",
    "Produce showcase-ready project deliverables for your portfolio."
  ];

  const getDefaultLessons = (modTitle) => [
    {
      title: `1. Core Overview of ${modTitle || 'Module'}`,
      duration: "15 mins",
      content: `Welcome to this module on ${modTitle || 'your track'}. In this lesson, we break down the primary principles, industry standards, and architectural blueprints required to excel in this topic. Review the core concepts thoroughly before moving into practical tasks.`,
      keyTakeaway: "Understanding fundamental principles ensures software reliability and scalability."
    },
    {
      title: `2. Deep-Dive & Key Concepts`,
      duration: "25 mins",
      content: "Building on the foundation, this section explores advanced patterns, optimization routines, and practical workflows. Ensure you understand how data flows across components and how to diagnose common edge cases.",
      keyTakeaway: "Clean separation of concerns improves code readability and maintainability."
    },
    {
      title: `3. Practical Activity & Assessment`,
      duration: "20 mins",
      content: "Put your knowledge to test! Create a practical prototype demonstrating the skills covered in the previous lessons. Verify error handling, edge cases, and user interface responsiveness.",
      keyTakeaway: "Empirical testing and practice build confidence for real-world projects."
    }
  ];

  const loadModuleDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [moduleData, progressData] = await Promise.all([
        getModuleById(moduleId),
        getMyProgress().catch(() => ({ progress: [] })),
      ]);

      const fetchedMod = moduleData?.module || moduleData;
      setModule(fetchedMod);

      const progList = progressData?.progress || [];
      let currentProg = 0;
      if (Array.isArray(progList)) {
        const found = progList.find(
          (item) => item.module?._id === moduleId || item.module === moduleId
        );
        currentProg = found?.progressPercentage ?? found?.progress ?? 0;
        setProgress(currentProg);
      }

      const lessonsList = fetchedMod?.lessons?.length > 0
        ? fetchedMod.lessons
        : getDefaultLessons(fetchedMod?.title);

      const totalL = lessonsList.length;
      const numCompleted = Math.round((currentProg / 100) * totalL);
      const completedIndices = [];
      for (let i = 0; i < numCompleted; i++) {
        completedIndices.push(i);
      }
      setCompletedLessonIndices(completedIndices);

      if (numCompleted < totalL) {
        setActiveLessonIndex(numCompleted);
      } else {
        setActiveLessonIndex(0);
      }

    } catch (err) {
      console.error("Failed to load module details:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to load this learning module."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      loadModuleDetails();
    }
  }, [moduleId]);

  const lessons = (module?.lessons?.length > 0)
    ? module.lessons
    : getDefaultLessons(module?.title);

  const objectives = (module?.objectives?.length > 0)
    ? module.objectives
    : defaultObjectives;

  const currentLesson = lessons[activeLessonIndex] || lessons[0];

  const handleMarkLessonComplete = async (indexToComplete) => {
    try {
      setUpdating(true);
      setError("");

      let updatedIndices = [...completedLessonIndices];
      if (!updatedIndices.includes(indexToComplete)) {
        updatedIndices.push(indexToComplete);
      }

      setCompletedLessonIndices(updatedIndices);

      const totalL = lessons.length;
      const newProgress = Math.min(Math.round((updatedIndices.length / totalL) * 100), 100);

      await updateModuleProgress(moduleId, newProgress);
      setProgress(newProgress);

      if (indexToComplete + 1 < totalL) {
        setActiveLessonIndex(indexToComplete + 1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to update lesson progress."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 md:px-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate("/learning-modules")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-[#0F172A]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Learning Modules</span>
        </button>

        {module && (
          <StatusBadge progress={progress} />
        )}
      </div>

      {loading && <LoadingState message="Loading module content..." />}

      {!loading && error && !module && (
        <ErrorState message={error} onRetry={loadModuleDetails} />
      )}

      {!loading && !module && (
        <EmptyState
          title="Module Not Found"
          description="The requested module could not be found."
          actionText="Back to Learning Modules"
          actionLink="/learning-modules"
        />
      )}

      {!loading && module && (
        <>
          {/* Module Banner Header */}
          <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-[#2563EB]">
                Module {module.moduleNumber || ""} Focus Unit
              </span>
              {module.estimatedHours > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 font-medium text-slate-300 border border-slate-700">
                  Duration: ~{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-white">
              {module.title || module.name || "Module"}
            </h1>

            {module.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                {module.description}
              </p>
            )}
          </section>

          {/* Progress & Completion Status Card */}
          <section className={`rounded-3xl border p-6 shadow-xs transition ${progress >= 100 ? 'border-emerald-300 bg-emerald-50/80' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {progress >= 100 ? "🎉 Module Fully Mastered!" : "Module Completion Progress"}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  {progress >= 100
                    ? "Congratulations! You have completed all lessons in this learning module."
                    : `Completed ${completedLessonIndices.length} of ${lessons.length} lessons.`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-2xl font-extrabold ${progress >= 100 ? 'text-emerald-600' : 'text-[#2563EB]'}`}>
                  {progress}%
                </span>

                {progress >= 100 && (
                  <button
                    type="button"
                    onClick={() => navigate("/learning-modules")}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <span>Proceed to Next Module →</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar progress={progress} />
            </div>
          </section>

          {/* Learning Experience Layout */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Lessons Sidebar & Objectives */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-4">
                  Lessons & Topics ({lessons.length})
                </h3>

                <div className="space-y-2">
                  {lessons.map((les, idx) => {
                    const isActive = idx === activeLessonIndex;
                    const isDone = completedLessonIndices.includes(idx);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-semibold transition ${
                          isActive
                            ? "bg-[#2563EB] text-white shadow-xs"
                            : isDone
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-50 text-[#0F172A] hover:bg-slate-100 border border-slate-200/60"
                        }`}
                      >
                        <span className="truncate pr-2">{les.title}</span>
                        {isDone ? (
                          <span className="shrink-0 font-bold text-emerald-600">✓</span>
                        ) : (
                          <span className="shrink-0 text-slate-400">{les.duration}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Objectives Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Learning Objectives
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Lesson Main Viewer */}
            <main className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
                        Lesson {activeLessonIndex + 1} of {lessons.length}
                      </span>
                      <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1">
                        {currentLesson?.title}
                      </h2>
                    </div>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      ~{currentLesson?.duration || "15 mins"}
                    </span>
                  </div>

                  <div className="prose max-w-none text-sm leading-relaxed text-[#0F172A] space-y-4">
                    <p>{currentLesson?.content}</p>
                  </div>

                  {currentLesson?.keyTakeaway && (
                    <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs font-medium text-[#2563EB]">
                      <span className="font-bold block mb-1">💡 Key Takeaway:</span>
                      {currentLesson.keyTakeaway}
                    </div>
                  )}
                </div>

                {/* Lesson Controls */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={activeLessonIndex === 0}
                    onClick={() => setActiveLessonIndex((prev) => Math.max(prev - 1, 0))}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#0F172A] transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    ← Previous Lesson
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={updating || completedLessonIndices.includes(activeLessonIndex)}
                      onClick={() => handleMarkLessonComplete(activeLessonIndex)}
                      className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-xs disabled:opacity-60"
                    >
                      {completedLessonIndices.includes(activeLessonIndex)
                        ? "✓ Lesson Completed"
                        : updating
                        ? "Saving..."
                        : "Mark Progress"}
                    </button>

                    {activeLessonIndex === lessons.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => navigate("/learning-modules")}
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-xs"
                      >
                        Next Module →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveLessonIndex((prev) => Math.min(prev + 1, lessons.length - 1))}
                        className="rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default ModuleDetails;