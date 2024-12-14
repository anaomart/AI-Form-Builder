import React from 'react'
import { Button } from '../ui/button'
import { MdOutlinePublish } from 'react-icons/md'
export default function PublishFormBtn() {
    return (
        <Button variant={"outline"} className='gap-2 text-white bg-gradient-to-r from-primary to-bg-black'>
    
            <MdOutlinePublish className='h-6 w-6'/>
            Save</Button>
      )
}
