"use client";
import React from "react";
import { useGetCourseQuery } from "@/lib/store/Service/User_Auth_Api";
import { RxDashboard } from "react-icons/rx";
import TitleForm from "./components/titleForm";
import { SpinnerLoader } from "@/components/ui/spinner";
import DescriptionForm from "./components/descriptionForm";
import ImageUploaderForm from "./components/imageUploaderForm";
import CourseCategory from "./components/courseCategory";
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
    // <div>course-details {params}{JSON.stringify(data)}</div>
    <>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <SpinnerLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 overflow-hidden overflow-y-auto">
          <div>
            <div className="flex items-center gap-x-2">
              <RxDashboard size={22} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm slug={params} initialData={data} refetch={refetch} />
            <DescriptionForm slug={params} initialData={data} refetch={refetch} />
            <ImageUploaderForm slug={params} initialData={data} refetch={refetch} />
            <CourseCategory slug={params} initialData={data} refetch={refetch}/>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetails;
