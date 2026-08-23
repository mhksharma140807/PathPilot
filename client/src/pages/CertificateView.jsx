import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyCertificate } from "../services/certificateService";

function CertificateView() {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertificateData = async () => {
    if (!certificateId) {
      setError("No Certificate ID specified.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await verifyCertificate(certificateId);
      if (res?.success && (res?.certificate || res?.data)) {
        setCertificate(res.certificate || res.data);
      } else {
        setError(res?.message || "Certificate could not be verified.");
      }
    } catch (err) {
      console.error("Certificate verification failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid or non-existent Certificate ID. Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificateData();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const studentName =
    certificate?.studentName ||
    certificate?.student?.name ||
    "Verified PathPilot Graduate";

  const careerTitle =
    certificate?.careerTitle ||
    certificate?.career?.title ||
    "Professional Career Track";

  const certIdStr = certificate?.certificateId || certificateId || "";

  const formattedDate = certificate?.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified Date";

  const skills =
    certificate?.skillsMastered || certificate?.career?.skills || [];
  const hours = certificate?.completionTimeHours || 0;
  const verificationUrl = `${window.location.origin}/verify-certificate/${certIdStr}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 md:px-8 selection:bg-blue-600 selection:text-white">
      {/* 1. TOP ACTION BAR (Hidden during print) */}
      <div className="mx-auto max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-white transition"
          >
            PathPilot Home
          </Link>

          {certificate && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg hover:bg-blue-600 transition active:scale-95 cursor-pointer"
            >
              <span>🖨️ Print / Save as PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-800/50 p-12 text-center space-y-4 animate-pulse print:hidden">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold text-xl">
            🎓
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Verifying credential authenticity...
          </p>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {!loading && error && (
        <div className="mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center space-y-4 shadow-xl print:hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-900/60 text-red-400 text-2xl font-bold border border-red-700/50">
            ⚠️
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              Certificate Verification Failed
            </h2>
            <p className="mt-1 text-xs text-red-300 leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* 4. OFFICIAL CERTIFICATE DOCUMENT CONTAINER */}
      {!loading && certificate && (
        <main className="mx-auto max-w-4xl print:max-w-none print:w-full print:m-0 print:p-0">
          <div className="relative rounded-3xl border-4 border-amber-400/80 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 sm:p-12 shadow-2xl overflow-hidden print:border-4 print:border-amber-500 print:bg-white print:text-slate-900 print:shadow-none print:rounded-none">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none print:hidden" />

            {/* Certificate Outer Framing Corner Accents */}
            <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-amber-400/70 print:border-amber-600" />
            <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-amber-400/70 print:border-amber-600" />
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-400/70 print:border-amber-600" />
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-400/70 print:border-amber-600" />

            <div className="relative z-10 space-y-8 text-center">
              {/* BRAND HEADER */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-400 border border-blue-400/30 print:bg-blue-50 print:text-blue-700 print:border-blue-200">
                  <span>🎓</span>
                  <span>PathPilot Career Learning Ecosystem</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 print:text-amber-700">
                  CERTIFICATE OF COMPLETION
                </h1>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400 print:text-slate-600">
                  Verified Engineering Credential
                </p>
              </div>

              {/* RECIPIENT SECTION */}
              <div className="space-y-3 py-2 border-y border-slate-800/80 print:border-slate-300">
                <p className="text-xs sm:text-sm text-slate-400 italic print:text-slate-600">
                  This officially certifies that
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-serif print:text-slate-900">
                  {studentName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed print:text-slate-700">
                  has successfully completed all curriculum requirements, practical assessment modules, and verified industry competencies for the career path:
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight pt-1 print:text-blue-700">
                  {careerTitle}
                </h3>
              </div>

              {/* VERIFIED SKILLS BADGES */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 print:text-slate-500">
                    Verified Competencies & Frameworks
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-200 shadow-2xs print:bg-slate-100 print:text-slate-800 print:border-slate-300"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* METADATA GRID & OFFICIAL BADGE */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-t border-slate-800/80 text-left text-xs print:border-slate-300">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block print:text-slate-500">
                    Certificate Identifier
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-sm block print:text-amber-700">
                    {certIdStr}
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-400 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300">
                    <span>✓</span>
                    <span>Status: VERIFIED VALID</span>
                  </div>
                  {hours > 0 && (
                    <p className="text-[11px] text-slate-400 font-semibold block pt-0.5 print:text-slate-600">
                      Total Time: ~{hours} Hours
                    </p>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block print:text-slate-500">
                    Issue Date
                  </span>
                  <span className="font-bold text-slate-200 text-xs block print:text-slate-900">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* FOOTER VERIFICATION URL */}
              <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 print:border-slate-300 print:text-slate-600">
                <span>Issuer: PathPilot Engineering Platform</span>
                <span className="font-mono text-slate-400 select-all">
                  Verification URL: {verificationUrl}
                </span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 5. EMBEDDED PRINT STYLING */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}

export default CertificateView;
