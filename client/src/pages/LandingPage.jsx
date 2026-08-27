import { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactForm({ name: "", email: "", message: "" });
      }, 500);
    }
  };

  // 1. Trust Indicators
  const trustIndicators = [
    "Structured Roadmaps",
    "Real Projects",
    "Progress Tracking",
    "Career Focused Learning",
  ];

  // 2. Services Feature Cards (6 items)
  const services = [
    {
      title: "Career Roadmaps",
      desc: "Comprehensive step-by-step career path blueprints tailored to modern industry roles.",
      actionLabel: "View Blueprint",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "Learning Modules",
      desc: "Self-paced interactive units breaking down complex technologies into digestible lessons.",
      actionLabel: "Explore Lessons",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Skill Tracking",
      desc: "Monitor domain competencies and practical skill takeaways per completed module.",
      actionLabel: "Track Skills",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Project Based Learning",
      desc: "Apply theoretical concepts directly into real-world showcase project deliverables.",
      actionLabel: "Build Projects",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Progress Analytics",
      desc: "Real-time visual metrics detailing overall curriculum progress and milestone velocity.",
      actionLabel: "View Analytics",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Profile Management",
      desc: "Manage account settings, enrolled paths, learner identity, and custom preferences.",
      actionLabel: "Manage Profile",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  // 3. Why Choose PathPilot (6 items with SVG icons)
  const whyReasons = [
    {
      title: "Structured Learning",
      desc: "No more tutorial hell. Follow guided, sequential tracks built for mastery.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <circle cx="12" cy="12" r="5" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
        </svg>
      ),
    },
    {
      title: "Industry Inspired Roadmaps",
      desc: "Curriculum designed around real software engineering and tech role demands.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Track Progress",
      desc: "Visual milestone tracking gives you clear visibility into your growth.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3 3 7-7m-5 8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Modern Dashboard",
      desc: "Clean, distraction-free command center tailored specifically for students.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Career Oriented",
      desc: "Focus on practical competencies that hiring managers actually look for.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Responsive Experience",
      desc: "Seamless learning across desktop, tablet, and mobile browsers.",
      icon: (
        <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // 4. Learning Journey Steps (5 steps)
  const journeySteps = [
    { num: "01", title: "Choose Career", desc: "Select a specialized career path blueprint." },
    { num: "02", title: "Complete Modules", desc: "Master self-paced interactive lessons." },
    { num: "03", title: "Build Projects", desc: "Apply knowledge to portfolio deliverables." },
    { num: "04", title: "Track Progress", desc: "Monitor completion stats and badges." },
    { num: "05", title: "Become Job Ready", desc: "Gain market-ready technical confidence." },
  ];

  // 5. Statistics (4 items)
  const stats = [
    { value: "6", label: "CAREER PATHS" },
    { value: "120+", label: "CURATED LESSONS" },
    { value: "40+", label: "HANDS-ON PROJECTS" },
    { value: "100%", label: "COMPLETION METRICS" },
  ];

  // 6. FAQs (5 items)
  const faqs = [
    {
      q: "What is PathPilot?",
      a: "PathPilot is a career learning platform designed to guide tech learners from beginner fundamentals to job readiness through structured roadmaps and interactive modules.",
    },
    {
      q: "Who can use it?",
      a: "Students, career switchers, and developers seeking structured guidance to build job-ready skills.",
    },
    {
      q: "How does learning work?",
      a: "Enroll in a career path, complete ordered learning units, complete practical exercises, and track your milestone progress.",
    },
    {
      q: "Do I get projects?",
      a: "Yes! Each module includes practical activities and project tasks designed to create portfolio-ready deliverables.",
    },
    {
      q: "Can I track progress?",
      a: "Absolutely. Real-time analytics track your completed lessons, overall curriculum completion percentage, and active focus stages.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased overflow-x-hidden">
      {/* 1. PUBLIC NAVBAR - FIXED */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-2xs border border-blue-700/20 group-hover:bg-[#1D4ED8] transition">
                P
              </div>
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                PathPilot
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                <a href="#hero" className="transition-colors hover:text-[#2563EB]">Home</a>
                <a href="#services" className="transition-colors hover:text-[#2563EB]">Services</a>
                <a href="#why-choose" className="transition-colors hover:text-[#2563EB]">Why PathPilot</a>
                <a href="#journey" className="transition-colors hover:text-[#2563EB]">Timeline</a>
                <a href="#faq" className="transition-colors hover:text-[#2563EB]">FAQ</a>
                <a href="#contact" className="transition-colors hover:text-[#2563EB]">Contact</a>
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#2563EB] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Services</a>
            <a href="#why-choose" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Why PathPilot</a>
            <a href="#journey" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Timeline</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">FAQ</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#2563EB]">Contact</a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#2563EB] rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* 1. PROFESSIONAL HERO SECTION */}
        <section id="hero" className="relative py-10 sm:py-14 lg:py-16 bg-white border-b border-slate-200/80 overflow-hidden bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 lg:gap-10 items-center">

              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-mono font-bold text-[#2563EB] border border-blue-100/90 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                  [ PATHPILOT V2 ] • STRUCTURED CAREER LEARNING
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
                  Navigate Your Tech Career. <br className="hidden sm:inline" />
                  <span className="text-[#2563EB]">Build Real-World Mastery.</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Select structured career paths, master topic modules at your own pace, and track your milestone progress with PathPilot.
                </p>

                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto h-10 sm:h-11 px-6 inline-flex items-center justify-center text-xs sm:text-sm font-extrabold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition shadow-2xs active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Get Started Free →
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto h-10 sm:h-11 px-6 inline-flex items-center justify-center text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    Sign In to Dashboard
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-5 border-t border-slate-100 max-w-xl mx-auto lg:mx-0">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center lg:text-left">
                    {trustIndicators.map((trust, idx) => (
                      <div key={idx} className="flex items-center justify-center lg:justify-start gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-lg py-1.5 px-2.5 shadow-2xs">
                        <svg className="h-3 w-3 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{trust}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Product Preview Composition */}
              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">

                  {/* Main Compact Preview Container */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-md shadow-slate-200/50 space-y-4 text-left relative z-10">

                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[9px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 border border-blue-100/80 px-2 py-0.5 rounded-md">
                          YOUR CAREER PATH
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                          Full Stack Software Engineer
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full inline-block">
                          68% Complete
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Overall Velocity</span>
                        <span className="font-mono text-[#2563EB]">Phase 3 / 4</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                        <div className="bg-[#2563EB] h-full rounded-full w-[68%] transition-all"></div>
                      </div>
                    </div>

                    {/* Horizontal 4-Node Roadmap Bar */}
                    <div className="pt-1 pb-0.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-wider">
                        <span>Milestone Track</span>
                      </div>
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-3 right-3 top-3 h-0.5 bg-slate-200 -z-0"></div>
                        <div className="absolute left-3 w-[65%] top-3 h-0.5 bg-[#2563EB] -z-0"></div>

                        {/* Node 1 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            ✓
                          </div>
                          <span className="text-[9px] font-bold text-slate-700">Foundations</span>
                        </div>

                        {/* Node 2 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold ring-3 ring-blue-100 shadow-2xs">
                            2
                          </div>
                          <span className="text-[9px] font-bold text-[#2563EB]">Frontend</span>
                        </div>

                        {/* Node 3 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-white border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            3
                          </div>
                          <span className="text-[9px] font-bold text-slate-700">Backend</span>
                        </div>

                        {/* Node 4 */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            4
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">Projects</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Modules Preview Cards */}
                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]"></span>
                            <p className="text-[11px] font-bold text-[#0F172A]">React & State Management</p>
                          </div>
                          <p className="text-[10px] text-slate-500 pl-3">Module 4 • 12/15 Lessons</p>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                          82%
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            <p className="text-[11px] font-bold text-[#0F172A]">Node.js & REST API Architecture</p>
                          </div>
                          <p className="text-[10px] text-slate-500 pl-3">Module 3 • 8/12 Lessons</p>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-amber-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                          64%
                        </span>
                      </div>
                    </div>

                    {/* Milestone Project Deliverable Sub-card */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white flex-shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-extrabold text-[#0F172A]">Portfolio Deliverable</p>
                          <span className="text-[9px] font-bold text-[#2563EB] uppercase">Active Goal</span>
                        </div>
                        <p className="text-[10px] text-slate-600 truncate">E-Commerce Microservices API</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. SERVICES SECTION */}
        <section id="services" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                CAPABILITIES & FEATURES
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Services Designed for Skill Mastery
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Explore our full suite of learning tools designed to guide you from foundational concepts to job readiness.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <article
                  key={idx}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/80 transition-colors group-hover:bg-[#2563EB]">
                      <div className="transition-colors group-hover:text-white">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2563EB]">
                    <span>{service.actionLabel}</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE PATHPILOT */}
        <section id="why-choose" className="py-16 md:py-24 bg-[#F1F5F9]/60 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                WHY PATHPILOT
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Built to Eliminate Learning Friction
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Everything you need to master technical fields without distraction or guesswork.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs"
                >
                  <div className="mb-4 inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-100 border border-slate-200/70">
                    {reason.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{reason.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LEARNING JOURNEY TIMELINE */}
        <section id="journey" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                LEARNING ROADMAP FLOW
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Your 5-Step Learning Journey
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Follow this proven trajectory to turn curiosity into job-ready technical proficiency.
              </p>
            </div>

            {/* Desktop Horizontal Connected Timeline */}
            <div className="hidden lg:block relative max-w-6xl mx-auto">
              <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-5 gap-4 relative z-10">
                {journeySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between text-left group hover:border-[#2563EB] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {step.num}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">{step.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile / Tablet Vertical Timeline */}
            <div className="lg:hidden relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6">
              {journeySteps.map((step, idx) => (
                <div key={idx} className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                  <div className="absolute -left-[31px] top-5 h-5 w-5 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center font-mono text-[10px] font-bold text-[#2563EB]">
                    {idx + 1}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      STEP {step.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. STATISTICS SECTION */}
        <section className="py-14 bg-[#0F172A] text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-center">
              {stats.map((st, idx) => (
                <div key={idx} className="pt-4 md:pt-0 px-4 space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] tracking-tight font-mono">{st.value}</p>
                  <p className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ ACCORDION */}
        <section id="faq" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                GOT QUESTIONS?
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 ${isOpen
                        ? "border-blue-200 bg-white shadow-2xs"
                        : "border-slate-200/80 bg-[#F8FAFC] hover:border-slate-300"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl"
                    >
                      <span>{faq.q}</span>
                      <svg
                        className={`h-5 w-5 text-slate-400 ml-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2563EB]" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. CONTACT SECTION */}
        <section id="contact" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                    GET IN TOUCH
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                    We'd Love to Hear From You
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Have questions about our career roadmaps or platform capabilities? Reach out anytime.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>support@pathpilot.com</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>San Francisco, CA & Global</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8" />
                      </svg>
                    </div>
                    <div className="flex gap-4 text-xs font-bold text-[#2563EB]">
                      <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
                {contactSubmitted ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto text-xl">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Message Sent!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Thank you for contacting PathPilot. We will review your message promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="mt-4 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-3 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-3 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-msg" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">Message</label>
                      <textarea
                        id="contact-msg"
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-3 focus:ring-blue-500/10 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-extrabold text-white transition shadow-2xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span>Send Message</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-xs shadow-2xs border border-blue-700/20">
                  P
                </div>
                <span className="font-extrabold text-white text-base tracking-tight">PathPilot</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Structured tech learning ecosystem helping students master real-world skills with clarity.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <p className="font-mono font-bold text-white uppercase text-[11px] tracking-widest">Quick Links</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#why-choose" className="hover:text-white transition-colors">Why PathPilot</a></li>
                <li><a href="#journey" className="hover:text-white transition-colors">Timeline</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <p className="font-mono font-bold text-white uppercase text-[11px] tracking-widest">Account & Access</p>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Student Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
                <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Command Center</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Social */}
            <div className="space-y-3">
              <p className="font-mono font-bold text-white uppercase text-[11px] tracking-widest">Connect</p>
              <p className="text-xs text-slate-400">San Francisco, CA & Global</p>
              <div className="flex items-center gap-3 pt-1">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 text-center text-slate-500 text-[11px]">
            © {new Date().getFullYear()} PathPilot Learning Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
