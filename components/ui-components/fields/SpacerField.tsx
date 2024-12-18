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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "@/components/ui/slider";
const type: ElementsType = "SpacerField";
const extraAttributes = {
  height:20
  
};
const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
  
});
export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Spacer Field",
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
  const {height } = element.extraAttributes;
  return (
    <div className="flex items-center justify-center flex-col gap-2 w-full">
      <Label className="text-muted-foreground flex flex-col gap-2">
        Spacer field {height}px
        <LuSeparatorHorizontal className="w-8 text-center mx-auto h-8" />
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
  const { height} = element.extraAttributes;
 
  return (
    <div style={{height,width:'100%'}}></div>
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
      height:element.extraAttributes.height
    },
  });

  // useEffect(()=>{
  //   form.reset(element.extraAttributes);

  // },[element,form])
  function applyChanges(values: PropertiesFormSchemaType) {
    const { height } = values;
    updateElement(element.id, {
      ...elementInstance,
      extraAttributes: {
        height
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height px : {form.watch('height')}</FormLabel>
              <FormControl>
                <Slider
                className="pt-2"
                min={5}
                max={200}
                step={1}
                onValueChange={(value) => field.onChange(value[0])}
                defaultValue={[field.value]}
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
