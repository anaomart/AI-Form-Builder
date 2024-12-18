"use client";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "../ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "@/hooks/use-toast";
import { ImSpinner } from "react-icons/im";
import { SubmitForm } from "@/actions/forms";

export default function FormElementSubmitComponent({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

    const [submitted , setSubmitted] = useState(false)
    const [pending , startTransition] = useTransition()


  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    console.log({key, value});
    formValues.current[key] = value;
  }, []);
  async function submitForm() {
      formErrors.current = {};
    const validForm = validateForm();

    if (!validForm) {
        setRenderKey(new Date().getTime())
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return
    }

    try{
        if(validForm){
            const JsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl , JsonContent).then(()=>{})
            setSubmitted(true)
        }
        
    }catch (e) {
        toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      });
    }



    console.log(formValues.current);
  }

    if(submitted){
        return <div className=" flex justify-center w-full h-full items-center p-8">

        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-primary rounded">

            <h1 className="text-2xl font-bold">Form Sublimed</h1>
            <p className="text-muted-foreground">Thank you for submitting the form You can close this page now.</p>
        </div>

        </div>
    }

  return (
    <div className="flex justify-center w-ful h-full items-center p-8 ">
      <div  className="max-w-[620px] flex flex-col gap-4 flex-grow bg-ground w-full p-8 overflow-y-auto border shadow-xl shadow-primary rounded">
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;

          return (
            <FormElement
              isInvalid={formErrors.current[element.id]}
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
           
                startTransition(() =>   submitForm());
            
            
          }}
          disabled={pending}
        >
         {
            !pending ?  <> <HiCursorClick className="mr-2" />  Submit </> :<> <ImSpinner className="mr-2 animate-spin"/></>
         }
        </Button>
      </div>
    </div>
  );
}
