import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { BackButton } from "./back-button";
import { Header } from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  backButtonHref,
  backButtonLabel,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <Card className="w-full bg-transparent shadow-none rounded-none border-0 items-start">
      <CardHeader className="w-full px-0">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="w-full px-0">{children}</CardContent>
      <CardFooter className="px-0">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
