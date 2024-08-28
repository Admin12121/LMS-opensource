"use client"
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useGetUserViewCourseListQuery } from "@/lib/store/Service/User_Auth_Api"
import Courselist from "./courselist";

const Browser = ({accessToken}:{accessToken:string}) => {
    const [search , setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(1);  
    const { data, isLoading, refetch, error } = useGetUserViewCourseListQuery({search, page, accessToken});
    return(
        <>
            <Courselist isLoading={isLoading} setPage={setPage} setSearch={setSearch} data={data}/>
        </>
    )
}

export default Browser