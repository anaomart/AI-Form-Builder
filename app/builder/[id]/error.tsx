'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function error() {
  return (
    <div className='w-full gap-4 flex flex-col items-center justify-center h-screen'>
        <h1 className='text-xl text-red-700'>Something went wrong</h1>
        <Button variant={'secondary'}>
            <Link href='/'>Go Back</Link>
        </Button>
         </div>
  )
}
