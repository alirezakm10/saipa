"use client"
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { StatsCard } from "./StatsCard";
import { LuView } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { GetFormStats } from "@/actions/form";
import { FaWpforms } from "react-icons/fa";

interface StatsCardProps {
    data?: Awaited<ReturnType<typeof GetFormStats>>;
    loading: boolean;
  }

export default function StatsCards(props: StatsCardProps) {
    const { data, loading } = props
    const { t } = useTranslation()
  
    return (
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('fb.totalVisits')}
          icon={<LuView className="text-blue-600" />}
          helperText={t('fb.totalVisitsSub')}
          value={data?.visits.toLocaleString() || ""}
          loading={loading}
          className="shadow-md shadow-blue-600"
        />
  
        <StatsCard
          title={t('fb.totalSubmissions')}
          icon={<FaWpforms className="text-yellow-600" />}
          helperText={t('fb.totalSubmissionsSub')}
          value={data?.submissions.toLocaleString() || ""}
          loading={loading}
          className="shadow-md shadow-yellow-600"
        />
  
        <StatsCard
          title={t('fb.submissionRate')}
          icon={<HiCursorClick className="text-green-600" />}
          helperText={t('fb.submissionRateSub')}
          value={data?.submissionRate.toLocaleString() + "%" || ""}
          loading={loading}
          className="shadow-md shadow-green-600"
        />
  
        <StatsCard
          title={t('fb.bounceRate')}
          icon={<TbArrowBounce className="text-red-600" />}
          helperText={t('fb.bounceRateSub')}
          value={data?.submissionRate.toLocaleString() + "%" || ""}
          loading={loading}
          className="shadow-md shadow-red-600"
        />
      </div>
    );
  }