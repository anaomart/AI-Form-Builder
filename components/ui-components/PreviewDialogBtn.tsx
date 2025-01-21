import React from 'react'
import { Button } from '../ui/button'
import { MdPreview } from 'react-icons/md'
import useDesigner from '../hooks/useDesigner'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { FormElements } from './FormElements'

export default function PreviewDialogBtn() {
  const {elements} = useDesigner()
  return (

    <Dialog>
      <DialogTrigger asChild >
        <Button value={'outline'} className='gap-2'>
          <MdPreview className='h-6 w-6'/>
          Preview 
        </Button>
      </DialogTrigger>
      <DialogContent className= 'w-screen min-h-screen transition-all max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0' >

    <div className='px-4 py-2 border-b'>
        <DialogTitle className='text-lg font-bold text-muted-foreground'>
          Form Preview
        </DialogTitle>
        <p>
          This is how your form will look like to your users
        </p>
    </div>  

    <div className=' bg-accent max-h-[90vh] w-full flex flex-col flex-grow items-center justify-center p-4 bg-[url("/builderBG.svg")]  '>
      <div className='max-w-[620px] ring-primary ring-1 flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto'>
        {
          elements.map((item, index) => {
            const FormComponent = FormElements[item.type].formComponent
            return     <FormComponent key={item.id} elementInstance={item} />
            
          })
        }
      </div>
    </div>

      </DialogContent>

       

    </Dialog>


    
  )
}
