"use client";
import React from "react";
import { SpinnerLoader } from "@/components/ui/spinner";
import { useGetChapterQuery } from "@/lib/store/Service/User_Auth_Api";
import FlickeringGrid from "@/components/ui/bg-animation";
import { RxDashboard } from "react-icons/rx";
import ChapterTitleForm from "./components/chapterTitleForm";
import dynamic from "next/dynamic";
import ChapterSettingForm from "./components/ChapterSettings";
import { IoVideocam } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import VideoUploaderForm from "./components/VideoUploaderForm";
import { DeleteChapter } from "./components/deleteChapter";
const DescriptionForm = dynamic(() => import("./components/descriptionForm"), {
  ssr: false,
});

const Chapter = ({
  params,
  accessToken,
  course_slug
}: {
  params: string;
  accessToken: string | null;
  course_slug: string | null;
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
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-x-2">
                <RxDashboard size={22} />
                <h2 className="text-xl">Customize your chapter</h2>  
              </span>             
              <DeleteChapter className="md:hidden" params={params} course_slug={course_slug} />
            </div>
            <ChapterTitleForm
              slug={params}
              initialData={data}
              refetch={refetch}
            />
            <DescriptionForm
              slug={params}
              initialData={data}
              refetch={refetch}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-x-2">
                <IoSettingsOutline size={22} />
                <h2 className="text-xl">Chapter Settings</h2>
              </span>
              <DeleteChapter className="md:flex hidden" params={params} course_slug={course_slug} />
            </div>
            <ChapterSettingForm
              slug={params}
              initialData={data}
              refetch={refetch}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2 mt-2">
              <IoVideocam size={22} />
              <h2 className="text-xl">Add a Video</h2>
            </div>
            <div>
              <VideoUploaderForm
                slug={params}
                initialData={data}
                refetch={refetch}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chapter;
