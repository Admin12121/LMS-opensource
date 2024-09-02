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
import Attachment from "./components/attachment";
import { CiFileOn } from "react-icons/ci";
const DescriptionForm = dynamic(() => import("./components/descriptionForm"), {
  ssr: false,
});
const Loader = dynamic(
  () => import("@/components/auth/activateaccount/loader"),
  {
    loading: () => (
      <span className="w-full h-[150px] flex items-center justify-center">
        <SpinnerLoader />
      </span>
    ),
  }
);

const Chapter = ({
  params,
  accessToken,
  course_slug,
}: {
  params: string;
  accessToken: string | null;
  course_slug: string | null;
}) => {
  const { data, isLoading, error, refetch } = useGetChapterQuery({
    params,
    accessToken,
  });
  const [videoUrl, setVideoUrl] = React.useState<string>("");

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
  };

  const requiredFields = [data?.title, data?.description, videoUrl];
  const Populated = (field: any) => {
    return (
      field !== null &&
      field !== "undefined" &&
      field !== undefined &&
      field.trim() !== ""
    );
  };
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Populated).length;
  const allFieldsCompleted = completedFields === totalFields;
  const completionText = `(${completedFields} / ${totalFields})`;
  const errorMessage =
    error && "data" in error
      ? (error.data as { detail?: string }).detail
      : "An error occurred";
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <SpinnerLoader />
        </div>
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center relative top-2">
          <FlickeringGrid color="#60A5FA" />
          <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 flex-col">
            <Loader />
            <p className="text-white text-sm">{errorMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-x-2 mt-4">
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 overflow-hidden overflow-y-auto">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-x-2">
                  <RxDashboard size={22} />
                  <h2 className="text-xl">Customize your chapter</h2>
                </span>
                <DeleteChapter
                  className="md:hidden"
                  params={params}
                  course_slug={course_slug}
                />
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
                <DeleteChapter
                  className="md:flex hidden"
                  params={params}
                  course_slug={course_slug}
                />
              </div>
              <ChapterSettingForm
                slug={params}
                initialData={data}
                refetch={refetch}
                completionText={allFieldsCompleted}
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
                  refetch={refetch}
                  onVideoUrlChange={handleVideoUrlChange}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2 mt-2">
                <CiFileOn size={22} />
                <h2 className="text-xl">Chapter Resources & Attachments</h2>
              </div>
              <div>
                <Attachment
                  slug={params}
                  initialData={data}
                  refetch={refetch}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chapter;
