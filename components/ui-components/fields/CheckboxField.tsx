import React, { useEffect, useState } from "react";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { IoMdCheckbox } from "react-icons/io";
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
import { Checkbox } from "@/components/ui/checkbox";
const type: ElementsType = "CheckboxField";
const extraAttributes = {
  label: "Checkbox Field",
  helperText: "Helper Text",
  required: false,
};
const propertiesSchema = z.object({
  label: z.string().max(50),
  required: z.boolean().default(false),
  helperText: z.string().max(200),
});
export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: "CheckBox Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formELement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formELement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue === 'true'
    }

    return true;
  },
};
type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText } = element.extraAttributes;
  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-top gap-2 w-full">
      <Checkbox id={id} required={required}/>
      <div className="grid gap-1.5 leading-none">

  
      <Label htmlFor={id}>
        {label}
        {required && "*"}
      </Label>
      {helperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
          </div>
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
  const { label, required, placeHolder, helperText } = element.extraAttributes;
  const [error, setError] = useState(false);
  const [value, setValue] = useState<boolean>(formValue ==="true"? true:false);
  console.log({ formValue });

  useEffect(() => {
    setError(isInvalid == true);
  }, [isInvalid]);
  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-top gap-2 w-full">
      <Checkbox id={id} 
      checked={value}
      className={cn(error ? "border-red-500" : "")}
      onCheckedChange={(checked)=>{
        const stringValue = checked.toString()
        let value = false 
        if(checked === true ) value =true
        setValue(value)
        if(!submitValue) return

        const valid = CheckboxFieldFormElement.validate(element , stringValue)
        setError(!valid)
        submitValue(
         element.id,
       stringValue,
        );
      }}
      />
      <div className="grid gap-1.5 leading-none">

  
      <Label htmlFor={id} className={cn(error && "border-red-500")}>
        {label}
        {required && "*"}
      </Label>
      {helperText && (
        <p className={cn("text-xs text-muted-foreground",error&& 'border-red-500')}>{helperText}</p>
      )}
          </div>
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
      label: element.extraAttributes.label,
      required: element.extraAttributes.required,
      helperText: element.extraAttributes.helperText,
    },
  });

  // useEffect(()=>{
  //   form.reset(element.extraAttributes);

  // },[element,form])
  function applyChanges(values: PropertiesFormSchemaType) {
    const { label, required, helperText } = values;
    updateElement(element.id, {
      ...elementInstance,
      extraAttributes: {
        label,
        required,
        helperText,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
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
              <FormDescription>The label of the field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>helperText</FormLabel>
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
              <FormDescription>The helper text of the field.
              It will be displayed below the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm ">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>

              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
