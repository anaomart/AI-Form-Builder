import { UpdateFormContent } from "@/actions/forms";
import { FormElementInstance } from "@/components/ui-components/FormElements";

export const SaveForm = async (elements:FormElementInstance[], id:number) => {
      const JsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, JsonElements);
      
  };