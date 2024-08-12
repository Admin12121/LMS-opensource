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
  classNames?: {
    card?: string;
    header?: string;
    content?: string;
    footer?: string;
    backButton?: string;
    social?: string;
  };  
}

const Cardwrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  classNames = {}, // Provide default empty object
}: CardwrapperProps) => {
  return (
    <Card className={`w-[400px] shadow-md ${classNames.card || ""}`}>
      <Header label={headerLabel} className={classNames.header || ""} />
      <CardContent className={classNames.content || ""}>{children}</CardContent>
      {showSocial && (
        <CardFooter className={classNames.social || ""}>
          <Social />
        </CardFooter>
      )}
      <CardFooter className={`flex justify-center ${classNames.footer || ""}`}>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
          className={classNames.backButton || ""}
        />
      </CardFooter>
    </Card>
  );
};

export default Cardwrapper;
