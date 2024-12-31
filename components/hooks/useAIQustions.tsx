import React, { useContext } from 'react'
import { AIContext } from '../context/AiContext'

export default function useAiQuestions() {
  const context = useContext(AIContext)

  if (!context) {
    throw new Error("useAiQuestions must be used within a AIContextProvider.")
  }


  return context
}
