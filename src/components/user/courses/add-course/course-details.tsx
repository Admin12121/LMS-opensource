"use client";
import React from "react";
import { useGetCourseQuery } from "@/lib/store/Service/User_Auth_Api";
import { RxDashboard } from "react-icons/rx";
import TitleForm from "./components/titleForm";
import { SpinnerLoader } from "@/components/ui/spinner";
import DescriptionForm from "./components/descriptionForm";
import ImageUploaderForm from "./components/imageUploaderForm";
import CourseCategory from "./components/courseCategory";
import { FaList } from "react-icons/fa6";
import { AiOutlineDollar } from "react-icons/ai";
import { CiFileOn } from "react-icons/ci";
import PriceForm from "./components/priceForm";
import Attachment from "./components/attachment";
import FlickeringGrid  from "@/components/ui/bg-animation"
import ChapterForm from "./components/chapters/chapterForm";
const CourseDetails = ({
  params,
  accessToken,
}: {
  params: string;
  accessToken: string | null;
}) => {
  const { data, isLoading, error, refetch } = useGetCourseQuery({
    params,
    accessToken,
  });
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <SpinnerLoader />
        </div>
      ) : error ? <FlickeringGrid color="#60A5FA" /> : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 overflow-hidden overflow-y-auto">
          <div>
            <div className="flex items-center gap-x-2">
              <RxDashboard size={22} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm slug={params} initialData={data} refetch={refetch} />
            <DescriptionForm
              slug={params}
              initialData={data}
              refetch={refetch}
            />
            <ImageUploaderForm
              slug={params}
              initialData={data}
              refetch={refetch}
            />
            <CourseCategory
              slug={params}
              initialData={data}
              refetch={refetch}
              accessToken={accessToken}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <FaList size={20} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <div>
              <ChapterForm slug={params} initialData={data} refetch={refetch}/>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <AiOutlineDollar size={22} />
                <h2 className="text-xl">Sell Course</h2>
              </div>
              <div>
                <PriceForm slug={params} initialData={data} refetch={refetch} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <CiFileOn size={22} strokeWidth={1}/>
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <div>
                <Attachment slug={params} initialData={data} refetch={refetch}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetails;
