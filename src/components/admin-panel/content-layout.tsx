// import { Navbar } from "@/components/admin-panel/navbar";
import { Menu } from "@/components/menu/menu";
interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  classname?: string;
}

export function ContentLayout({
  title,
  children,
  classname,
}: ContentLayoutProps) {
  return (
    <div className={classname ? classname : ""}>
      {/* <Navbar title={title} /> */}
      <Menu />
      <div className="h-[calc(100vh_-_40px)] m-0 p-0 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}
