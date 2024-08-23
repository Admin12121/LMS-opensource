"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {useUpdateChapterMutation} from '@/lib/store/Service/User_Auth_Api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";

interface ChapterTitleFormProps {
  slug: string;
  initialData:{
    title: string;
  }
  refetch: any ;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const ChapterTitleForm = ({ slug, initialData, refetch }: ChapterTitleFormProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updateTitle, {isLoading}]  = useUpdateChapterMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken()
    const res = await updateTitle({slug, value, accessToken, normal: true})
    if(res?.data){
        toast.success('title updated');
        refetch()
        setisEditing(false)
      }else if (res.error){
        toast.error('Failed to update title');
      }      
  };
  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Chapter title
        <Button
          variant="ghost"
          onClick={() => setisEditing(!isEditing)}
          className="p-2 gap-1"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <LuPencilLine size={16} /> Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          <p className="text-small mt-1">{initialData?.title}</p>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField control={form.control} name="title" render={({field}) => (
                <FormItem>
                    <FormControl>
                        <Input 
                          disabled={isSubmitting}
                          placeholder="e.g. 'Advanced Data'"
                          {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}/>
            <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} loading={isLoading} type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterTitleForm;
