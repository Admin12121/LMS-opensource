"use client";
import React from "react";
import { SpinnerLoader } from "@/components/ui/spinner";
import { useGetChapterQuery } from "@/lib/store/Service/User_Auth_Api";
import FlickeringGrid from "@/components/ui/bg-animation";
import { RxDashboard } from "react-icons/rx";
import ChapterTitleForm from "./components/chapterTitleForm";
import dynamic from 'next/dynamic';
const DescriptionForm = dynamic(() => import('./components/descriptionForm'), { ssr: false })

const Chapter = ({
  params,
  accessToken,
}: {
  params: string;
  accessToken: string | null;
}) => {
  const { data, isLoading, error, refetch } = useGetChapterQuery({
    params,
    accessToken,
  });
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <SpinnerLoader />
        </div>
      ) : error ? (
        <FlickeringGrid color="#60A5FA" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 overflow-hidden overflow-y-auto">
          <div>
            <div className="flex items-center gap-x-2">
              <RxDashboard size={22} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm slug={params} initialData={data} refetch={refetch} />
            <DescriptionForm slug={params} initialData={data} refetch={refetch} />
          </div>
        </div>
      )}
    </>
  );
};

export default Chapter;
