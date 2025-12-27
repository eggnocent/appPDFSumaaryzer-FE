"use client"

import Link from "next/link"

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-white to-[#f5f3ff] p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4d2b8c] via-[#85409d] to-[#eea727] rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-[#f0f0f0] backdrop-blur-sm">
            <div className="mb-8">
              <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-[#4d2b8c] via-[#85409d] to-[#4d2b8c] bg-clip-text text-transparent">
                  Coming Soon
                </span>
              </h1>
              <p className="text-lg text-[#555] font-body font-light leading-relaxed mt-6 max-w-lg mx-auto">
                We're working hard to bring you premium features. Stay tuned for updates on our pricing plans and
                enhanced capabilities.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-center gap-2 text-[#4d2b8c] font-body font-semibold">
                <div className="w-2 h-2 bg-[#4d2b8c] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#85409d] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#eea727] rounded-full animate-bounce delay-200" />
              </div>

              <Link
                href="/"
                className="inline-block mt-8 py-4 px-8 rounded-2xl font-body font-semibold transition-all duration-200 bg-gradient-to-r from-[#4d2b8c] to-[#85409d] text-white hover:shadow-2xl hover:shadow-[#4d2b8c]/30 hover:-translate-y-1 active:translate-y-0 border border-[#6d3bac]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-[#999] text-sm font-body font-light">
            Powered by <span className="font-accent text-[#eea727]">Sherphered Team</span>
          </p>
        </div>
      </div>
    </main>
  )
}
