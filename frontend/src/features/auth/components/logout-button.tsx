import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { userQueryOptions } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const onClick = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.invalidateQueries(userQueryOptions());
          navigate({ to: "/login" });
        },
      },
    });
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
