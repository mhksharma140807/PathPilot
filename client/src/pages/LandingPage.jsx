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
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "Learning Modules",
      desc: "Self-paced interactive units breaking down complex technologies into digestible lessons.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Skill Tracking",
      desc: "Monitor domain competencies and practical skill takeaways per completed module.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Project Based Learning",
      desc: "Apply theoretical concepts directly into real-world showcase project deliverables.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Progress Analytics",
      desc: "Real-time visual metrics detailing overall curriculum progress and milestone velocity.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Profile Management",
      desc: "Manage account settings, enrolled paths, learner identity, and custom preferences.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  // 3. Why Choose PathPilot (6 items)
  const whyReasons = [
    {
      title: "Structured Learning",
      desc: "No more tutorial hell. Follow guided, sequential tracks built for mastery.",
      icon: "🎯",
    },
    {
      title: "Industry Inspired Roadmaps",
      desc: "Curriculum designed around real software engineering and tech role demands.",
      icon: "⚡",
    },
    {
      title: "Track Progress",
      desc: "Visual milestone tracking gives you clear visibility into your growth.",
      icon: "📊",
    },
    {
      title: "Modern Dashboard",
      desc: "Clean, distraction-free command center tailored specifically for students.",
      icon: "💻",
    },
    {
      title: "Career Oriented",
      desc: "Focus on practical competencies that hiring managers actually look for.",
      icon: "🚀",
    },
    {
      title: "Responsive Experience",
      desc: "Seamless learning across desktop, tablet, and mobile browsers.",
      icon: "📱",
    },
  ];

  // 4. Learning Journey Steps (5 steps)
  const journeySteps = [
    { step: "Step 1", title: "Choose Career", desc: "Select a specialized career path blueprint." },
    { step: "Step 2", title: "Complete Modules", desc: "Master self-paced interactive lessons." },
    { step: "Step 3", title: "Build Projects", desc: "Apply knowledge to portfolio deliverables." },
    { step: "Step 4", title: "Track Progress", desc: "Monitor completion stats and badges." },
    { step: "Step 5", title: "Become Job Ready", desc: "Gain market-ready technical confidence." },
  ];

  // 5. Statistics (4 items)
  const stats = [
    { value: "6", label: "Career Paths" },
    { value: "120+", label: "Lessons" },
    { value: "40+", label: "Projects" },
    { value: "100%", label: "Progress Tracking" },
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-xs group-hover:bg-blue-700 transition">
                P
              </div>
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                PathPilot
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                <a href="#hero" className="transition hover:text-[#2563EB]">Home</a>
                <a href="#services" className="transition hover:text-[#2563EB]">Services</a>
                <a href="#why-choose" className="transition hover:text-[#2563EB]">Why PathPilot</a>
                <a href="#journey" className="transition hover:text-[#2563EB]">Timeline</a>
                <a href="#faq" className="transition hover:text-[#2563EB]">FAQ</a>
                <a href="#contact" className="transition hover:text-[#2563EB]">Contact</a>
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#2563EB] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <section id="hero" className="py-12 sm:py-16 md:py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-[#2563EB] border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                Structured Tech Learning Ecosystem
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                Navigate Your Tech Career. <br className="hidden sm:inline" />
                <span className="text-[#2563EB]">Build Real-World Mastery.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Select structured career paths, master topic modules at your own pace, and track your milestone progress with PathPilot.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center text-sm font-extrabold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Get Started Free →
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Sign In to Dashboard
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 max-w-2xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {trustIndicators.map((trust, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span className="text-emerald-500 font-extrabold">✓</span>
                      <span>{trust}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SERVICES SECTION */}
        <section id="services" className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Capabilities & Features
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
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
                  className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                      <div className="transition-colors group-hover:text-white">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2563EB]">
                    <span>Learn More</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE PATHPILOT */}
        <section id="why-choose" className="py-16 md:py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Why PathPilot
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
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
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="text-3xl mb-3">{reason.icon}</div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">{reason.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LEARNING JOURNEY TIMELINE */}
        <section id="journey" className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Learning Roadmap Flow
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Your 5-Step Learning Journey
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Follow this proven trajectory to turn curiosity into job-ready technical proficiency.
              </p>
            </div>

            {/* Horizontal timeline grid for desktop, vertical stack for mobile */}
            <div className="grid gap-4 md:grid-cols-5 relative">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between text-center group hover:border-[#2563EB] transition-colors"
                >
                  <div>
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider mb-3">
                      {step.step}
                    </span>
                    <h3 className="text-base font-bold text-[#0F172A]">{step.title}</h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < journeySteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 text-lg font-bold">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. STATISTICS SECTION */}
        <section className="py-16 bg-[#0F172A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((st, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-4xl sm:text-5xl font-extrabold text-[#2563EB] tracking-tight">{st.value}</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ ACCORDION */}
        <section id="faq" className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Got Questions?
              </span>
              <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <span>{faq.q}</span>
                      <span className="ml-4 text-slate-400 font-extrabold text-lg">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
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
        <section id="contact" className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    Get in Touch
                  </span>
                  <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                    We'd Love to Hear From You
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Have questions about our career roadmaps or platform capabilities? Reach out anytime.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                      📧
                    </div>
                    <span>support@pathpilot.com</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                      📍
                    </div>
                    <span>San Francisco, CA & Global</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                      🌐
                    </div>
                    <div className="flex gap-4 text-xs font-bold text-[#2563EB]">
                      <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
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
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase text-[#0F172A] mb-1">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase text-[#0F172A] mb-1">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-msg" className="block text-xs font-bold uppercase text-[#0F172A] mb-1">Message</label>
                      <textarea
                        id="contact-msg"
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-[#2563EB] text-xs font-extrabold text-white transition hover:bg-blue-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-sm">
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
              <p className="font-bold text-white uppercase text-[11px] tracking-wider">Quick Links</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#why-choose" className="hover:text-white transition">Why PathPilot</a></li>
                <li><a href="#journey" className="hover:text-white transition">Timeline</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase text-[11px] tracking-wider">Account & Access</p>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition">Student Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Create Free Account</Link></li>
                <li><Link to="/student/dashboard" className="hover:text-white transition">Command Center</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Social */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase text-[11px] tracking-wider">Connect</p>
              <p className="text-xs text-slate-400">San Francisco, CA & Global</p>
              <div className="flex items-center gap-3 pt-1">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition">
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
