"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/formBuilder/ui/card";
import { Badge } from "@/components/formBuilder/ui/badge";
import { formatDistance } from "date-fns";
import { useTranslation } from "react-i18next";
import { Form } from "@prisma/client";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { Button } from "@/components/formBuilder/ui/button";
import Link from "next/link";
import { FaEdit } from "react-icons/fa"
import { BiRightArrowAlt } from "react-icons/bi";



export function FormCard({ form }: { form: Form }) {
    const { t } = useTranslation()
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <span className="truncate font-bold">{form.name}</span>
            {form.published && <Badge>{t('fb.published')}</Badge>}
            {!form.published && <Badge variant={"destructive"}>{t('fb.draft')}</Badge>}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
            {form.published && (
              <span className="flex items-center gap-2">
                <LuView className="text-muted-foreground" />
                <span>{form.visits.toLocaleString()}</span>
                <FaWpforms className="text-muted-foreground" />
                <span>{form.submissions.toLocaleString()}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || "No description"}
        </CardContent>
        <CardFooter>
          {form.published && (
            <Button asChild className="w-full mt-2 text-md gap-4">
              <Link href={`/adminpanel/form_manager/forms/${form.id}`}>
                {t('fb.viewSubmissions')} <BiRightArrowAlt />
              </Link>
            </Button>
          )}
          {!form.published && (
            <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
              <Link href={`/adminpanel/form_manager/builder/${form.id}`}>
                {t('fb.editForm')} <FaEdit />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  