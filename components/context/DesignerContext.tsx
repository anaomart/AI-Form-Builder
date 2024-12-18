'use client'

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { FormElementInstance } from "../ui-components/FormElements"

type DesignerContextType = {
    elements:FormElementInstance[];
    addElement:(index:number, elements:FormElementInstance)=>void;
    removeElement:(id:string)=>void;
    setElements:Dispatch<SetStateAction<FormElementInstance[]>>
    selectedElement:FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>
    updateElement:(id:string,element:FormElementInstance)=>void
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

    const updateElement = (id:string, element:FormElementInstance) => {
        setElements(prev=>prev.map(e=>e.id === id? element : e))
    }


  return (
    <DesignerContext.Provider value={{elements, addElement ,setElements ,removeElement , selectedElement,setSelectedElement  ,updateElement }}>{children}</DesignerContext.Provider>
  )
}

