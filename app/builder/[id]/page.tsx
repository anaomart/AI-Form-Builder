import { GetFormById } from "@/actions/forms";
import FormBuilder from "@/components/ui-components/FormBuilder";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = (await params)
    const form = await GetFormById(Number(id));
    if(!form) {
        throw new Error("Form Not Found")
    }




  return <div>

    <FormBuilder form={form}/>
  </div>;
}
 