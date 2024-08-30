"use client";

import * as React from "react";
import {
  CirclePlay as Play,
  Shield ,
  Search,
  BadgeCheck ,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChapterLinks } from "@/components/course-panal/chapterLinks";
import { Kbd } from "@nextui-org/kbd";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/admin-panel/user";
import { useGetUserViewCourseListQuery } from "@/lib/store/Service/User_Auth_Api";
import { useRouter } from "next/navigation";

interface Chapter {
    id: number;
    title: string;
    chapterslug: string;
    description: string;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    created_at: string;
    updated_at: string;
    course: number;
  }
  
interface PanalProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
  accessToken?: string | null;
}

export function CoursePanal({
  defaultLayout = [20, 80],
  defaultCollapsed = false,
  navCollapsedSize,
  accessToken,
  children,
}: PanalProps) {
  const [maxSize, setMaxSize] = useState(20);
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split('/')[1];
  const { data, refetch } = useGetUserViewCourseListQuery({accessToken,slug});

  useEffect(() => {
    if (data?.chapters && pathname === `/${slug}`) {
      const firstChapterSlug = data.chapters[0].chapterslug; 
      router.push(`/${slug}/${firstChapterSlug}`); 
    }
  }, [data, pathname, slug, router]);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let maxSizeValue;
      if (width <= 1200 && width >= 768) {
        maxSizeValue = 35 - ((width - 768) / (1200 - 768)) * 10;
      } else if (width < 768) {
        maxSizeValue = 20;
      } else {
        maxSizeValue = 20;
      }
      setMaxSize(maxSizeValue);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch max-w-[2400px]"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={maxSize}
          onCollapse={() => {
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onResize={() => {
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn('p-2 max-md:hidden min-w-[230px] transition-all duration-300 ease-in-out'
          )}
        >
          <div className="rounded-lg dark:bg-neutral-900 h-full relative w-full">
            <div className=" p-2">
              <form>
                <div className={`relative dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white rounded-lg w-full`}>
                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      className="pl-8 border-0 focus:outline-none focus-visible:ring-0"
                    />
                  <Kbd
                    keys={["command"]}
                    className="rounded-md absolute right-2 top-[6px] shadow-lg"
                  ></Kbd>
                </div>
              </form>
            </div>
            {data?.chapters && <ChapterLinks
                links={data?.chapters.map((chapter:Chapter) => ({
                title: `${chapter.title.slice(0, 25)}...`,
                label: chapter.id.toString(), 
                href: `/${slug}/${chapter.chapterslug}`, 
                icon: data?.has_purchased ? Play : chapter.isFree ? Play : Shield,
                variant: pathname.split('/').pop() === chapter.chapterslug ? "default" : "ghost",
                }))}
            />}
            <div
              className={cn(
                "flex h-[52px] items-center justify-center bottom-1 absolute w-full px-2"
              )}
            >
              <UserNav />
            </div>            
          </div>
        </ResizablePanel> 
        <ResizableHandle withHandle className="bg-transparent w-2 max-md:hidden" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="p-2 overflow-hidden overflow-y-auto h-[100vh]">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
