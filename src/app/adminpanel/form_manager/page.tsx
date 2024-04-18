import { Suspense } from "react";
import { Separator } from "@/components/formBuilder/ui/separator";
import CreateFormBtn from "@/components/formBuilder/CreateFormBtn";
import { redirect } from "next/navigation"
import { useTranslation } from "react-i18next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/helpers/authOptions";
import StatsCards from "@/components/formBuilder/other/StatsCards";
import { CardStatsWrapper } from "@/components/formBuilder/other/CardsStatsWrapper";
import { FormCards } from "@/components/formBuilder/other/FormCards";
import { FormCardSkeleton } from "@/components/formBuilder/other/FormCardSkeleton";

export default async function page(){
  const session = await getServerSession(authOptions)


  if(!session){
    redirect('/auth/signin')
  }

  console.log('this is retrived session inside server inside form manager component: ', session)

  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-2xl font-bold col-span-2">لیست فرم ها</h2>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}






