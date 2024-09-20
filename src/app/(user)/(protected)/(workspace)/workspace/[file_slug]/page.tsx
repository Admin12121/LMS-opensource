import dynamic from 'next/dynamic';
import { SpinnerLoader as Spinner} from "@/components/ui/spinner";
import { getAccessToken, getUser } from "@/actions/gettoken";
// import Document from "../_components/TiptapEditor"

const Document = dynamic(()=> import('../_components/TiptapEditor'), {
  loading: () => <span className="w-full h-full flex items-center justify-center"><Spinner/></span>,
  ssr: false,
})

// const Playground = dynamic(() => import('./playground'), {
//   loading: () => <span className="w-full h-full flex items-center justify-center"><Spinner/></span>,
//   ssr: false,
// });

async function Workspace({ params }: any) {
  const accessToken = await getAccessToken()
  const user = await getUser()
  return (
    <div className="w-full">
      {/* {accessToken && <Playground user={user} accessToken={accessToken} params={params}/>} */}
      {accessToken && <Document user={user} accessToken={accessToken} params={params}/>}
    </div>
  );
}

export default Workspace;
