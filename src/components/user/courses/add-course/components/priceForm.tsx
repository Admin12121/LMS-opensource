"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

interface PriceProps {
  slug: string;
  initialData: {
    price: number;
  };
  refetch: any;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ slug, initialData, refetch }: PriceProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updateTitle, { isLoading }] = useUpdateCourseMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0,
    },
  });
  const { isSubmitting, isValid } = form.formState; 
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken();
    const res = await updateTitle({ slug, value, accessToken });
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
        <Button
          variant="ghost"
          onClick={() => setisEditing(!isEditing)}
          className="p-2 gap-1"
        >
          {isEditing ? "Cancel" : <><LuPencilLine size={16} /> Edit Price</>}
        </Button>
      </div>
      {!isEditing ? (
        <p className={`text-small mt-1 ${!initialData.price && "text-slate-500 italic"}`}>
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
              <Button disabled={!isValid || isSubmitting} loading={isLoading} type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;