import {CoursePanal} from "@/components/course-panal/course_panal"
import { cookies } from "next/headers"
import { getAccessToken } from "@/actions/gettoken";

export default async function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  const accessToken = await getAccessToken()
  return (
    <CoursePanal
      accessToken={accessToken}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    >
      {children}
    </CoursePanal>
  );
}
