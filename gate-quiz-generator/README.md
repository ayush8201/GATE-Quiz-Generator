# 🎓 GATE Quiz Generator

A modern web application that automatically parses GATE exam PDFs (questions + answer key) and generates interactive quizzes with AI-powered hints, auto-scoring, and a beautiful glassmorphism UI.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 📄 **PDF Parsing**: Automatically extracts questions, options, and figures from GATE exam PDFs
- 🔑 **Answer Key Processing**: Parses answer key tables and maps them to questions
- 🎯 **Multiple Question Types**: Supports MCQ (Single/Multiple) and NAT (Integer/Decimal)
- 🤖 **AI-Powered Hints**: Get contextual hints using Google Gemini API (cached per session)
- ✅ **Auto-Scoring**: Instant feedback with detailed scoring rules
- 🎨 **Modern UI**: Beautiful glassmorphism design with dark/light theme toggle
- 📊 **Progress Tracking**: Visual progress bar and question navigation
- 🔍 **Review Mode**: Review all answers with correct/incorrect highlighting
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **PDF Processing**: pdfplumber, pdf2image
- **AI Integration**: Google Gemini API (for hints)
- **Image Processing**: Pillow
- **Validation**: Pydantic

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM
- **UI Components**: Radix UI, Lucide Icons
- **HTTP Client**: Axios

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn
- Google Gemini API key (for hint feature)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gate-quiz-generator.git
cd gate-quiz-generator
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run the server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📖 Usage

1. **Upload PDFs**: Navigate to the upload page and upload:
   - Questions PDF (containing exam questions)
   - Answer Key PDF (containing answer key table)

2. **Generate Quiz**: Click "Generate Quiz" to parse the PDFs and create an interactive quiz

3. **Answer Questions**: 
   - Navigate through questions using Previous/Next buttons
   - Use the question grid to jump to any question
   - Click "Get Hint" for AI-powered hints (if available)

4. **Submit Quiz**: Click "Submit Quiz" to see your results

5. **Review Answers**: Review all questions with correct/incorrect highlighting

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload questions PDF + answer key PDF, returns parsed quiz session |
| `/api/quiz/{id}` | GET | Get quiz questions by session ID |
| `/api/quiz/{id}/submit` | POST | Submit answers, returns scored results |
| `/api/quiz/{id}/hint/{question_number}` | GET | Get AI-generated hint for a specific question |

### Example API Usage

```bash
# Upload PDFs
curl -X POST "http://localhost:8000/api/upload" \
  -F "questions_pdf=@questions.pdf" \
  -F "answer_key_pdf=@answer_key.pdf"

# Get quiz
curl "http://localhost:8000/api/quiz/{session_id}"

# Submit quiz
curl -X POST "http://localhost:8000/api/quiz/{session_id}/submit" \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"question_number": 1, "answer": "A"}, ...]}'

# Get hint
curl "http://localhost:8000/api/quiz/{session_id}/hint/1"
```

## 📚 Question Types Supported

1. **MCQ Single**: Multiple choice with one correct answer
   - Scoring: Exact match required

2. **MCQ Multiple**: Multiple choice with multiple correct answers
   - Scoring: All-or-nothing (must match all correct options)

3. **NAT Integer**: Numerical answer type (integer)
   - Scoring: Exact match required

4. **NAT Decimal**: Numerical answer type (decimal, with range tolerance)
   - Scoring: Within ±0.01 or specified range

## 🏗️ Project Structure

```
gate-quiz-generator/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point
│   │   ├── models.py                  # Pydantic models
│   │   ├── routers/
│   │   │   ├── upload.py              # PDF upload endpoint
│   │   │   ├── quiz.py                # Quiz & submit endpoints
│   │   │   └── hint.py                # Hint generation endpoint
│   │   └── services/
│   │       ├── question_extractor.py  # Parse questions PDF
│   │       ├── answer_key_parser.py   # Parse answer key table
│   │       ├── figure_extractor.py    # Extract figures/images
│   │       ├── scorer.py              # Quiz scoring logic
│   │       └── hint_generator.py      # AI hint generation
│   ├── uploads/                       # Temporary PDF storage
│   ├── backend/assets/figures/        # Extracted figures
│   ├── requirements.txt               # Python dependencies
│   └── .env                           # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx         # PDF upload component
│   │   │   ├── QuestionCard.tsx       # Question display
│   │   │   ├── MCQOptions.tsx         # MCQ options component
│   │   │   ├── NATInput.tsx           # NAT input component
│   │   │   ├── HintButton.tsx         # Hint button component
│   │   │   ├── ResultsSummary.tsx     # Results display
│   │   │   ├── Layout.tsx             # App layout
│   │   │   └── ui/                    # Reusable UI components
│   │   ├── pages/
│   │   │   ├── UploadPage.tsx         # Upload page
│   │   │   ├── QuizPage.tsx           # Quiz page
│   │   │   └── ResultsPage.tsx        # Results page
│   │   ├── store/
│   │   │   ├── quizStore.ts           # Quiz state management
│   │   │   └── themeStore.ts          # Theme state management
│   │   ├── services/
│   │   │   └── api.ts                 # API client
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   └── App.tsx                    # Main app component
│   ├── package.json                   # Node dependencies
│   └── vite.config.ts                 # Vite configuration
└── README.md
```

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effect with backdrop blur
- **Theme Toggle**: Switch between light and dark modes
- **Animated Background**: Gradient animation for visual appeal
- **Smooth Transitions**: All interactions have smooth animations
- **Question Navigation**: Grid view to jump between questions
- **Progress Tracking**: Visual progress bar showing completion status
- **Responsive Layout**: Mobile-friendly design

## 🔧 Development

### Backend Development

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
# The backend runs directly with uvicorn in production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the amazing web framework
- [React](https://react.dev/) for the UI library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI-powered hints
- [pdfplumber](https://github.com/jsvine/pdfplumber) for PDF parsing

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for GATE aspirants
