import React from 'react'

import useDesigner from '../hooks/useDesigner'
import FormElementsSidebar from './FormElementsSidebar'
import PropertiesFormSidebar from './PropertiesFormSidebar'

export default function DesignerSideBar() {
  const {selectedElement ,setSelectedElement} = useDesigner()
  return (
    <aside className=' w-[400px] max-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>

    {!selectedElement && <FormElementsSidebar/>}
    {selectedElement && <PropertiesFormSidebar/>}



    </aside>
  )
}
