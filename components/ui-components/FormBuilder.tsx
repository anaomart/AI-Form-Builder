'use client'
import { Form } from '@prisma/client'
import React from 'react'
import PreviewDialogBtn from './PreviewDialogBtn'
import SaveFormBtn from './SaveFormBtn'
import PublishFormBtn from './PublishFormBtn'
import Designer from './Designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'

export default function FormBuilder({form}:{form:Form}) {
  const mouseSensor = useSensor(MouseSensor,{
    activationConstraint: { distance: 15, },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { tolerance:5,delay: 380 },
  })

  const sensors = useSensors(mouseSensor ,touchSensor)
  return (
  <DndContext sensors={sensors}>
    <main className='flex flex-col w-full'>
    <nav className='flex justify-between border-b-2 p-4 gap-3 items-center'>
      <h2 className='truncate font-medium'>
        <span className='text-foreground mr-2'>
          Form: 
        </span>
        {form.name}
      </h2>
      <div className='flex items-center gap-2'>
        <PreviewDialogBtn/>
        {!form.published && (
          <>
          <SaveFormBtn/>
          <PublishFormBtn/>
          </>
        )}

      </div>
    </nav>
    <div className='w-full flex flex-grow items-center 
    justify-center relative overflow-y-auto h-screen bg-accent bg-[url("/builderBG.svg")]'>

      <Designer/>
    </div>
    
    </main>
    <DragOverlayWrapper></DragOverlayWrapper>
  </DndContext>
  )
}
