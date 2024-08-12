"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Cardwrapper from "../cardwrapper";
import { SpinnerLoader } from "@/components/ui/spinner";
import { usePathname } from 'next/navigation';
import { IoAlertOutline } from "react-icons/io5";
import { GoShieldCheck } from "react-icons/go";
// import Loader from './loader'
const Loader = dynamic(() => import('./loader'), {
  ssr: false,
  loading: () => <span className='w-full h-[150px] flex items-center justify-center'><SpinnerLoader/></span>, 
});

const Activate = () => {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const uid = pathParts[2]; 
  const token = pathParts[3];

  const [status, setStatus] = useState<string>('Fetching token...');
  const [icon, setIcon] = useState<React.ReactNode | null>(null)
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setStatus('Decrypting token...');
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/activate/${uid}/${token}/`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response)

        if (!response.ok) {
          if (response.status === 400) {
            setIcon(<IoAlertOutline/>)
            setStatus('Invalid token.');
          } else if (response.status === 410) {
            setIcon(<IoAlertOutline/>)
            setStatus('Token expired.');
          } else {
            setIcon(<IoAlertOutline/>)
            setStatus('An error occurred.');
          }
        } else {
          setStatus('Confirming token...');
          const data = await response.json();

          if (data.success) {
            setIcon(<GoShieldCheck/>)
            setStatus('Token confirmed. Account activated!');
          } else {
            setIcon(<IoAlertOutline/>)
            setStatus('Invalid token.');
          }
        }
      } catch (error) {
        setIcon(<IoAlertOutline/>)
        setStatus('An error occurred.');
      }
    };

    verifyToken();
  }, [uid, token]);

  return (
    <Cardwrapper
      headerLabel="Comfirming your verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
      showSocial={false}
      classNames={{
        content:"flex items-center justify-center relative"
      }}
    >
      <Loader />
      <div className="text-center text-sm text-muted-foreground absolute bottom-10 animate-pulse flex items-center justify-center gap-x-2">{icon}{status}</div>
    </Cardwrapper>
  )
}

export default Activate