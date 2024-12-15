'use client'

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { FormElementInstance } from "../ui-components/FormElements"

type DesignerContextType = {
    elements:FormElementInstance[];
    addElement:(index:number, elements:FormElementInstance)=>void;
    removeElement:(id:string)=>void;

    selectedElement:FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>

}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({children}:{children:React.ReactNode}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance|null>(null);
    const addElement = (index:number, element:FormElementInstance) => {
      console.log({elements})
        setElements(prev=>[...prev.slice(0, index), element, ...prev.slice(index)])
    }
    const removeElement = (id:string) => {
        setElements(prev=>prev.filter(element=>element.id !== id))
    }
  return (
    <DesignerContext.Provider value={{elements, addElement ,removeElement , selectedElement,setSelectedElement}}>{children}</DesignerContext.Provider>
  )
}

