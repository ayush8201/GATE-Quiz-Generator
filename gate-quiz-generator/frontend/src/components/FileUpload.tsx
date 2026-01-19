import { useState, useCallback, DragEvent, ChangeEvent } from 'react'
import { Upload, CheckCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  label: string
  accept?: string
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function FileUpload({
  label,
  accept = '.pdf',
  onFileSelect,
  selectedFile,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/pdf') {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl p-6 text-center cursor-pointer transition-all duration-300',
          'glass-effect',
          isDragging && 'border-primary bg-primary/10 scale-[1.02]',
          selectedFile && 'border-success bg-success/10',
          !isDragging && !selectedFile && 'hover:border-primary/50 hover:bg-primary/5'
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {selectedFile ? (
          <div className="text-success animate-fade-in">
            <CheckCircle className="w-10 h-10 mx-auto mb-3" />
            <div className="flex items-center justify-center gap-2 mb-1">
              <FileText className="w-4 h-4" />
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <Upload className={cn(
              'w-10 h-10 mx-auto mb-3 transition-transform duration-300',
              isDragging && 'scale-110 text-primary'
            )} />
            <p className="text-sm text-foreground">
              Drag & drop your PDF here, or{' '}
              <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Only PDF files are accepted
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
