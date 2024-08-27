"use client";
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useAllUsersQuery } from "@/lib/store/Service/User_Auth_Api"
import UserTable from "./userTabel";

const CourseTable = ({accessToken}:{accessToken:string}) => {
  const [search , setSearch] = useState<string>('')
  const [rowsperpage , setRowsPerPage] = useState<number|null>(null)
  const [page, setPage] = useState<number>(1);
  const [ exclude_by, SetExcludeBy] = useState<string>('');
  const { data, isLoading, refetch, error } = useAllUsersQuery({search,rowsperpage, page, exclude_by,accessToken});
  useEffect(()=>{
    refetch()
  },[search, rowsperpage])
  return (
    <div className="max-w-[95rem] mx-auto w-full flex flex-col gap-4 h-[90vh] m-0 pt-5 px-1 overflow-y-auto scroll">
      <div className="max-w-[95rem] h-[75vh] mx-auto w-full">
        {isLoading ? (
          <span className="flex justify-center items-center h-[100vh] w-full">
            <Spinner color="default" />
          </span>
        ) : (
          <UserTable SetExcludeBy={SetExcludeBy} exclude_by={exclude_by} page={page} isLoading={isLoading} setPage={setPage} data={data} setSearch={setSearch} dataperpage={setRowsPerPage} refetch={refetch}/>
        )}
      </div>
    </div>
  );
};
export default CourseTable;
