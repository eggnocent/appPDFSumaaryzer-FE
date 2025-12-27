"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Check } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: string, currency = "IDR") => {
  if (price === "0") return "Gratis"

  const numPrice = Number.parseInt(price.replace(/\./g, ""))
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice)
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [selectedTab, setSelectedTab] = useState<"individual" | "team">("individual")

  if (!isOpen) return null

  const plans = {
    individual: [
      {
        name: "Free",
        price: "0",
        currency: "IDR",
        description: "Perfect for trying out PDF Summarizer.",
        features: ["5 PDF summaries/month", "PDF up to 5 pages", "Basic Ollama models", "Standard processing time"],
        cta: "Get Started",
        highlighted: false,
      },
      {
        name: "Student AMIKOM",
        price: "30.000",
        currency: "IDR",
        description: "Special plan for AMIKOM students with student email verification.",
        features: [
          "50 PDF summaries/month",
          "PDF up to 100 pages",
          "Access to Mistral & Llama models",
          "Priority processing",
          "Batch processing (3 files at once)",
          "Free email support",
          "Valid with @student.amikom.ac.id email",
        ],
        cta: "Verify as Student",
        highlighted: true,
        badge: "For AMIKOM Students",
      },
      {
        name: "Pro",
        price: "99.000",
        currency: "IDR",
        description: "For individuals needing more summaries and larger PDFs.",
        features: [
          "125 PDF summaries/month",
          "PDF up to 50 pages",
          "Access to Mistral & Llama models",
          "Priority processing",
          "Email support",
        ],
        cta: "Upgrade to Pro",
        highlighted: false,
      },
      {
        name: "Max",
        price: "299.000",
        currency: "IDR",
        description: "The ultimate plan for power users with batch processing.",
        features: [
          "Unlimited everything",
          "PDF up to 500 pages",
          "All available models",
          "Batch processing (10 files at once)",
          "Custom summary templates",
          "Advanced analytics",
          "Priority support 24/7",
        ],
        cta: "Upgrade to Max",
        highlighted: false,
      },
    ],
    team: [
      {
        name: "Team Student AMIKOM",
        price: "150.000",
        currency: "IDR",
        description: "Affordable team plan for AMIKOM student groups and projects.",
        features: [
          "Up to 10 student members",
          "Unlimited summaries per member",
          "PDF up to 125 pages/students",
          "Shared document library",
          "Team collaboration tools",
          "Study group analytics",
          "Free support via Discord",
          "Valid with @student.amikom.ac.id emails",
        ],
        cta: "Create Team (Student)",
        highlighted: true,
        badge: "For AMIKOM Student Groups",
      },
      {
        name: "Team Pro",
        price: "499.000",
        currency: "IDR",
        description: "Scale your team's productivity with shared workspace.",
        features: [
          "Up to 10 team members",
          "Unlimited summaries",
          "PDF up to 100 pages",
          "Shared document library",
          "Team analytics dashboard",
          "Admin controls & user management",
          "Priority email support",
        ],
        cta: "Start Team Plan",
        highlighted: false,
      },
      {
        name: "Team Max",
        price: "999.000",
        currency: "IDR",
        description: "Enterprise solution for large teams with advanced features.",
        features: [
          "Up to 50 team members",
          "Unlimited summaries & batch processing",
          "PDF up to 500 pages",
          "Advanced collaboration tools",
          "Custom integrations (API)",
          "Dedicated account manager",
          "24/7 priority phone support",
          "SLA guarantee",
        ],
        cta: "Contact Sales",
        highlighted: false,
      },
    ],
  }

  const currentPlans = plans[selectedTab]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 md:p-12 pb-0 flex justify-between items-start">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">Elevate Your Workflow</h2>
            <p className="text-gray-500 text-lg">
              Unlock advanced AI capabilities and continue summarizing your documents without limits.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 md:p-12 pt-8 overflow-y-auto">
          <div className="flex justify-start mb-10">
            <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200">
              <button
                onClick={() => setSelectedTab("individual")}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedTab === "individual"
                    ? "bg-white text-[#4d2b8c] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setSelectedTab("team")}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedTab === "team" ? "bg-white text-[#4d2b8c] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Team
              </button>
            </div>
          </div>

          <div className={`grid gap-6 ${selectedTab === "individual" ? "md:grid-cols-2" : "max-w-lg"}`}>
            {currentPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 flex flex-col transition-all border ${
                  plan.highlighted
                    ? "bg-white border-[#4d2b8c] ring-1 ring-[#4d2b8c] shadow-xl"
                    : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-[#4d2b8c] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Recommended
                  </div>
                )}

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{plan.description}</p>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    {plan.price !== "0" && <span className="text-gray-400 font-medium">/mo</span>}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div className="mt-1 bg-[#4d2b8c]/10 rounded-full p-0.5">
                          <Check className="w-3.5 h-3.5 text-[#4d2b8c]" />
                        </div>
                        <span className="text-gray-600 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/coming-soon"
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm text-center ${
                    plan.highlighted
                      ? "bg-[#4d2b8c] text-white hover:bg-[#3d2170] shadow-[#4d2b8c]/10"
                      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">Secure checkout powered by Stripe. Cancel anytime.</p>
        </div>
      </div>
    </div>
  )
}
