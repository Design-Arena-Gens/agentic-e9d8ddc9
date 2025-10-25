'use client'

import { useState } from 'react'

type Option = {
  text: string
  score: number
}

type Question = {
  id: string
  text: string
  options: Option[]
}

type Survey = {
  title: string
  description: string
  questions: Question[]
}

export default function Home() {
  const [mode, setMode] = useState<'create' | 'take'>('create')
  const [survey, setSurvey] = useState<Survey>({
    title: '',
    description: '',
    questions: []
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: [
      { text: '', score: 1 },
      { text: '', score: 2 }
    ]
  })

  // Taking survey state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', score: currentQuestion.options.length + 1 }]
    })
  }

  const updateOption = (index: number, text: string) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index].text = text
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index)
      setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }
  }

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.options.every(opt => opt.text)) {
      setSurvey({
        ...survey,
        questions: [...survey.questions, {
          id: Date.now().toString(),
          text: currentQuestion.text,
          options: currentQuestion.options
        }]
      })
      setCurrentQuestion({
        text: '',
        options: [
          { text: '', score: 1 },
          { text: '', score: 2 }
        ]
      })
    }
  }

  const removeQuestion = (id: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter(q => q.id !== id)
    })
  }

  const startSurvey = () => {
    if (survey.questions.length > 0) {
      setMode('take')
      setCurrentQuestionIndex(0)
      setAnswers([])
      setShowResults(false)
    }
  }

  const answerQuestion = (score: number) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateResults = () => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0)
    const maxScore = survey.questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0)
    const percentage = (totalScore / maxScore) * 100

    if (percentage >= 80) {
      return {
        type: "Highly Extroverted",
        description: "You're outgoing, energetic, and thrive in social settings. You draw energy from interactions with others."
      }
    } else if (percentage >= 60) {
      return {
        type: "Moderately Extroverted",
        description: "You enjoy social interactions but also appreciate your alone time. You're well-balanced in your approach."
      }
    } else if (percentage >= 40) {
      return {
        type: "Ambivert",
        description: "You're right in the middle! You can be social when needed but also enjoy introspection and solitude."
      }
    } else if (percentage >= 20) {
      return {
        type: "Moderately Introverted",
        description: "You prefer quieter settings and meaningful conversations. You recharge through solitary activities."
      }
    } else {
      return {
        type: "Highly Introverted",
        description: "You're reflective, thoughtful, and prefer deep connections over large gatherings. You find energy in solitude."
      }
    }
  }

  const resetSurvey = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setShowResults(false)
  }

  const backToCreator = () => {
    setMode('create')
    resetSurvey()
  }

  return (
    <div className="container">
      <h1>Personality Survey</h1>
      <p className="subtitle">Create and discover your personality type</p>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
          onClick={() => setMode('create')}
        >
          Create Survey
        </button>
        <button
          className={`mode-btn ${mode === 'take' ? 'active' : ''}`}
          onClick={startSurvey}
          disabled={survey.questions.length === 0}
        >
          Take Survey
        </button>
      </div>

      {mode === 'create' ? (
        <>
          <div className="question-form">
            <div className="input-group">
              <label>Survey Title</label>
              <input
                type="text"
                placeholder="e.g., Introvert vs Extrovert Test"
                value={survey.title}
                onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                placeholder="Brief description of your survey..."
                value={survey.description}
                onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Question</label>
              <input
                type="text"
                placeholder="Enter your question..."
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Answer Options</label>
              <div className="options-list">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-item">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}...`}
                      value={option.text}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    {currentQuestion.options.length > 2 && (
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => removeOption(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-secondary btn-small"
                onClick={addOption}
              >
                + Add Option
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={addQuestion}
              disabled={!currentQuestion.text || !currentQuestion.options.every(opt => opt.text)}
            >
              Add Question
            </button>
          </div>

          {survey.questions.length > 0 && (
            <div className="questions-list">
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#2d3748' }}>
                Questions ({survey.questions.length})
              </h3>
              {survey.questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <div className="question-text">
                      {index + 1}. {question.text}
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => removeQuestion(question.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>
                    {question.options.map((opt, i) => (
                      <div key={i}>• {opt.text}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {!showResults ? (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / survey.questions.length) * 100}%` }}
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px', color: '#718096', fontSize: '14px' }}>
                Question {currentQuestionIndex + 1} of {survey.questions.length}
              </div>

              <div className="question-card">
                <div className="question-text" style={{ fontSize: '18px', marginBottom: '16px' }}>
                  {survey.questions[currentQuestionIndex].text}
                </div>
                <div className="question-options">
                  {survey.questions[currentQuestionIndex].options.map((option, index) => (
                    <label key={index} className="option-label">
                      <input
                        type="radio"
                        name="answer"
                        onChange={() => answerQuestion(option.score)}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="results">
              <h2>{calculateResults().type}</h2>
              <p>{calculateResults().description}</p>
              <div style={{
                background: '#f7fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>
                  Your Score
                </div>
                <div style={{ fontSize: '32px', fontWeight: '600', color: '#667eea' }}>
                  {answers.reduce((sum, score) => sum + score, 0)} / {survey.questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0)}
                </div>
              </div>
              <div className="navigation-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={resetSurvey}
                >
                  Retake Survey
                </button>
                <button
                  className="btn btn-primary"
                  onClick={backToCreator}
                >
                  Create New Survey
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
