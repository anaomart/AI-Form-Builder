'use client'
import { Form } from '@prisma/client'
import React from 'react'

export default function FormBuilder({form}:{form:Form}) {
  return (
    <div>{form.name}</div>
  )
}
