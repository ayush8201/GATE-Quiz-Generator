import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { Layout } from './components/Layout'
import { UploadPage } from './pages/UploadPage'
import { QuizPage } from './pages/QuizPage'
import { ResultsPage } from './pages/ResultsPage'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/quiz/:sessionId" element={<QuizPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
