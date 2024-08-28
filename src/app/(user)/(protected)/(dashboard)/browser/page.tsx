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

const Browser = dynamic(() => import('@/components/browser/browser'), {
  loading: () => <span className="w-full h-full flex items-center justify-center"><Spinner/></span>,
  ssr: true,
});

export default async function BrowserPage() {
  const accessToken = await getAccessToken()
  return (
    <ContentLayout title="All Posts">
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
            <BreadcrumbPage>Browser</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {accessToken && <Browser accessToken={accessToken}/>}
    </ContentLayout>
  );
}
