import React, { useEffect, useState } from "react";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { MdTextFields } from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";
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
import { SelectTrigger, SelectValue ,Select, SelectContent, SelectItem,   } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
const type: ElementsType = "SelectField";
const extraAttributes = {
  label: "Select Field",
  helperText: "",
  required: false,
  placeHolder: "Select Field",
  options:[],
};
const propertiesSchema = z.object({
  label: z.string().max(50),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  helperText: z.string().max(200),
  options:z.array(z.string()).default([]),

});
export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },
  designerBtnElement: {
    icon: RxDropdownMenu,
    label: "Select Field",
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
      return currentValue.length > 0;
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
  const { label, required, placeHolder, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeHolder}/>
        </SelectTrigger>
      </Select>
      {helperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
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
  const { label, required, placeHolder, helperText , options } = element.extraAttributes;
  const [error, setError] = useState(false);
  const [value, setValue] = useState(formValue || "");
  console.log({ formValue });

  useEffect(() => {
    setError(isInvalid == true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={error ? "text-red-500" : ""}>
        {label}
        {required && "*"}
      </Label>
      <Select
      defaultValue={value}
      onValueChange={value=>{
         setValue(value)
        if(!submitValue) return 
        const valid =  SelectFieldFormElement.validate(element,value)
      setError(!valid);
      submitValue(element.id,value)
      }}>
        <SelectTrigger className={cn('w-full' ,  error && "border-red-500")}>
          <SelectValue placeholder={placeHolder}/>
        </SelectTrigger>
        <SelectContent>
          {options?.map(option =>(
            <SelectItem key={option} value={option} >{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <span
          className={cn(
            "text-xs text-muted-foreground text-[.8rem",
            error ? "text-red-500" : ""
          )}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement ,setSelectedElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      helperText: element.extraAttributes.helperText,
      options: element.extraAttributes.options,
    },
  });

  // useEffect(()=>{
  //   form.reset(element.extraAttributes);

  // },[element,form])
  function applyChanges(values: PropertiesFormSchemaType) {
    const { label, required, placeHolder, helperText, options } = values;
    updateElement(element.id, {
      ...elementInstance,
      extraAttributes: {
        label,
        required,
        placeHolder,
        helperText,
        options
      },
    });

    toast({
      title: 'success',
      description:'Properties Saved Successfully'
    })
    setSelectedElement(null)
  }
  return (
    <Form {...form}>
      <form
      onSubmit={form.handleSubmit(applyChanges)}
        className="space-y-3"
       
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
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
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
              <FormDescription>Placeholder of the filed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <Separator/>
         <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button variant={'outline'} className="gap-2" 
                onClick={(e)=>{
                  e.preventDefault();
                  form.setValue('options',field.value?.concat("New Options"))
                }}
                >
                  <AiOutlinePlus/>
                  Add
                </Button>
              </div>
                  <div className="flex flex-col gap-2">
                    {
                    form.watch('options')?.map((option,index)=>(
                      <div key={index} className="flex items-center justify-between gap-1">
                         <Input 
                        placeholder=""
                        value={option}
                        onChange={(e)=>{
                          field.value[index] = e.target.value ;
                          field.onChange(field.value)
                          
                        }}
/>
                        <Button variant={'ghost'} size={'icon'} onClick={e => {
                          e.preventDefault();
                          const newOptions = [...field.value];
                          newOptions.splice(index, 1);
                          field.onChange(newOptions);
                        }}>

                        </Button>
                        </div>
                    
                    ))
                    }

                  </div>
              <FormDescription>The helper text of the field.
              It will be displayed below the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <Separator />

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
        <Separator />
        <Button className="w-full" type='submit'>Save</Button>
      </form>
    </Form>
  );
}
