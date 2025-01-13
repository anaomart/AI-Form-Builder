import { GetFormById, GetFormWithSubmissions } from "@/actions/forms";
import { SatesCard } from "@/app/(dashboard)/page";
import {
  ElementsType,
  FormElementInstance,
} from "@/components/ui-components/FormElements";
import FormLinkShare from "@/components/ui-components/FormLinkShare";
import VisitBtn from "@/components/ui-components/VisitBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistance } from "date-fns";
import { ElementType, ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";
import ExportButton, { ToPDF } from "./ExportButton";

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
        <div className="flex justify-between ">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareURL={form.shareURL} />
        </div>
        <div className="py-4 border-b border-muted">
          <div className=" flex gap-2 items-center justify-center">
            <FormLinkShare shareURL={form.shareURL} />
          </div>
        </div>

        <div className="w-full pt-8 gap-4  ">
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
        <div className=" pt-10">
          <SubmissionsTable id={form.id} />
        </div>
      </div>
    </>
  );
}

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) throw new Error(`form not found `);

  const FormElements = JSON.parse(form.content) as FormElementInstance[];
  type Row = {
    [key: string]: string;
  } & {
    submittedAt: Date;
  };
  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];
  FormElements.forEach((ele) => {
    switch (ele.type) {
      case "TextField":
      case "TextAreaField":
      case "CheckboxField":
      case "DateField":
      case "NumberField":
      case "SelectField":
        columns.push({
          id: ele.id,
          label: ele.extraAttributes?.label,
          required: ele.extraAttributes?.required,
          type: ele.type,
        });
        break;

      default:
        break;
    }
  });
  return (
    <div className="text-2xl font-bold my-4">
      <div className="my-4 text-end">
        <div className="flex gap-2 justify-end">
          <ExportButton />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="">
              {columns.map(({ id, label, required }) => (
                <TableHead className="uppercase  " key={id}>
                  <span>
                    {" "}
                    {label.length > 25 ? (
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className=" mx-2 bg-primary p-1 text-nowrap rounded-md text-white">
                              {" "}
                              {label.slice(0, 25)}...{" "}
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-base">
                              <p> {label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <span className="text-nowrap mx-2  p-1 bg-primary rounded-md text-white">
                        {label}
                      </span>
                    )}
                  </span>
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-center rounded-md text-white text-nowrap  w-fit uppercase">
               <span className="flex justify-center items-center bg-blue-600 p-2 rounded-md">PDF Version</span>
              </TableHead>
              <TableHead className="text-muted-foreground rounded-md text-white text-nowrap text-right uppercase">
              <span className="flex justify-center items-center bg-blue-600 p-2 rounded-md">Submitted at</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map(({ id, type, label }) => (
                  <RowCell key={id} type={type} value={row[id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">

                <ToPDF
                  columns={columns}
                  row={row}
                  date={row.submittedAt}
                  title={form.name}
                />
                </TableCell>
              
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;
  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checkboxValue = value === "true";
      node = <Checkbox checked={checkboxValue} disabled />;
  }
  return (
    <TableCell className=" text-center py-2">
      {typeof node === "string" && node.length > 40 ? (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="">
                {" "}
                {node .slice(0, 25)}...{" "}
              </TooltipTrigger>
              <TooltipContent className="bg-black text-base">
                <p> {node}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div>{node}</div>
      )}
    </TableCell>
  );
}
