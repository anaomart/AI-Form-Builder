'use client';

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImSpinner2 } from 'react-icons/im';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { toast } from '@/hooks/use-toast';
import { formSchema, formSchemeType } from '@/schemas/form';
import { CreateForm } from '@/actions/forms';
import { useRouter } from 'next/navigation';

export default function CreateFormBtn() {
    const router = useRouter();
    const form = useForm<formSchemeType>({
        resolver: zodResolver(formSchema)
    })

   async function onSubmit(values :formSchemeType){
        console.log(values)

        try {
            // Simulate a request to create a form
          const formId=  await CreateForm(values)
          console.log('Form created successfully with id:', formId)
            toast({
                title: 'Success',
                description: "Form created successfully",
                variant:"destructive",
                className:"bg-green-500"
            })
            router.push('/builder/'+formId)
        }catch(error){
            console.error(error)
            toast({
                title: 'Error',
                description: "Something went wrong, please try again",
                variant:"destructive"
            })
        }



    }

  return (
    <Dialog>
        <DialogTrigger asChild>
        <Button
         className='group transition-all border border-primary/20 h-[190px] hover:scale-95 items-center justify-center flex flex-col 
         hover:border-primary hover:cursor-pointer border-dashed gap-4'>
            <BsFileEarmarkPlus className='w-10 h-10 transition-all scale-150 text-muted-foreground group-hover:text-black'/>
            <p className='font-bold text-xl text-muted-foreground transition-all  group-hover:text-black'>

            Create New form

            </p>
            
            </Button>
            
            </DialogTrigger>
    <DialogContent className='max-w-[400px] rounded-xl'>
        <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>
                Create a New Form with AI
            </DialogDescription>
        </DialogHeader>
        <Form   {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
            
        </form>
        </Form>
        <DialogFooter>
            <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className='w-full mt-4'
            type="submit" variant="default">
            
            
            {!form.formState.isSubmitting && <span>Save</span>}
            {form.formState.isSubmitting && <ImSpinner2 className='animate-spin'/>}
            </Button>
            
        </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}
