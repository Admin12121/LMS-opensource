"use client";
import React, { useState } from "react";
import ReactQuill from 'react-quill'; // Add this import
import 'react-quill/dist/quill.snow.css';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Add Controller import
import { LuPencilLine } from "react-icons/lu";
import { toast } from "sonner"
import "./quill.css"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateCourseMutation } from '@/lib/store/Service/User_Auth_Api';
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";

interface TitleFormProps {
  slug: string;
  initialData: {
    description: string;
  }
  refetch: any;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Title is required",
  }),
});

const DescriptionForm = ({ slug, initialData, refetch }: TitleFormProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updateTitle, { isLoading }] = useUpdateCourseMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken();
    const res = await updateTitle({ slug, value, accessToken });
    if (res?.data) {
      toast.success('description updated');
      refetch();
      setisEditing(false);
    } else if (res.error) {
      toast.error('fail to update description');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
      ['code-block'],
    ],
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button
          variant="ghost"
          onClick={() => setisEditing(!isEditing)}
          className="p-2 gap-1"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <LuPencilLine size={16} /> Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {/* <p className={`text-small mt-1 ${!initialData.description && "text-slate-500 italic"}`}>{initialData.description || "No description"}</p> */}
          <div
            className={`text-small mt-1 ${!initialData.description && "text-slate-500 italic"}`}
            dangerouslySetInnerHTML={{ __html: initialData.description || "No description" }}
          />
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Controller
                    name="description" // Use Controller to manage the form state
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        value={field.value} // Use field.value for the current value
                        onChange={(value) => {
                          field.onChange(value); // Update form state
                        }}
                        placeholder="e.g. 'This Course is about .'"
                        modules={modules}
                        style={{ border: 'none' }}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default DescriptionForm;