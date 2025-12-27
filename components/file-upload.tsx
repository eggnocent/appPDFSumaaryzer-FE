"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  isLoading?: boolean
  uploadProgress?: number
  uploadFinished?: boolean
}

export default function FileUpload({
  onFileChange,
  isLoading = false,
  uploadProgress = 0,
  uploadFinished = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const filePickerRef = useRef<HTMLInputElement>(null)

  const openFilePicker = () => {
    filePickerRef.current?.click()
  }

  const handleFileSelection = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      onFileChange(file)
    } else if (file) {
      setSelectedFile(null)
      onFileChange(file)
    }
  }

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelection(selectedFiles[0])
    }
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const onDropFiles = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const droppedFiles = event.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelection(droppedFiles[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (filePickerRef.current) {
      filePickerRef.current.value = ""
    }
    onFileChange(null)
  }

  const isFileUploading = isLoading && uploadProgress > 0 && uploadProgress < 100 && selectedFile
  const isFileFinished = uploadFinished && uploadProgress === 100 && selectedFile

  return (
    <div className="mx-auto flex w-full flex-col gap-y-6">
      <Card
        className="group flex max-h-[200px] w-full flex-col items-center justify-center gap-4 py-8 border-2 border-dashed text-sm cursor-pointer hover:bg-muted/50 transition-colors"
        onDragOver={onDragOver}
        onDrop={onDropFiles}
        onClick={openFilePicker}
      >
        <div className="grid space-y-3">
          <div className="flex items-center justify-center gap-x-2 text-muted-foreground">
            <Upload className="size-5" />
            <div>
              <span>Drop files here or </span>
              <Button
                variant="link"
                className="text-primary p-0 h-auto font-normal"
                onClick={(e) => {
                  e.preventDefault()
                  openFilePicker()
                }}
              >
                browse files
              </Button>
              <span> to add</span>
            </div>
          </div>
        </div>
        <input
          ref={filePickerRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={onFileInputChange}
        />
        <span className="text-base/6 text-muted-foreground group-disabled:opacity-50 mt-2 block sm:text-xs">
          Supported: PDF (max 10 MB)
        </span>
      </Card>

      {isFileUploading && selectedFile && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            UPLOADING
          </p>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="grid size-8 shrink-0 place-content-center rounded border bg-background">
              <FileText className="size-4 text-primary" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-muted-foreground shrink-0">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {isFileFinished && selectedFile && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            FINISHED
          </p>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="grid size-8 shrink-0 place-content-center rounded border bg-background">
              <FileText className="size-4 text-primary" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-green-600 h-full w-full" />
              </div>
            </div>
            <span className="text-xs font-semibold text-green-600 shrink-0">100%</span>
          </div>
        </div>
      )}

      {/* Show file selection when not uploading/finished */}
      {selectedFile && !isFileUploading && !isFileFinished && (
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center gap-3 flex-1">
            <div className="grid size-10 shrink-0 place-content-center rounded border bg-background">
              <FileText className="size-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile} className="size-8 shrink-0" aria-label="Remove file">
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
