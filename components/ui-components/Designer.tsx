import React from "react";
import DesignerSideBar from "./DesignerSideBar.";
import {useDndMonitor, useDraggable, useDroppable} from '@dnd-kit/core'
import { cn } from "@/lib/utils";
import useDesigner from "../hooks/useDesigner";
import { idGenerator } from "@/lib/IdGenerator";
import { ElementsType, FormElementInstance, FormElements } from "./FormElements";
import { Button } from "../ui/button";
import { BiTrash } from "react-icons/bi";
export default function Designer() {
    const { elements , addElement} = useDesigner()
    const drapable = useDroppable({
        id:'designer-drop-area', 
        data:{
            isDesignerDropArea: true,
        }
    })

    useDndMonitor({
        onDragEnd: function (event) {

            const {active , over} = event
            if(!over  || !active) return;

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

            if(isDesignerBtnElement){
                const type = active.data?.current?.type 
                const newElement = FormElements[type as ElementsType].construct(idGenerator())
                console.log(newElement)

            
            addElement(0,newElement)
            }


        }
    })


  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full">
        <div
        ref={drapable.setNodeRef}
        className={cn("bg-background max-w-[920px] h-full  m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",drapable.isOver ? 'ring-2 ring-primary ' : '')}>
         
          {
            !drapable.isOver && elements.length === 0 && (
                
 <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
            Drop Here
          </p>               
            )
          }
          {
            drapable.isOver && elements.length === 0 && (
                <div className="p-4 w-full">
                    <div className="h-[120px] rounded-md bg-primary/20 w-full"></div>
                </div>
            )
          }
          {elements.length > 0 && (
              <div className="flex flex-col  w-full gap-2 p-4">
                {elements.map((element) => (
                                      <DesignerElementWrapper key={element.id} element={element}/>

                ))}
              </div>
          )}
        </div>
      </div>
      <DesignerSideBar/>
    </div>
  );
}

function DesignerElementWrapper({element}:{element:FormElementInstance}){
    const [mouseIsOver , setMouseIsOver] = React.useState<boolean>(false)
    const {removeElement} = useDesigner()
    const topHalf = useDroppable({
        id:element.id +"-top",
        data:{
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true
        }
    })
    const bottomHalf = useDroppable({
        id:element.id +"-bottom",
        data:{
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true
        }
    })

    const draggable = useDraggable({
        id:element.id +"-drag-handler",
        data:{
            type: element.type,
            elementId: element.id,
            isDesignerElement: true
        }
    })
    if(draggable.isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent
  return (
    <div 
    ref={draggable.setNodeRef}
    {...draggable.attributes}
    {...draggable.listeners}
    onMouseEnter={() => setMouseIsOver(true)}
    onMouseLeave={() => setMouseIsOver(false)}
    
    className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset">
    
    <div ref={topHalf.setNodeRef} className={cn("absolute top-0 w-full h-1/2 rounded-t-md")}></div>
    <div  ref={bottomHalf.setNodeRef} className={cn("absolute w-full h-1/2  bottom-0 rounded-b-md")}></div>
   {
    mouseIsOver && (
        <>
        <div className="absolute z-10 right-0 h-full">
            <Button
                onClick={()=>{
                    removeElement(element.id);
                }}
            className="flex justify-center h-full rounded-l-none bg-red-500 border rounded-md" variant={'outline'}>
                <BiTrash className="h-4 w-4"/>
            </Button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">Click for properties or drag to move </p>
        </div>
        
        </>
    )
   }
   {
    topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
    )
   }
   {
    bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"></div>
    )
   }
    <div
    
    className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",mouseIsOver && 'opacity-30'
        
    )}>
        <DesignerElement elementInstance={element} />
    </div>
    </div>
  )
} 