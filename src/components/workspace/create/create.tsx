"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useCreateCourseMutation,
  usePostFileMutation,
} from "@/lib/store/Service/User_Auth_Api";
import { getAccessToken } from "@/actions/gettoken";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  filename: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
});

export default function AddCourse() {
  const router = useRouter();
  const [CreateFile, { isLoading }] = usePostFileMutation({});
  // const frameworks: Category[] = data || [];
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        filename: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const accessToken = await getAccessToken();
    const res = await CreateFile({ accessToken, data });
    if (res.data) {
      toast.success("File Created");
      router.push(`/workspace/${res.data.fileslug}`);
    } else if (res.error) {
      toast.error("Failed to create File");
    }
  };

  return (
    <span className="w-full h-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-2 sm:p-0 sm:w-2/3 space-y-6"
        >
          <span>
            <CardTitle>Create New File</CardTitle>
            <CardDescription>
              What would you like to name your file? Don&apos;t worry, you can
              always change this later.
            </CardDescription>
          </span>
          <FormField
            control={form.control}
            name="filename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 'Advanced Web Development"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="flex gap-2">
            <Button disabled={isLoading} type="button" variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading || !form.watch("filename")}
              loading={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </span>
        </form>
      </Form>
    </span>
  );
}
