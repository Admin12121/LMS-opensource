import dynamic from 'next/dynamic';
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
import { getAccessToken } from "@/actions/gettoken";


const Playground = dynamic(() => import('./playground'), {
  loading: () => <span className="w-full h-full flex items-center justify-center"><Spinner/></span>,
  ssr: false,
});

async function Workspace({ params }: any) {
  const accessToken = await getAccessToken()

  return (
    <div className="w-full">
      {accessToken && <Playground accessToken={accessToken} params={params.file_slug}/>}
    </div>
  );
}

export default Workspace;
