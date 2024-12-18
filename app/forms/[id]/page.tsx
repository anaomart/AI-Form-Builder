import { GetFormById, GetFormWithSubmissions } from "@/actions/forms";
import { SatesCard } from "@/app/(dashboard)/page";
import { ElementsType, FormElementInstance } from "@/components/ui-components/FormElements";
import FormLinkShare from "@/components/ui-components/FormLinkShare";
import VisitBtn from "@/components/ui-components/VisitBtn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { ElementType, ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";

export default async function FormDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("Form Not Found");
  }
  const { visits, submissions } = form;

  let submissionsRate = 0;
  if (visits) {
    submissionsRate =
      submissions === 0 ? 0 : Math.floor((submissions / visits) * 100);
  }

  const bouncesRate = 100 - submissionsRate;
   const cards = [
      {
        title: "Unique Visitors",
        value: visits.toLocaleString() || "",
        icon: <LuView className="text-blue-500" />,
        helperText: "",
        loading: false,
        className: "shadow-md shadow-blue-500",
      },
      {
        title: "Bounces Rate",
        value: bouncesRate.toLocaleString() + "%" || "",
        icon: <TbArrowBounce className="text-red-500" />,
        helperText: "",
        loading: false,
        className: "shadow-md shadow-red-500",
      },
      {
        title: "Submission Rate ",
        value: submissionsRate.toLocaleString() + "%" || "",
        icon: <HiCursorClick className="text-purple-500" />,
        helperText: "",
        loading: false,
        className: "shadow-md shadow-purple-500",
      },
      {
        title: "Completed Forms",
        value: submissions || "0",
        icon: <FaWpforms className="text-green-500" />,
        helperText: "",
        loading: false,
        className: "shadow-md shadow-green-500",
      },
    ];
  return (
    <>
      <div className="p-10 border-b w-full flex flex-col border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareURL={form.shareURL} />
        </div>
        <div className="py-4 border-b border-muted">
          <div className="container flex gap-2 items-center justify-center">
            <FormLinkShare shareURL={form.shareURL}/>
          </div>
        </div>

        <div className="w-full pt-8 gap-4  container">
        <div className="min-w-max  pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <SatesCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            loading={card.loading}
            helperText={card.helperText}
            className={card.className}
          />
        ))}
      </div>
        </div>
        <div className="container pt-10">
          <SubmissionsTable  id={form.id}/>
        </div>
      </div>
    </>
  );
}

async function SubmissionsTable({id}:{id:number}) {
  const form = await GetFormWithSubmissions(id)

  if(!form) throw new Error(`form not found `)
  
  const FormElements = JSON.parse(form.content) as FormElementInstance[];
  type Row = {
    [key:string]:string} & {
      submittedAt:Date
    }
    const rows: Row[]= []
  form.FormSubmissions.forEach((submission)=>{
    const content = JSON.parse(submission.content)
    rows.push({
      ...content,
      submittedAt:submission.createdAt
    })
  })
  const columns:{
    id:string;
    label:string;
    required:boolean;
    type: ElementsType;
  }[] = []
  FormElements.forEach(ele =>{
    switch (ele.type){
      case "TextField":
        columns.push({id:ele.id, label:ele.extraAttributes?.label, required:ele.extraAttributes?.required, type:ele.type})
        break;
      default:
        break
    }
  })
  return <div className="text-2xl font-bold my-4">

    <div className="rounded-md border">
      <Table>


        <TableHeader>
          <TableRow>
          {
            columns.map(({ id, label, required }) => (
              <TableHead className="uppercase" key={id}>
                  <span className="">                {label}
                  </span>
              </TableHead>
            ))
          }
          <TableHead className="text-muted-foreground text-right uppercase">
            Submitted at 
          </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            rows.map((row ,index) => (
              <TableRow key={index}>
                {
                  columns.map(({ id, type }) => (
                    <RowCell key={id} type={type} value={row[id]} />
                  ))
                }
                
                <TableCell className="text-muted-foreground text-right">
                  {
                  formatDistance( row.submittedAt, new Date(),{addSuffix:true})}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>


    </div>

  </div>
}

function RowCell({ type, value }: { type: ElementsType, value: string }) {
  const node:ReactNode = value

  return <TableCell>{node}</TableCell>


}