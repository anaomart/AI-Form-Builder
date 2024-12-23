'use server'

import { FormElementInstance } from "@/components/ui-components/FormElements"

export const GenerateQuestions = async (prompt:string) => {
    
    console.log({prompt})

    setTimeout(()=>{
        return "this is prompt"
    },2000)
    return [
        {
            "id": "5905",
            "type": "TextField",
            "extraAttributes": {
                "label": "Text Field",
                "helperText": "Text Field",
                "required": false,
                "placeHolder": "Text Field"
            }
        },
        {
            "id": "6916",
            "type": "TitleField",
            "extraAttributes": {
                "title": "Text Field"
            }
        },
        {
            "id": "4572",
            "type": "NumberField",
            "extraAttributes": {
                "label": "NumberField Field",
                "helperText": "Helper Field",
                "required": false,
                "placeHolder": "0"
            }
        },
        {
            "id": "7401",
            "type": "DateField",
            "extraAttributes": {
                "label": "Date Field",
                "helperText": "Date Field",
                "required": false,
                "placeHolder": "Pick a date"
            }
        }
    ] as FormElementInstance[]
}