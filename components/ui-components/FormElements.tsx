/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TextFieldFormElement } from "./fields/TextField";
import { IconType } from "react-icons/lib";

export type ElementsType = 'TextField'

export type FormElement = {
    type:ElementsType ;
    construct:(id:string)=>FormElementInstance;
    designerBtnElement:{
        icon:IconType,
        label:string
    }
    designerComponent :React.FC<{
        elementInstance:FormElementInstance
    }>
    formComponent :React.FC,
    propertiesComponent :React.FC
} 

export type FormElementInstance = {
    id: string,
   type : ElementsType,
   extraAttributes?:Record<string,any>;
}
type FormElementType = {
    [key in ElementsType]: FormElement
}
export const FormElements : FormElementType = {
    TextField : TextFieldFormElement  
}