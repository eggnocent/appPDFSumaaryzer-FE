"use client"

import React from "react"
import { useState, useEffect } from "react"
import FileUpload from "@/components/file-upload"
import PricingModal from "@/components/pricing-modal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Minus } from "lucide-react"

const PROGRESS_STAGES = [
  { label: "Job Created", percentage: 17 },
  { label: "PDF Text Extraction", percentage: 33 },
  { label: "Processing Started", percentage: 50 },
  { label: "Processing...", percentage: 67 },
  { label: "Almost Done", percentage: 83 },
  { label: "Complete!", percentage: 100 },
]

const ProgressBar = ({ percentage }: { percentage: number }) => {
  const filled = Math.floor((percentage / 100) * 12)
  const empty = 12 - filled
  const bar = "▓".repeat(filled) + "░".repeat(empty)
  return <span className="font-mono tracking-wider text-[#4d2b8c] font-bold">{bar}</span>
}

const ProgressTracker = ({ currentPercentage, statusText }: { currentPercentage: number; statusText: string }) => {
  if (currentPercentage === 0) return null

  return (
    <div className="mt-8 space-y-3 bg-gradient-to-r from-[#f9f7ff] to-[#fffef0] border border-[#e0d5f5] rounded-2xl p-6">
      <div className="text-sm text-[#666] font-body font-light">
        {currentPercentage}%
        <span className="float-right">
          <AnimatedStatusText text={statusText} />
        </span>
      </div>
      <ProgressBar percentage={currentPercentage} />
    </div>
  )
}

