import { GetFormContentByUrl } from '@/actions/forms';
import { FormElementInstance } from '@/components/ui-components/FormElements';
import FormElementSubmitComponent from '@/components/ui-components/FormElementSubmitComponent';
import React from 'react'

type Params =  Promise<{ formUrl: string }>

export default async function SubmitPage(props:{params:Params}) {
  const params = await props.params ;
  const form = await GetFormContentByUrl(params.formUrl)
  if(!form) return null 

  const formContent = JSON.parse(form.content ) as FormElementInstance[]


  return (
    <FormElementSubmitComponent formUrl={params.formUrl} content={formContent}/>
  )
}
