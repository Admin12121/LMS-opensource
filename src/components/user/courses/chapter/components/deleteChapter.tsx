import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DeleteChapter({ isLoading , className}: { isLoading?: boolean , className?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("w-[35px] p-0", className)}
            variant="secondary"
            disabled={isLoading}
            icon={<MdDeleteOutline size={20} />}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Chapter</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
