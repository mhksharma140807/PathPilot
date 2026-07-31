import React, { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      title: "Career Paths",
      desc: "Explore structured tech directions designed to align learning with industry skill standards.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Structured Learning Modules",
      desc: "Master topics incrementally through organized modules and targeted practical tasks.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Progress Tracking",
      desc: "Monitor your completion metrics and visualize continuous growth along your learning path.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Practical Skill Development",
      desc: "Build real capabilities by completing topic-focused exercises and roadmap milestones.",
      icon: (
        <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Career",
      desc: "Select a specialized tech track aligned with your goals."
    },
    {
      step: "02",
      title: "Learn",
      desc: "Work through step-by-step topic modules at your own pace."
    },
    {
      step: "03",
      title: "Track Progress",
      desc: "Watch your progress grow as you complete each milestone."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* PUBLIC NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo + Name */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white font-bold text-lg shadow-xs">
                P
              </div>
              <span className="text-xl font-bold text-[#0F172A] tracking-tight">
                PathPilot
              </span>
            </Link>

            {/* Right: Clean Links + Single Primary CTA */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                <a href="#" className="transition hover:text-[#2563EB]">Home</a>
                <a href="#services" className="transition hover:text-[#2563EB]">Services</a>
                <a href="#about" className="transition hover:text-[#2563EB]">About Us</a>
              </nav>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-xs"
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

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-md">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 hover:text-[#2563EB]">Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 hover:text-[#2563EB]">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 hover:text-[#2563EB]">About Us</a>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Headline & Primary CTA */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-tight">
                  Navigate Your Career. <br />
                  <span className="text-[#2563EB]">Build Your Future.</span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Choose a structured career path, build practical skills, and track your learning progress with PathPilot.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-xs text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Polished Visual Showcase Preview */}
              <div className="lg:col-span-5">
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                      <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                      <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                      <span className="ml-2 text-xs font-semibold text-slate-500">PathPilot Showcase</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-100">
                      Product Preview
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-50 text-[#2563EB]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">Sample Track</p>
                          <p className="text-sm font-bold text-[#0F172A]">Full Stack Developer</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#2563EB]">65% Done</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                        <span>Learning Progression</span>
                        <span>5 of 8 Modules</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full w-[65%]"></div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Module</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">In Progress</span>
                      </div>
                      <p className="text-sm font-bold text-[#0F172A]">RESTful API Architecture & Node.js</p>
                      <p className="text-xs text-slate-600">Building scalable backend controllers and API routes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SERVICES SECTION */}
        <section id="services" className="py-16 sm:py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                Services
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Everything you need to guide your career development step by step.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit mb-4">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                How It Works
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                A simple 3-step path from start to career readiness.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((item, idx) => (
                <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 text-center">
                  <span className="text-3xl font-bold text-[#2563EB]">{item.step}</span>
                  <h3 className="mt-3 text-lg font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ABOUT US SECTION */}
        <section id="about" className="py-16 sm:py-20 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              About Us
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              PathPilot addresses the lack of structured guidance in tech learning. By organizing complex fields into clear roadmaps and bite-sized learning modules, PathPilot helps students choose a direction and build measurable skills with clarity.
            </p>
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-slate-200">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Join PathPilot today and take the first step towards building your career.
              </p>
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-block px-8 py-3.5 text-base font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. COMPACT FOOTER */}
      <footer className="bg-[#0F172A] text-slate-400 py-8 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">PathPilot</span>
              <p className="text-xs text-slate-400">Career Learning Ecosystem</p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#about" className="hover:text-white transition">About Us</a>
          </nav>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} PathPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
