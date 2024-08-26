import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getAccessToken } from "@/actions/gettoken";
// import TaskPage  from "@/components/table/tablewrapper";
import dynamic from 'next/dynamic';

const TaskPage = dynamic(() => import('@/components/table/tablewrapper'), {
  loading: () => <p>Loading...</p>,
  ssr: true,
});

export default async function CategoriesPage() {
  const accessToken = await getAccessToken()
  return (
    <ContentLayout title="Categories" classname="pt-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TaskPage accessToken={accessToken}/>
    </ContentLayout>
  );
}
