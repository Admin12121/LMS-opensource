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
  FormLabel,
} from "@/components/ui/form";
import {
  useUpdateCourseMutation,
  useGetCategoryQuery,
} from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Category {
  id: number; // ID of the category
  name: string; // Name of the category
  categoryslug: string;
  created_at: string;
  updated_at: string;
}

interface TitleFormProps {
  slug: string;
  initialData: {
    category: any;
  };
  refetch: any;
  accessToken: string | null;
}

const formSchema = z.object({
  category: z.number().min(1, {
    message: "Category is required",
  }),
});

const CourseCategory = ({
  slug,
  initialData,
  refetch,
  accessToken,
}: TitleFormProps) => {
  const [isEditing, setisEditing] = useState(false);
  const [updateTitle, { isLoading }] = useUpdateCourseMutation({});
  const { data } = useGetCategoryQuery({ accessToken });
  const frameworks: Category[] = data || [];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const accessToken = await getAccessToken();
    const res = await updateTitle({ slug, value, accessToken });
    if (res?.data) {
      toast.success("Title updated");
      refetch();
      setisEditing(false);
    } else if (res.error) {
      toast.error("Failed to update title");
    }
  };

  return (
    <div className="mt-6 dark:bg-neutral-900 rounded-md p-2 px-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button
          variant="ghost"
          onClick={() => setisEditing(!isEditing)}
          className="p-2 gap-1"
        >
          {isEditing ? "Cancel" : <><LuPencilLine size={16} /> Edit title</>}
        </Button>
      </div>
      {!isEditing ? (
        <p className={`text-small mt-1 ${initialData?.category ? "" : "text-slate-500 italic"}`}>
          {initialData.category?.name || "No Category"}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Category</FormLabel> */}
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="secondary"
                          role="combobox"
                          aria-expanded={true}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? frameworks.find(framework => framework.id === field.value)?.name
                            : "Select Category..."}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search Category..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.id}
                                  value={String(framework.id)} // Convert ID to string for the value
                                  onSelect={(currentValue) => {
                                    field.onChange(Number(currentValue)); // Convert back to number for form state
                                  }}
                                >
                                  {framework.name} {/* Display the name */}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value === framework.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} loading={isLoading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CourseCategory;