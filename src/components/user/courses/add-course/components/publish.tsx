import React, { useState } from "react";
import { useUpdateCourseMutation, useDeleteCourseMutation } from "@/lib/store/Service/User_Auth_Api";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/actions/gettoken";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog";
import { MdDeleteOutline } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
interface PublishProps {
  slug: string;
  initialData: {
    isPublished: boolean;
  };
  refetch: any;
  allFieldsCompleted: boolean;
  className?: string;
}

export function Publish({
  slug,
  initialData,
  refetch,
  allFieldsCompleted,
  className,
}: PublishProps) {
  const router = useRouter();
  const [Update, { isLoading }] = useUpdateCourseMutation();
  const [Delete, { isLoading: isLoadingDelete, isSuccess }] = useDeleteCourseMutation();

  const onSubmit = async () => {
    const accessToken = await getAccessToken();
    const newStatus = !initialData.isPublished;
    const res = await Update({
      slug,
      value: { isPublished: newStatus },
      accessToken,
    });
    if (res?.data) {
      if(res.data.isPublished){
        toast.success("Course Published");
        handleClick()
      } else {
        toast.success("Course Unpublished");
      }
      refetch();
    } else if (res.error) {
      toast.error("fail to Publish course");
    }
  };

  const onDelete = async () => {
    const accessToken = await getAccessToken();
    const res = await Delete({slug, accessToken});
    if (!res.error) {
      toast.success("Course deleted successfully");
      router.push("/");
    } else {
      toast.error("Failed to delete course");
    }
  }

  const handleClick = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };


  return (
    <span className="flex items-center gap-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              loading={isLoading}
              onClick={onSubmit}
              disabled={!allFieldsCompleted}
            >
              {initialData.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className={`${allFieldsCompleted ? "hidden" : ""}`}
          >
            {allFieldsCompleted ? "" : <p>Complete all fields</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn("w-[35px] p-0", className)}
                  variant="default"
                  disabled={isLoadingDelete}
                  icon={<MdDeleteOutline size={20} />}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Chapter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="z-[99]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              {!isSuccess ? "This action cannot be undone." : "Redirecting to course page..."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoadingDelete}>
                Close
              </Button>
            </DialogClose>
              <Button type="button" disabled={isLoadingDelete} loading={isLoadingDelete} variant="default" onClick={onDelete}>
                Continue
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </span>
  );
}