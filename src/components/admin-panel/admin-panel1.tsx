"use client";

import * as React from "react";
import {
  List ,
  UserRound ,
  Compass ,
  House ,
  Search,
  ChartSpline ,
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
import { AccountSwitcher } from "@/components/admin-panel/account-switcher";
import { Nav } from "@/components/admin-panel/nav";
import { Kbd } from "@nextui-org/kbd";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/admin-panel/user";

interface PanalProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function AdminPanel1({
  defaultLayout = [20, 80],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: PanalProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [maxSize, setMaxSize] = useState(20);
  const pathname = usePathname();

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
      console.log('Width:', width, 'MaxSize:', maxSizeValue); // Debugging line
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
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={maxSize}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn('p-2 max-md:hidden',
            isCollapsed &&
              "min-w-[68px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="rounded-lg dark:bg-neutral-900 h-full relative w-full">
            <div
              className={cn(
                "flex h-[52px] items-center justify-center",
                isCollapsed ? "h-[52px]" : "px-2"
              )}
            >
              <AccountSwitcher isCollapsed={isCollapsed}  />
            </div>
            { <div className=" p-2">
              <form>
                <div className="relative dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white rounded-lg">
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
            </div>}
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Dashboard",
                  label: "128",
                  href: "/dashboard",
                  icon: House,
                  variant: pathname.startsWith("/dashboard") ? "default" : "ghost",
                },
                {
                  title: "Browser",
                  label: "9",
                  href: "/browser",
                  icon: Compass,
                  variant: pathname === "/browser" ? "default" : "ghost",
                },
                {
                  title: "Courses",
                  label: "",
                  icon: List,
                  href: "/courses",
                  variant: pathname === "/courses" ? "default" : "ghost",
                },
                {
                  title: "Users",
                  label: "",
                  icon: UserRound,
                  href: "/users",
                  variant: pathname === "/users" ? "default" : "ghost",
                },
                {
                  title: "Analytics",
                  label: "",
                  icon: ChartSpline,
                  href: "/analytics",
                  variant: pathname === "/analytics" ? "default" : "ghost",
                },
                {
                  title: "Trash",
                  label: "",
                  icon: Trash2,
                  href: "/trash",
                  variant: pathname === "/trash" ? "default" : "ghost",
                },
              ]}
            />
            <div
              className={cn(
                "flex h-[52px] items-center justify-center bottom-1 absolute w-full",
                isCollapsed ? "h-[52px]" : "px-2"
              )}
            >
              <UserNav isCollapsed={isCollapsed}/>
            </div>            
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-transparent w-2 max-md:hidden" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="p-2">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
