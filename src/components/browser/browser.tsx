"use client";
import { SpinnerLoader as Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useGetUserViewCourseListQuery } from "@/lib/store/Service/User_Auth_Api";
import Courselist from "./courselist";
import { GroupListSlider } from "@/components/global/group-list-slider";

const Browser = ({ accessToken }: { accessToken: string }) => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [usecategory, setCategory] = useState<string>("");
  const { data, isLoading, refetch, error } = useGetUserViewCourseListQuery({
    search,
    page,
    accessToken,
  });
  const category = ["All", "Technology and Tools", "Mobile Application Development", "Programming Languages", "DevOps", "Cloud Computing", "Artificial Intelligence", "Others"]
  return (
    <>
      {/* <span className="w-full py-4 flex flex-wrap">
        {category.map((text)=><span key={Math.random()} onClick={()=>setCategory(text)} className={`light:border-[#0084ff] border-1 rounded-3xl py-[6px] px-[14px] m-[5px] text-sm cursor-pointer ${usecategory == text ? "light:bg-[#0084ff] dark:bg-zinc-800" : ""}`}>{text}</span>)}
      </span> */}
      <div className="w-full md:w-[1000px] pb-4">
        <GroupListSlider overlay route />
      </div>
      <Courselist
        isLoading={isLoading}
        setPage={setPage}
        setSearch={setSearch}
        data={data}
      />
    </>
  );
};

export default Browser;
