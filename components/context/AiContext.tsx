'use client'
import { createContext, Dispatch, SetStateAction, useState } from "react";
import {  FormElementInstance } from "../ui-components/FormElements";


type AIContextType = {
    questionsPrompt : string,
    setQuestionsPrompt : Dispatch<SetStateAction<string>>,
    questionsResponse : FormElementInstance[]
    setQuestionsResponse :  Dispatch<SetStateAction<FormElementInstance[]>>
    // isQuestionsFetching : boolean,
    // setIsQuestionsFetching : Dispatch<SetStateAction<boolean>>,
    suggestionsQuestion : FormElementInstance[]
    setSuggestionsQuestion :Dispatch<SetStateAction<FormElementInstance[]>>
}


export const AIContext = createContext<AIContextType | null>(null)

export default function AIContextProvider({children}:{children:React.ReactNode}) {
    const [questionsPrompt , setQuestionsPrompt] = useState<string>("")
    const [questionsResponse , setQuestionsResponse] = useState<FormElementInstance[]>([])
    const [suggestionsQuestion , setSuggestionsQuestion] = useState<FormElementInstance[]>([])
    // const [isQuestionsFetching , setIsQuestionsFetching] = useState<boolean>(false)


  return (
    <AIContext.Provider value={{
      suggestionsQuestion,
      setSuggestionsQuestion,
        questionsPrompt,
        setQuestionsPrompt,
        questionsResponse,
        setQuestionsResponse,
        // isQuestionsFetching,
        // setIsQuestionsFetching,
    }}>{children}</AIContext.Provider>
  )
}