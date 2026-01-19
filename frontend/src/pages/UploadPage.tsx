import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, Loader2, BookOpen, CheckCircle, Zap, Brain } from 'lucide-react'
import { FileUpload } from '../components/FileUpload'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { uploadPDFs, getQuiz } from '../services/api'
import { useQuizStore } from '../store/quizStore'
import { cn } from '@/lib/utils'

export function UploadPage() {
  const navigate = useNavigate()
  const { setSession, setLoading, setError, isLoading, error } = useQuizStore()

  const [questionsPdf, setQuestionsPdf] = useState<File | null>(null)
  const [answerKeyPdf, setAnswerKeyPdf] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!questionsPdf || !answerKeyPdf) {
      setError('Please select both PDF files')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const uploadResponse = await uploadPDFs(questionsPdf, answerKeyPdf)
      const quizData = await getQuiz(uploadResponse.session_id)
      setSession(quizData.id, quizData.questions)
      navigate(`/quiz/${quizData.id}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string }
      setError(
        error.response?.data?.detail ||
          error.message ||
          'Failed to process PDFs'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          GATE Quiz Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Upload your GATE exam PDF and answer key to generate an interactive
          practice quiz instantly
        </p>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-primary" />
            Upload Your Files
          </CardTitle>
          <CardDescription>
            Select both the question paper and answer key PDFs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            label="Questions PDF"
            onFileSelect={setQuestionsPdf}
            selectedFile={questionsPdf}
          />

          <FileUpload
            label="Answer Key PDF"
            onFileSelect={setAnswerKeyPdf}
            selectedFile={answerKeyPdf}
          />

          {error && (
            <div className={cn(
              'p-4 rounded-xl glass-effect',
              'border-destructive/50 bg-destructive/10 text-destructive',
              'animate-fade-in'
            )}>
              {error}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!questionsPdf || !answerKeyPdf || isLoading}
            size="xl"
            className="w-full"
            loading={isLoading}
          >
            {!isLoading && <Zap className="w-5 h-5 mr-2" />}
            {isLoading ? 'Processing...' : 'Generate Quiz'}
          </Button>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground">MCQ Support</h3>
            <p className="text-xs text-muted-foreground">
              Single & multiple answer questions
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-medium text-foreground">NAT Questions</h3>
            <p className="text-xs text-muted-foreground">
              Integer & decimal answer types
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <Brain className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-medium text-foreground">AI Hints</h3>
            <p className="text-xs text-muted-foreground">
              Get help when you're stuck
            </p>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                1
              </span>
              <span>Upload the PDF containing GATE exam questions</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                2
              </span>
              <span>Upload the PDF containing the official answer key</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                3
              </span>
              <span>Click "Generate Quiz" to start your practice session</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                4
              </span>
              <span>Answer questions and use AI hints when needed</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
