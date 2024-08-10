"use client";

import { Card, CardContent, CardFooter } from "../ui/card";
import { BackButton } from "./backbutton";
import { Header } from "./header";
import Social from "./social";
interface CardwrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const Cardwrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardwrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <Header label={headerLabel} />
      <CardContent>{children}</CardContent>
      {showSocial && <CardFooter><Social/></CardFooter>}
      <CardFooter className="flex justify-center">
        <BackButton
         label={backButtonLabel}
         href={backButtonHref}
         />
      </CardFooter>
    </Card>
  );
};

export default Cardwrapper;
