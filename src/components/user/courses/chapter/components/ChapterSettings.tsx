"use client";
import React, { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateChapterMutation } from "@/lib/store/Service/User_Auth_Api";
import { getAccessToken } from "@/actions/gettoken";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChapterSettingFormProps {
  slug: string;
  initialData: {
    isFree: boolean;
    isPublished: boolean;
    course_isFree: boolean;
  };
  refetch: any;
  completionText: boolean;
}

const formSchema = z.object({
  isFree: z.boolean(),
  isPublished: z.boolean(),
});

const ChapterSettingForm = ({
  slug,
  initialData,
  refetch,
  completionText,
}: ChapterSettingFormProps) => {
  const [updateChapter, { isLoading }] = useUpdateChapterMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleSwitchChange = async (
    field: keyof z.infer<typeof formSchema>,
    checked: boolean
  ) => {
    const accessToken = await getAccessToken();
    const res = await updateChapter({
      slug,
      value: { [field]: checked },
      accessToken,
      normal: true,
    });

    if (res?.data) {
      toast.success("Chapter updated");
      refetch();
      form.setValue(field, checked);
    } else if (res.error) {
      toast.error("Failed to update chapter");
    }
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Access
        <div className="flex items-center space-x-2">
          <Label htmlFor="isFree">Is Free</Label>
          <Controller
            name="isFree"
            control={form.control}
            render={({ field }) => (
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      id="isFree"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleSwitchChange("isFree", checked);
                      }}
                      disabled={isLoading || initialData.course_isFree}
                    />
                  </div>
                </TooltipTrigger>
                {initialData.course_isFree && (
                  <TooltipContent side="top">
                    <p>Cannot change because the course is free</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            )}
          />
        </div>
      </div>
      <div className="font-medium flex items-center justify-between">
        Publish
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="isPublished"
            className={`${initialData.isPublished ? "" : "text-orange-600"}`}
          >
            {initialData.isPublished ? "Published" : "Draft"}
          </Label>
          <Controller
            name="isPublished"
            control={form.control}
            render={({ field }) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      id="isPublished"
                      className="dark:bg-white"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleSwitchChange("isPublished", checked);
                      }}
                      disabled={isLoading || !completionText}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left" className={`${completionText ? "hidden" : ""}`}>
                      {completionText ? "" : <p>Complete all fields</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterSettingForm;
