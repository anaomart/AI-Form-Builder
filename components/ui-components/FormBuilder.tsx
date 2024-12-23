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

export default function FormBuilder({ form }: { form: Form }) {
  const { setElements ,setSelectedElement} = useDesigner();
  const [isReady, setIsReady] = React.useState(false);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { tolerance: 5, delay: 380 },
  });

  useEffect(() => {
    // if (!isReady) return;
    console.log({ form });
    const elements = JSON.parse(form.content);
    setElements(elements);
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
