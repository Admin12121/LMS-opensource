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
import { toast } from "sonner"
import {useCreateCourseMutation} from "@/lib/store/Service/User_Auth_Api"
import { getAccessToken } from "@/actions/gettoken";
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

export default function AddCourse() {
  const router = useRouter();
  const [CreateCourse, { isLoading }] = useCreateCourseMutation({})
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const accessToken = await getAccessToken()
    const res = await CreateCourse({data, accessToken});
    if(res.data){
      toast.success('Course Created successfully!');
      router.push(`/courses/add-course/${res.data.courseslug}`);
    }else if (res.error){
      toast.error('Failed to create Course');
    }    
  }

  return (
    <span className="w-full h-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-2 sm:p-0 sm:w-2/3 space-y-6"
        >
          <span>
            <CardTitle>Name your course</CardTitle>
            <CardDescription>
                What would you like to name your course? Don&apos;t worry, you can
                always change this later.
            </CardDescription>
          </span>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 'Advanced Web Development"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What will you teach in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="flex gap-2">
            <Button disabled={isLoading} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isLoading || !form.watch("title")} loading={isLoading} type="submit">Submit</Button>
          </span>
        </form>
      </Form>
    </span>
  );
}
