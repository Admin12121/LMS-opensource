"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateCourseMutation } from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriceProps {
  slug: string;
  initialData: {
    price: number;
    isFree: boolean;
  };
  refetch: any;
}

const formSchema = z.object({
  price: z.coerce.number(),
  isFree: z.boolean(),
});

const PriceForm = ({ slug, initialData, refetch }: PriceProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updatePrice, { isLoading }] = useUpdateCourseMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0,
      isFree: initialData.isFree,
    },
  });

  const handleSwitchChange = async (
    field: keyof z.infer<typeof formSchema>,
    checked: boolean
  ) => {
    setisEditing(false)
    const accessToken = await getAccessToken();
    const res = await updatePrice({
      slug,
      value: { [field]: checked },
      accessToken,
    });

    if (res?.data) {
      toast.success("Chapter updated");
      refetch();
      form.setValue(field, checked);
    } else if (res.error) {
      toast.error("Failed to update chapter");
    }
  };

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken();
    const res = await updatePrice({ slug, value, accessToken });
    if (res?.data) {
      toast.success("price updated");
      refetch();
      setisEditing(false);
    } else if (res.error) {
      toast.error("fail to update price");
    }
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Controller
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        id="isFree"
                        className="dark:bg-white"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleSwitchChange("isFree", checked);
                        }}
                        disabled={isLoading}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {initialData.isFree ? "Course is Free to all" : "Make the Course Free to all"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          </div>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={initialData.isFree}
                  onClick={() => setisEditing(!isEditing)}
                  className="p-2 gap-1"
                >
                  {isEditing ? (
                    "Cancel"
                  ) : (
                    <>
                      <LuPencilLine size={16} /> Edit Price
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              {initialData.isFree && (
                <TooltipContent side="top">
                <p>Cannot change because the course is free</p>
              </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    disabled={initialData.isFree}
                    onClick={() => setisEditing(!isEditing)}
                    className="p-2 gap-1"
                  >
                    {isEditing ? (
                      "Cancel"
                    ) : (
                      <>
                        <LuPencilLine size={16} /> Edit Price
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {initialData.isFree && (
                <TooltipContent side="top">
                  <p>Cannot change because the course is free</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
        </div>
      </div>
      {!isEditing ? (
        <p
          className={`text-small mt-1 ${
            !initialData.price && "text-slate-500 italic"
          } ${initialData.isFree ? "text-neutral-500": ""}`}
        >
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                loading={isLoading}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
