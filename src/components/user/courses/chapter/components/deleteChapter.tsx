import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { cn } from "@/lib/utils";
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
import { toast } from "sonner"
import { useDeleteChapterMutation } from "@/lib/store/Service/User_Auth_Api";
import { getAccessToken } from "@/actions/gettoken";
import { useRouter } from "next/navigation";

export function DeleteChapter({ className, params, course_slug }: { className?: string, params: string, course_slug: string | null }) {
  const router = useRouter()
  const [deleteChapter, { isLoading: isLoadingDelete ,isSuccess}] =
    useDeleteChapterMutation();
    const onSubmit = async () => {
      const res = await deleteChapter({slug: params, accessToken: await getAccessToken()})
      if(res.error){
        toast.error("Failed to delete chapter")
      } else {
        toast.success("Chapter deleted successfully")
        router.push(`/courses/add-course/${course_slug}`)
      }
    }
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn("w-[35px] p-0", className)}
                  variant="secondary"
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
              <Button type="button" disabled={isLoadingDelete} loading={isLoadingDelete} variant="default" onClick={onSubmit}>
                Continue
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
