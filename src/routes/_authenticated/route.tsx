import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { navaStore } from "@/lib/navaStore";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check local / Firebase session first
    const session = navaStore.getSession();
    if (session?.user && session?.token) {
      return { user: session.user };
    }

    // Check Supabase session as secondary
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return { user: data.user };
      }
    } catch {
      // Ignore Supabase check errors
    }

    // Redirect to login if unauthenticated
    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
