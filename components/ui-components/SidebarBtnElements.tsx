import React from "react";
import { FormElement } from "./FormElements";
import { Button } from "../ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function SidebarBtnElements({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      isDesignerBtnElement: true,
      type: formElement.type,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={'outline'}
      {...draggable.listeners}
      {...draggable.attributes}
      className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",draggable.isDragging && 'ring-2 ring-primary')}
    >
      <Icon className={`  scale-[2] text-white cursor-grab`} />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export  function SidebarBtnElementsDragOverlay({
    formElement,
  }: {
    formElement: FormElement;
  }) {
    const { label, icon: Icon } = formElement.designerBtnElement;
    
    return (
      <Button
        variant={'outline'}
      
        className={"flex flex-col gap-2 h-[120px] w-[120px] cursor-grab"}
      >
        <Icon className={`  scale-[2] text-white cursor-grab`} />
        <p className="text-xs">{label}</p>
      </Button>
    );
  }
  