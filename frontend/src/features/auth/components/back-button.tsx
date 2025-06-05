import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
};
