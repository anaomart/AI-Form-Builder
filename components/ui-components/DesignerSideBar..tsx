import React from 'react'
import { FormElements } from './FormElements'
import SidebarBtnElements from './SidebarBtnElements'

export default function DesignerSideBar() {
  return (
    <aside className=' w-[400px] max-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>



    Elements
    <SidebarBtnElements formElement={FormElements.TextField}/>

    </aside>
  )
}
