import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { AdminPanel1 } from "@/components/admin-panel/admin-panel1";
import { cookies } from "next/headers"
export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  // return <AdminPanelLayout>{children}</AdminPanelLayout>;
  return (
    <AdminPanel1
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    >
      {children}
    </AdminPanel1>
  );
}
