import React, { useEffect, useState } from "react";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDesigner from "@/components/hooks/useDesigner";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { LuHeading1 } from "react-icons/lu";
const type: ElementsType = "TitleField";
const extraAttributes = {
  title: "Title Field",
  
};
const propertiesSchema = z.object({
  title: z.string().max(50),
  
});
export const TitleFieldFormElement: FormElement = {
  type,
  construct: (id) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (): boolean => {return true
  },
};
type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const {title } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground flex flex-col gap-2">
        Title field
        
        <p className="text-xl md:text-2xl">

        {title}
        </p>
      </Label>
      
    </div>
  );
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  formValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  formValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { title} = element.extraAttributes;
  const [error, setError] = useState(false);
  const [value, setValue] = useState(formValue || "");
  console.log({ formValue });

  useEffect(() => {
    setError(isInvalid == true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col gap-2 w-full">
      
        
        <p className="text-xl md:text-2xl">
        
        {title}
      </p>
      
     
    </div>
  );
}
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      title:element.extraAttributes.title
    },
  });

  // useEffect(()=>{
  //   form.reset(element.extraAttributes);

  // },[element,form])
  function applyChanges(values: PropertiesFormSchemaType) {
    const { title } = values;
    updateElement(element.id, {
      ...elementInstance,
      extraAttributes: {
        title
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        
       
      </form>
    </Form>
  );
}
