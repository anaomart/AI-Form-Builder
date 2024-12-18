import { GetFormContentByUrl } from '@/actions/forms';
import { FormElementInstance } from '@/components/ui-components/FormElements';
import FormElementSubmitComponent from '@/components/ui-components/FormElementSubmitComponent';
import React from 'react'

export default async function SubmitPage({params}:{params:{formUrl:string;}}) {
  const form = await GetFormContentByUrl(params.formUrl)
  if(!form) return null 

  const formContent = JSON.parse(form.content ) as FormElementInstance[]


  return (
    <FormElementSubmitComponent formUrl={params.formUrl} content={formContent}/>
  )
}
