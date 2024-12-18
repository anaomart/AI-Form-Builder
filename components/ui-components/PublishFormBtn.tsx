import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { MdOutlinePublish } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { FaIcons } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { PublishFormFC } from "@/actions/forms";
import { useRouter } from "next/navigation";
export default function PublishFormBtn({id}:{id:number}) {
    const [loading, startTransition] = useTransition();
    const  router= useRouter();

    async function PublishForm(){
        try {
            await PublishFormFC(id);
            toast({
                title: "Form Published Successfully",
                description: "Your form has been successfully published.",
            })
            router.refresh()
        }catch (error) {
            toast({
                title: "Failed to Publish Form",
                description: "An error occurred while trying to publish the form. Please try again later.",
            })
        }
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button
      variant={"outline"}
      className="gap-2 text-white bg-gradient-to-r from-primary to-bg-black"
    >
      <MdOutlinePublish className="h-6 w-6" />
      Publish
    </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
           <AlertDialogHeader>
           <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
            <AlertDialogDescription>After Publishing the form can not be edited.</AlertDialogDescription>
            <AlertDialogDescription>Editing Will be available soon.</AlertDialogDescription>

           </AlertDialogHeader>
           <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={(e)=>{
                e.preventDefault();
                startTransition(() => PublishForm());
            }}>Proceed 

                {loading && <FaIcons className='animate-spin' />}
            </AlertDialogAction>
           </AlertDialogFooter>
           
            </AlertDialogContent>
    </AlertDialog>
  );
}
