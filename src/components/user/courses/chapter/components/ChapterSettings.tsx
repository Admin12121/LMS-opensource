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
import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";

interface ChapterSettingFormProps {
  slug: string;
  initialData: {
    isFree: boolean;
    isPublished: boolean;
  };
  refetch: any;
}

const formSchema = z.object({
  isFree: z.boolean(),
  isPublished: z.boolean(),
});

const ChapterSettingForm = ({
  slug,
  initialData,
  refetch,
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
              <Switch
                id="isFree"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleSwitchChange("isFree", checked);
                }}
                disabled={isLoading}
              />
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
              <Switch
                id="isPublished"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleSwitchChange("isPublished", checked);
                }}
                disabled={isLoading}
              />
            )}
          />
        </div>
      </div>
      <div className="font-medium flex items-center justify-between">
        Delete
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            disabled={isLoading}
            icon={<MdDeleteOutline size={20} />}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterSettingForm;
