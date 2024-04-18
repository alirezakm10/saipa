"use client";
import { Button } from "@/components/formBuilder/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

function ErrorPage({ error }: { error: Error }) {
  const { t } = useTranslation()
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <h2 className="text-destructive text-4xl">{t('fb.submitSomthingwentWrong')}</h2>
      <Button asChild>
        <Link href={"/"}>{t('fb.goBackHome')}</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
