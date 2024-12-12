import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <Link href='/' className='font-bold text-3xl bg-gradient-to-t from-primary to-secondary bg-clip-text text-transparent'>AI Form Builder</Link>
  )
}
