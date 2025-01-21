import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from '../hooks/useDesigner'
import { UpdateFormContent } from '@/actions/forms'
import { toast } from '@/hooks/use-toast'
import { FaSpinner } from 'react-icons/fa'
import { SaveForm } from '@/lib/saveForm'
export default function SaveFormBtn({id}:{id:number}) {
  const {elements} = useDesigner()
  const [loading, startTransition] = useTransition()
   const updateFormContact = async ()=>{
    try{
      console.log({elements})
      console.log({id})
     await SaveForm(elements, id)
     toast({
      title:'Success!',
      description: 'Form has been saved successfully',
     })
  } catch (error) {
    toast({
      title:'Error!',
      description: 'Something went wrong',
      variant:'destructive'
     })   }}  

  return (
    <Button id='save' variant={"outline"}
    onClick={()=> startTransition(updateFormContact)}
    className='gap-2'>

        <HiSaveAs className='h-6 w-6'/>
        Save 
        {loading && <FaSpinner className='animate-spin'>...</FaSpinner>}
        
        </Button>
  )
  
}
