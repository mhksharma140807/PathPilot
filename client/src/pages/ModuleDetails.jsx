import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getModuleById } from "../services/moduleService";
import { getMyProgress, updateModuleProgress } from "../services/progressService";
import ProgressBar from "../components/ProgressBar";
import Sidebar from "../components/Sidebar";
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

      // Compute lesson completion state from overall progress
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

      // Set active lesson to first incomplete lesson if available
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

      // Automatically advance to next lesson if available
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Top Header */}
        <header className="border-b border-slate-200/80 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/learning-modules")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Modules</span>
            </button>

            {module && (
              <StatusBadge progress={progress} />
            )}
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8 md:px-8">
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
              {/* Module Hero Banner */}
              <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-lg md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="font-semibold uppercase tracking-wider text-cyan-400">
                    Module Deep Dive
                  </span>
                  {module.estimatedHours > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 font-medium text-slate-300 border border-slate-700">
                      <svg className="h-3.5 w-3.5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: ~{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  {module.title || module.name || "Module"}
                </h1>

                {module.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                    {module.description}
                  </p>
                )}
              </section>

              {/* Progress Tracker Widget */}
              <section className={`rounded-3xl border p-6 shadow-sm transition md:p-8 ${progress >= 100 ? 'border-[#10B981]/40 bg-emerald-50/60' : 'border-slate-200/80 bg-white'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      Overall Module Progress
                    </h2>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {progress >= 100
                        ? "🎉 Module Mastered! All lessons completed."
                        : `Completed ${completedLessonIndices.length} of ${lessons.length} lessons.`}
                    </p>
                  </div>

                  <span className={`text-2xl font-extrabold ${progress >= 100 ? 'text-[#10B981]' : 'text-[#0F172A]'}`}>
                    {progress}%
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar progress={progress} />
                </div>
              </section>

              {/* Lesson-Based Learning Experience Layout */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Lessons Sidebar Navigation */}
                <aside className="lg:col-span-4 space-y-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4">
                      Module Lessons ({lessons.length})
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
                                ? "bg-[#4F46E5] text-white shadow-sm"
                                : isDone
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100"
                                : "bg-slate-50 text-[#0F172A] hover:bg-slate-100 border border-slate-200/50"
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

                  {/* Objectives Box */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                      Learning Objectives
                    </h3>
                    <ul className="space-y-2.5 text-xs text-[#64748B]">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#4F46E5] font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Main Lesson Content Card */}
                <main className="lg:col-span-8 space-y-6">
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8 flex flex-col justify-between min-h-[400px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
                            Lesson {activeLessonIndex + 1} of {lessons.length}
                          </span>
                          <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1">
                            {currentLesson?.title}
                          </h2>
                        </div>
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-[#64748B]">
                          ~{currentLesson?.duration || "15 mins"}
                        </span>
                      </div>

                      <div className="prose max-w-none text-sm leading-relaxed text-[#0F172A] space-y-4">
                        <p>{currentLesson?.content}</p>
                      </div>

                      {currentLesson?.keyTakeaway && (
                        <div className="mt-8 rounded-2xl bg-indigo-50/70 border border-indigo-100 p-4 text-xs font-medium text-[#4F46E5]">
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
                          className="rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#3730A3] shadow-md disabled:opacity-60"
                        >
                          {completedLessonIndices.includes(activeLessonIndex)
                            ? "✓ Lesson Completed"
                            : updating
                            ? "Saving..."
                            : "Mark Lesson Complete"}
                        </button>

                        <button
                          type="button"
                          disabled={activeLessonIndex === lessons.length - 1}
                          onClick={() => setActiveLessonIndex((prev) => Math.min(prev + 1, lessons.length - 1))}
                          className="rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40"
                        >
                          Next Lesson →
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ModuleDetails;