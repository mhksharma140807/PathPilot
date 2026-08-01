import { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      step: "01",
      title: "Choose Path",
      desc: "Select a curated tech career path aligned with industry role requirements and skill standards.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      step: "02",
      title: "Learn Skills",
      desc: "Work through step-by-step topic modules and practical exercises to build real technical competency.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      step: "03",
      title: "Track Progress",
      desc: "Monitor your completion percentage and celebrate milestones as you advance along your learning journey.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  const services = [
    {
      title: "Structured Career Roadmaps",
      desc: "Clear sequence of learning stages designed to guide students from fundamentals to job readiness.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Self-Paced Learning Units",
      desc: "Interactive modules breaking down complex domain topics into manageable, actionable lessons.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Real-Time Progress Tracking",
      desc: "Visual analytics showcasing completed milestones and overall curriculum completion rates.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Targeted Skill Acquisition",
      desc: "Master industry-standard skills with clear domain takeaways per module.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased">
      {/* 1. PUBLIC NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-xs">
                P
              </div>
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                PathPilot
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                <a href="#" className="transition hover:text-[#2563EB]">Home</a>
                <a href="#services" className="transition hover:text-[#2563EB]">Services</a>
                <a href="#about" className="transition hover:text-[#2563EB]">About Us</a>
              </nav>

              <Link
                to="/login"
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-xs"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">About Us</a>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 text-sm font-bold text-white bg-[#2563EB] rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="min-h-[calc(100vh-4rem)] md:min-h-0 flex items-center py-6 sm:py-12 md:py-20 lg:py-28 bg-white border-b border-slate-200">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                Career Learning Ecosystem
              </div>

              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                Navigate Your Tech Career. <br />
                <span className="text-[#2563EB]">Build Real-World Mastery.</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Select structured career paths, master topic modules at your own pace, and track your milestone progress with PathPilot.
              </p>

              <div className="pt-2 sm:pt-4 flex justify-center">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-9 py-4 text-base md:px-8 md:py-3.5 md:text-sm font-extrabold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THREE PREMIUM FEATURE CARDS */}
        <section className="py-10 sm:py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                How PathPilot Empowers Your Learning
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Three core steps to transform your learning journey into career readiness.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3">
              {features.map((feat, idx) => (
                <article
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                        {feat.icon}
                      </div>
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-300">
                        {feat.step}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      <span>Explore Feature</span>
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SERVICES SECTION */}
        <section id="services" className="py-10 sm:py-16 md:py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Our Services & Capabilities
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Designed to deliver structured direction and clear measurable goals.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
              {services.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 mb-3 sm:mb-4 shadow-2xs">
                      {s.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ABOUT US SECTION */}
        <section id="about" className="py-10 sm:py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 md:p-12 shadow-xs text-center space-y-3 sm:space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Project Story & Mission
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                About PathPilot
              </h2>
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                PathPilot was created to solve the lack of structured guidance in tech learning. By organizing complex fields into clear roadmaps and self-paced learning modules, PathPilot helps students choose a direction, stay focused, and build measurable skills with clarity.
              </p>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA BANNER */}
        <section className="py-10 sm:py-16 md:py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl bg-[#0F172A] p-6 sm:p-10 md:p-12 text-white shadow-xl space-y-4">
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Start Your Career Journey?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Join PathPilot today, enroll in your target career path, and start building skills.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-block w-full sm:w-auto px-9 py-4 text-sm md:px-8 md:py-3.5 md:text-xs font-extrabold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-md text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. COMPACT FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 py-8 md:py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-xs">
              P
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-sm">PathPilot</span>
              <p className="text-[11px] text-slate-400">Career Learning Ecosystem</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#about" className="hover:text-white transition">About Us</a>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </nav>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} PathPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
