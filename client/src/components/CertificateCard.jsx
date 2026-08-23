import { useNavigate } from "react-router-dom";

function CertificateCard({ certificate, onViewClick }) {
  const navigate = useNavigate();

  if (!certificate) return null;

  const certId = certificate.certificateId || certificate.id;
  const careerTitle = certificate.career?.title || certificate.careerTitle || "Career Path";
  const issueDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Issued";

  const skills = certificate.skillsMastered || certificate.career?.skills || [];
  const hours = certificate.completionTimeHours || 0;

  const handleView = () => {
    if (onViewClick) {
      onViewClick(certId);
    } else if (certId) {
      navigate(`/verify-certificate/${certId}`);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/40 p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-emerald-300 space-y-5 relative overflow-hidden">
      {/* Decorative top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-bold border border-emerald-200 shadow-2xs">
            🎓
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Official Credential
            </span>
            <h4 className="text-base font-extrabold text-[#0F172A] mt-0.5 leading-snug">
              Certificate of Completion
            </h4>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-2xs shrink-0 self-start sm:self-center">
          <span>✓</span>
          <span>Verified Status</span>
        </span>
      </div>

      <div className="space-y-1.5 border-t border-emerald-100/80 pt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Enrolled Career Track
        </p>
        <p className="text-lg font-extrabold text-[#0F172A] leading-tight">
          {careerTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-slate-400 font-bold block text-[10px] uppercase">
            Certificate ID
          </span>
          <span className="font-mono font-bold text-indigo-700 text-xs">
            {certId}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-bold block text-[10px] uppercase">
            Issue Date
          </span>
          <span className="font-semibold text-slate-800 text-xs">
            {issueDate}
          </span>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Verified Competencies ({skills.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        {hours > 0 && (
          <span className="text-xs font-medium text-slate-500">
            ⏱ {hours} Total Learning Hours
          </span>
        )}

        <button
          type="button"
          onClick={handleView}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 transition active:scale-95 shrink-0 ml-auto"
        >
          <span>View Verified Certificate</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default CertificateCard;
