import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyCareer, getModulesByCareer } from "../services/careerService";
import ModuleCard from "../components/ModuleCard";


function LearningModules() {
  const navigate = useNavigate();
  
  const [modules, setModules] = useState([]);
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        setError("");

        const careerResponse = await getMyCareer();

        const selectedCareer =
          careerResponse?.career ||
          careerResponse?.data?.career ||
          careerResponse?.enrollment?.career;

        const careerId =
          selectedCareer?._id ||
          careerResponse?.careerId ||
          careerResponse?.data?.careerId ||
          careerResponse?.enrollment?.careerId;

        if (!careerId) {
          setError("No career path selected yet.");
          return;
        }

        setCareer(selectedCareer);

        const moduleResponse = await getModulesByCareer(careerId);

        setModules(
          moduleResponse?.modules ||
            moduleResponse?.data?.modules ||
            moduleResponse?.data ||
            []
        );
      } catch (err) {
        setError(
          err.message || "Unable to load your learning modules."
        );
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-slate-500">
            Learning Path
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Learning Modules
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Follow your career path step by step and build practical skills.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {career && (
          <section className="mb-8 rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">
              Current Career Path
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {career.title || career.name || "Career Path"}
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Complete these modules to progress through your selected career.
            </p>
          </section>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              Loading your learning modules...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-800">{error}</p>
          </div>
        )}

        {!loading && !error && modules.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="font-semibold text-slate-900">
              No modules available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Learning modules will appear here once they are added to your
              career path.
            </p>
          </div>
        )}

        {!loading && modules.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
  {modules.map((module, index) => (
    <ModuleCard
      key={module._id || module.id || index}
      module={module}
      index={index}
    />
  ))}
</div>
        )}
      </main>
    </div>
  );
}

export default LearningModules;

// import { useEffect, useState } from "react";
// import { getMyCareer } from "../services/careerService";
// import { getModulesByCareer } from "../services/moduleService";

// function LearningModules() {
//   const [modules, setModules] = useState([]);
//   const [career, setCareer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadModules = async () => {
//       try {
//         const careerResponse = await getMyCareer();

//         const selectedCareer =
//           careerResponse.career || careerResponse.data;

//         setCareer(selectedCareer);

//         if (!selectedCareer?._id) {
//           setError("Please select a career path first.");
//           return;
//         }

//         const moduleResponse = await getModulesByCareer(
//           selectedCareer._id
//         );

//         setModules(
//           moduleResponse.modules || moduleResponse.data || []
//         );
//       } catch (error) {
//         console.error("Module loading failed:", error);

//         setError(
//           error.response?.data?.message ||
//             "Unable to load learning modules."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadModules();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-8 text-sm text-slate-500">
//         Loading learning modules...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 md:p-8">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-8">
//           <p className="text-sm font-medium text-slate-500">
//             Learning Journey
//           </p>

//           <h1 className="mt-1 text-3xl font-bold text-slate-900">
//             Learning Modules
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Follow the modules in your selected career path step by step.
//           </p>
//         </div>

//         {career && (
//           <div className="mb-8 rounded-2xl bg-slate-900 p-6 text-white">
//             <p className="text-sm text-slate-300">
//               Current Career
//             </p>

//             <h2 className="mt-2 text-2xl font-bold">
//               {career.title || career.name}
//             </h2>
//           </div>
//         )}

//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {!error && modules.length === 0 && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
//             <h2 className="font-semibold text-slate-900">
//               No modules available yet
//             </h2>

//             <p className="mt-2 text-sm text-slate-500">
//               Learning modules will appear here once they are added to this career path.
//             </p>
//           </div>
//         )}

//         <div className="space-y-4">
//           {modules.map((module, index) => (
//             <article
//               key={module._id}
//               className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
//                   {index + 1}
//                 </div>

//                 <div className="min-w-0">
//                   <h3 className="text-lg font-bold text-slate-900">
//                     {module.title || module.name}
//                   </h3>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     {module.description ||
//                       "Build practical skills through this learning module."}
//                   </p>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LearningModules;