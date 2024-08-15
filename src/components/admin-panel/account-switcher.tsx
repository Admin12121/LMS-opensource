import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  return (
    <div
      className={cn(
        "flex items-center px-1 gap-0 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        isCollapsed &&
          "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
      )}
    >
      <Avatar className="w-9 h-9 max-w-9 max-h-9">
        <AvatarImage src="/logo.svg" />
        <AvatarFallback className="bg-transparent">OM</AvatarFallback>
      </Avatar>
      <span className={cn("ml-2 w-full", isCollapsed && "!hidden")}>
        <h1 className="text-[24px] text-foreground font-bold ">LMS</h1>
      </span>
    </div>
  );
}
