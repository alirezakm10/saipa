'use client'
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation()

  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text hover:cursor-pointer"
    >
      {t('fb.formBuilder')}
    </Link>
  );
}

export default Logo;
