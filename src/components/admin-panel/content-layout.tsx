import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  classname?: string;
}

export function ContentLayout({ title, children, classname }: ContentLayoutProps) {
  return (
    <div className={classname ? classname : ""}>
      <Navbar title={title} />
      <div className="h-[calc(100vh_-_56px)] m-0 container p-0 flex flex-col gap-10">{children}</div>
    </div>
  );
}
