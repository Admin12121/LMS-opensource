"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href?: string;
    variant: "default" | "ghost";
    prefetch?: boolean;
  }[];
}

export function ChapterLinks({ links }: NavProps) {
  return (
    <div
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href || "#"}
            prefetch={link.prefetch ? link.prefetch : false}
            className={cn(
              buttonVariants({ variant: link.variant, size: "sm" }),
              link.variant === "default" &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-between",
              "justify-between"
            )}
          >
            {link.title}
            <link.icon className="mr-2 h-4 w-4" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
