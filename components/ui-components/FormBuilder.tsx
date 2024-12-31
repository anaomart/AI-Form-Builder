"use client";
import { Form } from "@prisma/client";
import React, { useEffect } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "../hooks/useDesigner";
import { FaSpinner } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Confetti from "react-confetti";
import { FormElementInstance } from "./FormElements";
import useAiQuestions from "../hooks/useAIQustions";

export default function FormBuilder({ form }: { form: Form }) {
  const { setElements ,setSelectedElement, elements, addElement } = useDesigner();
  const {questionsResponse} = useAiQuestions()
  const [isReady, setIsReady] = React.useState(false);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 },   
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { tolerance: 5, delay: 380 },
  });
  const list : FormElementInstance[] = [
    {
      "id": "1",
      "type": "TitleField",
      "extraAttributes": {
        "title": "Roof Assessment Form"
      }
    },
    {
      "id": "2",
      "type": "SubTitleField",
      "extraAttributes": {
        "title": "Property Information"
      }
    },
    {
      "id": "3",
      "type": "TextField",
      "extraAttributes": {
        "label": "Address",
        "helperText": "Enter the full address of the property",
        "required": true,
        "placeHolder": "123 Main Street, Anytown"
      }
    },
    {
      "id": "4",
      "type": "NumberField",
      "extraAttributes": {
        "label": "Age of Roof",
        "helperText": "Approximately how old is your current roof?",
        "required": true,
        "placeHolder": "e.g., 10"
      }
    },
      {
      "id": "5",
      "type": "SelectField",
      "extraAttributes": {
        "label": "Roof Type",
        "helperText": "What type of roof do you have?",
        "required": true,
          "placeHolder": "Select Roof Type",
        "options": ["Asphalt Shingles", "Tile", "Metal", "Slate", "Wood", "Other"]
      }
    },
    {
      "id": "6",
      "type": "TextAreaField",
      "extraAttributes": {
        "label": "Describe any existing roof problems",
        "helperText": "Leaks, missing shingles, etc.",
        "required": false,
        "placeHolder": "e.g., Leaks in the living room, missing shingles on the north side",
        "rows": 3
      }
    },  {
      "id": "7",
      "type": "CheckboxField",
      "extraAttributes": {
        "label": "Have you noticed any leaks?",
        "helperText": "",
        "required": true
      }
    },
    {
      "id": "8",
      "type": "CheckboxField",
      "extraAttributes": {
        "label": "Are there any missing or damaged shingles?",
        "helperText": "",
        "required": true
      }
    },
   {
      "id": "9",
      "type": "CheckboxField",
      "extraAttributes": {
        "label": "Are you interested in energy-efficient roofing options?",
        "helperText": "",
        "required": false
      }
    },
    {
      "id": "10",
      "type": "SubTitleField",
      "extraAttributes": {
        "label": "Contact Information"
      }
    },
    {
      "id": "11",
      "type": "TextField",
      "extraAttributes": {
        "label": "Name",
        "helperText": "Your full name",
        "required": true,
        "placeHolder": "e.g., John Doe"
      }
    },
      {
      "id": "12",
      "type": "TextField",
      "extraAttributes": {
        "label": "Phone Number",
        "helperText": "e.g., 555-123-4567",
        "required": true,
        "placeHolder": "e.g., 555-123-4567"
      }
    },
    {
      "id": "13",
      "type": "TextField",
      "extraAttributes": {
        "label": "Email Address",
        "helperText": "e.g., johndoe@email.com",
        "required": true,
        "placeHolder": "e.g., johndoe@email.com"
      }
    },
    {
      "id": "14",
      "type": "DateField",
      "extraAttributes": {
        "label": "Best Time to Contact",
        "helperText": "Select the best date and time to contact you",
        "required": true,
        "placeHolder": "Select Date and Time"
      }
    }
  ]

  useEffect(() => {
    // if (!isReady) return;
    console.log({ form });
    const elements = JSON.parse(form.content);
    setElements(elements);
    questionsResponse.reverse().forEach(element => {
      addElement(elements.length, element)
    });

    setSelectedElement(null)
    setIsReady(true);
  }, [form, setElements, isReady ,setSelectedElement]);

  const sensors = useSensors(mouseSensor, touchSensor);
  const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;
  if (!isReady) {
    <FaSpinner className="animate-spin h-12 w-12" />;
  }
  if (form.published) {
    return (
      <>
        <Confetti
          numberOfPieces={1000}
          recycle={false}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        <div className="flex flex-col items-center justify-center h-[80vh] w-full">
          <div className="max-w-lg">
            <h1 className="text-center text-3xl font-bold text-primary border-b pb-2 mb-10">
              🎊Form has been published🎊
            </h1>
            <h2 className="text-2xl">Share your Form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pbo-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="w-full"
                value={shareUrl}
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copied to clipboard",
                    description: "Link copied successfully",
                  });
                }}
              >
                Copy Link
              </Button>
              <div className="flex items-center w-full py-5 justify-between">
                <Button className="flex justify-between items-center" variant={"link"}>
                  <Link href="/">
                    <BsArrowLeft />
                    Go Back Home
                  </Link>
                </Button>
                <Button className="flex   justify-between items-center" variant={"link"}>
                  <Link href={`/forms/${form.id}`}>
                    <BsArrowRight className="ml-auto " />
                    Form details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-foreground mr-2">Form:</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div
          className='w-full flex flex-grow items-center 
    justify-center relative overflow-y-auto h-screen bg-accent bg-[url("/builderBG.svg")]'
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper></DragOverlayWrapper>
    </DndContext>
  );
}
