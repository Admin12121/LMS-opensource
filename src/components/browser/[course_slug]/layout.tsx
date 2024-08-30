"use client"
import React, { useEffect } from 'react'
import { useGetUserViewChapterQuery, useGetVideoUrlQuery } from "@/lib/store/Service/User_Auth_Api";
import { VideoPlayer } from "@/components/ui/video";
import { SpinnerLoader as Spinner} from '@/components/ui/spinner';

interface ChapterData {
  id: number;
  user_progress: any;
  title: string;
  chapterslug: string;
  description: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  created_at: string;
  updated_at: string;
  course: number;
  has_purchased: boolean;
}

const Chapter = ({course_slug, chapter_slug, accessToken}:{course_slug:string, chapter_slug:string, accessToken: string}) => {
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const { data, refetch, isLoading } = useGetUserViewChapterQuery({accessToken,chapter_slug});
  const { data: VideoUrl, error, isLoading: fetching, isUninitialized } = useGetVideoUrlQuery(
    { accessToken, slug: chapter_slug, },
    {
      skip: !(data && (data.isFree || data.has_purchased)),
    }
  );
  useEffect(()=>{
    if(VideoUrl){
      setVideoUrl(atob(VideoUrl?.encryptedUrl || "")); 
    }
  },[VideoUrl])
  return (
    <>{isLoading && <span className="w-full h-full flex items-center justify-center"><Spinner/></span>}
    {VideoUrl && videoUrl && <VideoPlayer src={videoUrl} />}
    </>
  )
}

export default Chapter