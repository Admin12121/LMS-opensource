"use client"
import React from 'react'
import {useGetCourseQuery} from "@/lib/store/Service/User_Auth_Api"

const CourseDetails = ({params, accessToken}:{params:string, accessToken:string|null}) => {
  const {data, isLoading, error} = useGetCourseQuery({params, accessToken})
  return (
    // <div>course-details {params}{JSON.stringify(data)}</div>
    <>
    </>
  )
}

export default CourseDetails