const AnimatedStatusText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("")

  React.useEffect(() => {
    if (!text) {
      setDisplayText("")
      return
    }

    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex += 1
      const spacedText = text.slice(0, currentIndex).split("").join(" ")
      setDisplayText(spacedText)

      if (currentIndex >= text.length) {
        clearInterval(interval)
      }
    }, 500) // 500ms delay between each character

    return () => clearInterval(interval)
  }, [text])

  return <span>{displayText}</span>
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState("")
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFinished, setUploadFinished] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    const savedCount = localStorage.getItem("pdf_upload_count")
    if (savedCount) {
      const count = Number.parseInt(savedCount, 10)
      setUploadCount(count)
      if (count >= 3) {
        setShowPricingModal(true)
      }
    }
  }, [])

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      setProgressPercentage(0)
      setUploadProgress(0)
      setUploadFinished(false)
    } else if (selectedFile) {
      setError("Please select a valid PDF file")
      setFile(null)
      setProgressPercentage(0)
      setUploadProgress(0)
      setUploadFinished(false)
    } else {
      setFile(null)
      setError(null)
      setResult(null)
      setProgressPercentage(0)
      setUploadProgress(0)
      setUploadFinished(false)
    }
  }

  const pollForResult = async (jobId: string) => {
    let attempts = 0
    const maxAttempts = 600
    let isFirstPoll = true

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`https://egnoocminsoc.site/api/summarize/${jobId}`)

        const contentType = response.headers.get("content-type")
        if (!contentType?.includes("application/json")) {
          throw new Error("Server error: received non-JSON response")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || "Failed to get status")
        }

        if (data.status === "completed") {
          setResult(data)
          setLoading(false)
          setJobId(null)
          setProgress("")
          setProgressPercentage(100)
          return
        } else if (data.status === "error") {
          setError(data.error || "An error occurred during processing")
          setLoading(false)
          setJobId(null)
          setProgress("")
          setProgressPercentage(0)
          return
        }

        let newPercentage = 50
        let progressMsg = "Processing..."

        if (isFirstPoll) {
          newPercentage = 17
          progressMsg = "Job Created"
          isFirstPoll = false
        } else if (data.status === "extracting") {
          newPercentage = 33
          progressMsg = "PDF Text Extraction"
        } else if (data.status === "processing") {
          newPercentage = 50
          progressMsg = "Processing Started"
        } else if (data.status === "summarizing") {
          newPercentage = 67
          progressMsg = "Processing..."
        } else if (data.status === "finalizing") {
          newPercentage = 83
          progressMsg = "Almost Done"
        }

        setProgressPercentage(newPercentage)
        setProgress(progressMsg)
        attempts++

        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (err) {
        console.error("Polling error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setLoading(false)
        setJobId(null)
        setProgress("")
        setProgressPercentage(0)
        return
      }
    }

    setError("Processing took too long. Please try again with a smaller file.")
    setLoading(false)
    setJobId(null)
    setProgress("")
    setProgressPercentage(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadCount >= 3) {
      setShowPricingModal(true)
      return
    }

    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setProgress("Uploading file...")
    setProgressPercentage(0)
    setUploadProgress(0)
    setUploadFinished(false)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 30
        })
      }, 300)

      const response = await fetch("https://egnoocminsoc.site/api/summarize", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadFinished(true)

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server error: The server returned an error page. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to upload PDF")
      }

      const newCount = uploadCount + 1
      setUploadCount(newCount)
      localStorage.setItem("pdf_upload_count", newCount.toString())

      setJobId(data.job_id)
      setProgress("PDF uploaded. Processing...")
      setProgressPercentage(17)

      await pollForResult(data.job_id)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setLoading(false)
      setJobId(null)
      setProgress("")
      setProgressPercentage(0)
      setUploadProgress(0)
      setUploadFinished(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-white to-[#f5f3ff] p-6 md:p-12">
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => {
          setShowPricingModal(false)
        }}
      />

      <div className="max-w-2xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-[#4d2b8c] via-[#85409d] to-[#4d2b8c] bg-clip-text text-transparent">
              PDF Summarizer by Sherpherd Team
            </span>
            <div className="absolute -top-2 -right-8 text-2xl font-accent text-[#ffef5f]">✨</div>
          </h1>
          <p className="text-lg text-[#555] font-body font-light leading-relaxed mt-4 max-w-lg">
            Transform your documents into concise, actionable summaries with AI-powered intelligence
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4d2b8c] via-[#85409d] to-[#eea727] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-[#f0f0f0] backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <FileUpload
                onFileChange={handleFileChange}
                isLoading={loading}
                uploadProgress={uploadProgress}
                uploadFinished={uploadFinished}
              />

              <button
                type="submit"
                disabled={!file || loading || uploadFinished}
                className={`w-full py-4 px-6 rounded-2xl font-body font-semibold transition-all duration-200 text-base ${
                  !file || loading || uploadFinished
                    ? "bg-[#f0f0f0] text-[#999] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#4d2b8c] to-[#85409d] text-white hover:shadow-2xl hover:shadow-[#4d2b8c]/30 hover:-translate-y-1 active:translate-y-0 active:shadow-lg border border-[#6d3bac]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Summarize PDF</span>
                    <span className="font-accent text-lg">→</span>
                  </span>
                )}
              </button>

              <ProgressTracker currentPercentage={progressPercentage} statusText={progress} />
            </form>

            {error && (
              <div className="mt-8 p-5 bg-gradient-to-r from-[#ffe8e8] to-[#fff0f0] border border-[#ffb3b3] rounded-2xl">
                <p className="text-[#d32f2f] text-sm font-body font-semibold">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-12 space-y-6">
                <div className="bg-gradient-to-r from-[#fffef0] to-[#fff5e6] border-2 border-[#eea727] rounded-2xl p-6">
                  <p className="text-[#4d2b8c] font-body font-semibold text-base flex items-center gap-2">
                    <span className="font-accent text-2xl">✓</span>
                    Summary generated successfully
                  </p>
                  <p className="text-[#666] text-sm mt-2 font-body font-light">
                    📄 {result.filename} • {result.text_length} characters
                  </p>
                </div>

                <div className="bg-gradient-to-b from-[#fafaf9] to-white border-2 border-[#e0d5f5] rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold text-[#4d2b8c] mb-5">Summary</h2>
                  <p className="text-[#333] leading-relaxed text-base whitespace-pre-wrap font-body font-light">
                    {result.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-12 text-center text-[#4d2b8c]">FAQ's</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "How secure is my PDF data?",
                a: "Your privacy is our priority. We use industry-standard encryption to process your files, and documents are automatically deleted from our servers after processing is complete.",
              },
              {
                q: "What is the maximum file size allowed?",
                a: "Free users can upload PDFs up to 10MB. Pro users enjoy increased limits up to 50MB per document for more complex summarization tasks.",
              },
              {
                q: "Does it support languages other than English?",
                a: "Yes! Our AI engine is trained on dozens of languages and can summarize non-English documents effectively while providing the summary in your preferred language.",
              },
              {
                q: "How many summaries can I generate for free?",
                a: (
                  <>
                    You get 3 free summaries per browser session. To unlock unlimited summaries and advanced features,
                    you can{" "}
                    <button
                      onClick={() => setShowPricingModal(true)}
                      className="text-[#4d2b8c] font-semibold underline decoration-[#85409d]/30 underline-offset-4 hover:text-[#85409d] transition-colors"
                    >
                      upgrade
                    </button>{" "}
                    to one of our student or professional plans.
                  </>
                ),
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-[#e0d5f5] rounded-2xl bg-white shadow-sm overflow-hidden px-4 py-2"
              >
                <AccordionTrigger className="hover:no-underline py-4 group">
                  <div className="flex items-center gap-4 text-left font-body font-semibold text-[#333] group-data-[state=open]:text-[#4d2b8c] transition-colors">
                    <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5 absolute transition-all duration-300 group-data-[state=open]:scale-0 group-data-[state=open]:rotate-90" />
                      <Minus className="w-5 h-5 absolute scale-0 rotate-90 transition-all duration-300 group-data-[state=open]:scale-100 group-data-[state=open]:rotate-0 text-[#85409d]" />
                    </div>
                    <span className="text-base md:text-lg">{faq.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-body font-light text-[#666] leading-relaxed pb-6 pl-9 text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8 pb-12">
          <p className="text-[#999] text-lg font-body font-light">
            Powered by <span className="font-accent text-xl text-[#eea727]">Sherpherd Team</span>
          </p>
        </div>
      </div>
    </main>
  )
}
