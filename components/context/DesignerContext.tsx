'use client'

import { createContext, useState } from "react";
import { FormElementInstance } from "../ui-components/FormElements"

type DesignerContextType = {
    elements:FormElementInstance[];
    addElement:(index:number, elements:FormElementInstance)=>void;
    removeElement:(id:string)=>void;
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({children}:{children:React.ReactNode}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const addElement = (index:number, element:FormElementInstance) => {
        setElements(prev=>[...prev.slice(0, index), element, ...prev.slice(index)])
    }
    const removeElement = (id:string) => {
        setElements(prev=>prev.filter(element=>element.id !== id))
    }
  return (
    <DesignerContext.Provider value={{elements, addElement ,removeElement}}>{children}</DesignerContext.Provider>
  )
}

