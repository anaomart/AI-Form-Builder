"use client";
import { Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer, { DesignerElementWrapper } from "./Designer";
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
import { FormElementInstance, FormElements } from "./FormElements";
import useAiQuestions from "../hooks/useAIQustions";
import {AnimatePresence, motion} from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormBuilder({ form }: { form: Form }) {
  const { setElements ,setSelectedElement, elements, addElement } = useDesigner();
  const [suggestedQuestionState, setSuggestedQuestionState] = useState<"normal"|"added"|"removed">("normal")
  const {questionsResponse , setQuestionsResponse , suggestionsQuestion , setSuggestionsQuestion} = useAiQuestions()
  const [isReady, setIsReady] = React.useState(false);
  const [isClient, setIsClient] = useState(false);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 },   
  });
  let shareUrl = "";

  console.log({questionsResponse})
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { tolerance: 5, delay: 380 },
  });
  const DesignerElement = FormElements[suggestionsQuestion[0]?.type || "TextField"].designerComponent 
  
  
  useEffect(() => {
    // if (!isReady) return;
    setIsClient(true)
    shareUrl = `${window?.location.origin}/submit/${form.shareURL}`
    console.log({ form });
    const elements = JSON.parse(form.content);
    setElements(elements);
    questionsResponse.forEach(element => {
      addElement(0, element)
    });

    setSelectedElement(null)
    setIsReady(true);

   

  }, [form, setElements, isReady ,setSelectedElement]);
 
  const sensors = useSensors(mouseSensor, touchSensor);
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
      <main className="flex flex-col  w-full">
<AnimatePresence> 
      {suggestionsQuestion?.length > 0 && (

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{  y: 0, opacity: 1 }}

          exit={{ y: suggestedQuestionState == "removed" ? -200 : 1000 , opacity: 0.2 , }}
          transition={{ duration: 0.5 }}
          className={cn(
            "absolute top-10 z-10 flex flex-col gap-2 items-center w-[85vw] mx-auto",)}
        >
         
          
          <span className="bg-gradient-to-r from-primary via-red-600/30 to-black opacity-80 text-white px-4 py-2 rounded-md transition-opacity duration-300">
            Suggestion Question
          </span>
          
          <div className="flex relative z-50  w-full h-[120px] items-center rounded-md bg-accent px-4 py-2 max-w-[920px] min-w-[320px] lg:min-w-[920px]">
            {DesignerElement && (
              <DesignerElement elementInstance={suggestionsQuestion[0]} />
            )}
             <div className="flex z-50 absolute right-4  items-center gap-4 ">
            <button
            onClick={()=>{
              addElement(elements?.length, suggestionsQuestion[0])
              setSuggestedQuestionState('added')
              setSuggestionsQuestion([])

              setTimeout(()=>{
                setSuggestedQuestionState('normal')

              },1000)
            }}
          
              className="flex items-center gap-2 cursor-pointer bg-green-700 hover:bg-green-700 text-white px-2 py-2 rounded-md transition-colors"
            >
              <Plus size={20} />
              Add 
            </button>
            <button
            onClick={()=>{
              setSuggestedQuestionState('removed')
              setTimeout(()=>{
                setSuggestionsQuestion([])
                setSuggestedQuestionState('normal')
              },250)
            }}
              className="flex items-center gap-2 bg-primary cursor-pointer hover:bg-red-700 text-white px-2 py-2 rounded-md transition-colors"
            >
              <Minus size={20} />
              Dismiss
            </button>
          </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
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
