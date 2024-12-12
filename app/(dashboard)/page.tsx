import { GetForms, GetFormStats } from "@/actions/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";
import { HiCursorClick } from "react-icons/hi";
import { FaWpforms } from "react-icons/fa";
import { BiRightArrowAlt } from "react-icons/bi";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/ui-components/CreateFormBtn";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
export default function Home() {
  return (
    <div className="container  px-4 md:px-0  mx-auto pt-4">
      <Suspense fallback={<SatesCards loading={true} />}>
        <CardStatesWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 5].map((ele) => (
            <FormCardSkeleton key={ele} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatesWrapper() {
  const stats = await GetFormStats();
  return <SatesCards loading={false} data={stats} />;
}
interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}
function SatesCards(props: StatsCardProps) {
  const { data, loading } = props;
  const cards = [
    {
      title: "Unique Visitors",
      value: data?.visits.toLocaleString() || "",
      icon: <LuView className="text-blue-500" />,
      helperText: "",
      loading,
      className: "shadow-md shadow-blue-500",
    },
    {
      title: "Bounces Rate",
      value: data?.bouncesRate.toLocaleString() + "%" || "",
      icon: <TbArrowBounce className="text-red-500" />,
      helperText: "",
      loading,
      className: "shadow-md shadow-red-500",
    },
    {
      title: "Submission Rate ",
      value: data?.submissionsRate.toLocaleString() + "%" || "",
      icon: <HiCursorClick className="text-purple-500" />,
      helperText: "",
      loading,
      className: "shadow-md shadow-purple-500",
    },
    {
      title: "Completed Forms ",
      value: data?.submissions || "0",
      icon: <FaWpforms className="text-green-500" />,
      helperText: "",
      loading,
      className: "shadow-md shadow-green-500",
    },
  ];
  return (
    <>
      <div className="w-full  pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
    </>
  );
}

interface SatesCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  helperText: string;
  className?: string;
}
function SatesCard(props: SatesCardProps) {
  const { title, value, icon, loading, helperText, className } = props;
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="text-sm text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}
async function FormCards() {
  const forms = await GetForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}
function FormCard({ form }: { form: Form }) {
  return (
    <Card className="w-full hover:scale-95 transition-all h-[190px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && (
            <Badge className="bg-green-500/50 text-green-500">Published</Badge>
          )}
          {!form.published && (
            <Badge className="bg-red-500/50 white">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground " />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>{form.description || "No description"}</CardContent>
          <CardFooter className="flex items-center justify-between text-muted-foreground text-sm">
          {form.published && (
            <Button >
              <Link href={`/form/${form.id}`}>View Form</Link>
              View Submissions <BiRightArrowAlt />
            </Button>
          )}
          {!form.published && (
            <Button  variant={'secondary'}>
              <Link href={`/builder/${form.id}`}>Edit Form</Link>
               <Edit />
            </Button>
          )}
          </CardFooter>



    </Card>
  );
}
