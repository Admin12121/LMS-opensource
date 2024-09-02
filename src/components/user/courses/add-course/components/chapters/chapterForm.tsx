"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateCourseMutation, useUpdateChapterMutation } from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { Input } from "@/components/ui/input";
import { IoIosAddCircleOutline } from "react-icons/io";
import ChapterList from "./chapterList";
import { useRouter } from "next/navigation";

export interface Chapter {
  id: number;
  course: string;
  title: string;
  chapterslug: string;
  description?: string;
  video: string;
  position?: number;
  isPublished: boolean;
  isFree: boolean;
  created_at: string; 
  updated_at: string; 
}

interface ChapterProps {
  slug: string;
  initialData: {
    chapters: Chapter[];
    isFree: boolean;
  };
  refetch: any;
}

const formSchema = z.object({
  title: z.string().min(1,{message: "Title is required"}),
});

const ChapterForm = ({ slug, initialData, refetch }: ChapterProps) => {
  const [isCreating, setisCreating] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [CreateChapter, { isLoading }] = useUpdateCourseMutation();
  const [UpdateChapter, { isLoading: loadingUpdate }] = useUpdateChapterMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState; 
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken();
    const res = await CreateChapter({ slug, value, accessToken, chapters: true });
    if (res?.data) {
      toast.success("Chapter created");
      refetch();
      setisCreating(false);
    } else if (res.error) {
      toast.error("fail to create chapter");
    }
  };

  const onReorder = async (updateData: {id: number, position: number}[]) => {
    try {
      setisUpdating(true);
      const accessToken = await getAccessToken();
      const value = updateData
      const res = await UpdateChapter({ slug, value, accessToken });
      if (res?.data) {
        toast.success("Chapter reordered");
        refetch();
        setisUpdating(false);
      } else if (res.error) {
        setisUpdating(false);
        toast.error("fail to reorder chapter");
      }
    } catch (error) {
      setisUpdating(false);
      toast.error("fail to reorder chapter");
    }
  }

  const onEdit = (chapterslug: string) => {
   router.push(`/courses/${slug}/chapters/${chapterslug}`);     
  }

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button
          variant="ghost"
          onClick={() => setisCreating(!isCreating)}
          className="p-2 gap-1"
        >
          {isCreating ? "Cancel" : <><IoIosAddCircleOutline size={16} /> Add a Chapter</>}
        </Button>
      </div>
      {!isCreating ? (
        <>
        <p className={`text-small mt-2 ${!initialData?.chapters.length && "text-slate-500 italic"}`}>
          {!initialData?.chapters.length && "No Chapter"}
        </p>
        <ChapterList
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData.chapters || []}
          isFree={initialData.isFree}
        />
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text" 
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the chapter'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} loading={isLoading} type="submit">Create</Button>
          </form>
        </Form>
      )}
      {!isCreating && <p className="text-sm text-muted-foreground mt-4"> Drag and drop to reorder the chapters</p>}
    </div>
  );
};

export default ChapterForm;

