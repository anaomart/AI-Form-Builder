import React from 'react'
import useDesigner from '../hooks/useDesigner'
import { FormElements } from './FormElements'
import { Button } from '../ui/button'
import { AiOutlineClose } from 'react-icons/ai'

export default function PropertiesFormSidebar() {
    const {selectedElement ,setSelectedElement }= useDesigner()
    if(!selectedElement) return null
    const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent
  return (
    
    <div className='flex flex-col p-2'>
        <div className='flex justify-between items-center'>
                <p>Elements Properties</p>
                <Button size={'icon'} variant={'outline'} onClick={()=>setSelectedElement(null)} className=''>
                    <AiOutlineClose/>
                </Button>
        </div>

        <PropertiesForm/>
    </div>
  )
}
