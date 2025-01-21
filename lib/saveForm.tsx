import { UpdateFormContent } from "@/actions/forms";
import { FormElementInstance } from "@/components/ui-components/FormElements";

export const SaveForm = async (elements:FormElementInstance[], id:number) => {
    try {
        const JsonElements = JSON.stringify(elements);
        console.log({JsonElements});
        await UpdateFormContent(id, JsonElements);
        console.log("Form content saved successfully");
    } catch (error) {
        console.error("Error saving form content", error);
    }
      
  };