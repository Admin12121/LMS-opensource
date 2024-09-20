"use client";
import { SpinnerLoader as Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useGetUserViewCourseListQuery } from "@/lib/store/Service/User_Auth_Api";
import Courselist from "./courselist";
import { GroupListSlider } from "@/components/global/group-list-slider";
import { toast } from "sonner";

const Browser = ({ accessToken }: { accessToken: string }) => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [usecategory, setCategory] = useState<string>("");
  const { data, isLoading, refetch, error } = useGetUserViewCourseListQuery({
    search,
    page,
    accessToken,
  });
  const [messages, setMessages] = useState<string[]>([]);       
  
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${accessToken}`
    );
    socket.onopen = () => {
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const notification = JSON.parse(data.message);
      toast.success(notification.title);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };
    socket.onclose = () => {
    };
    socket.onerror = (error) => {
    };
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
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
