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
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
import { getAccessToken } from "@/actions/gettoken";
import dynamic from 'next/dynamic';

const Workspace = dynamic(() => import('@/components/workspace/tabledata'), {
  loading: () => <span className="w-full h-full flex items-center justify-center"><Spinner/></span>,
  ssr: true,
});

export default async function WorkspacePage() {
  const accessToken = await getAccessToken()
  return (
    <ContentLayout title="Workspace">
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
            <BreadcrumbPage>Workspace</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {accessToken && <Workspace accessToken={accessToken}/>}
    </ContentLayout>
  );
}
