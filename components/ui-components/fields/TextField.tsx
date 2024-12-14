import React from "react";

import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { MdTextFields } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const type: ElementsType = "TextField";
const extraAttributes = {
    label: "Text Field", 
    helperText: "Text Field",
    required:false,
    placeHolder:"Text Field"
}
export const TextFieldFormElement: FormElement = {
  type,
  construct: (id) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },
  designerBtnElement:{
    icon:MdTextFields,
    label:"Text Field"
  },
  designerComponent: DesignerComponent,
  formComponent: () => <div>designer</div>,
  propertiesComponent: () => <div>designer</div>,
};
type CustomInstance = FormElementInstance & { extraAttributes: typeof extraAttributes };
function DesignerComponent({elementInstance}:{elementInstance:FormElementInstance}){
    const element = elementInstance as CustomInstance
    const {label,required,placeHolder , helperText} = element.extraAttributes
    return <div className="flex flex-col gap-2 w-full">
        <Label>
        {label}
        {required && "*"}
            
        </Label>
        <Input readOnly disabled placeholder={placeHolder} />
        {helperText && <span className="text-xs text-muted-foreground">{helperText}</span>}
       </div>

}