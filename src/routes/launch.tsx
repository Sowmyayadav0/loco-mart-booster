import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WelcomeSplashPage } from "@/components/auth/WelcomeSplashPage";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "Welcome to LocoMart — Hyperlocal Super App" },
      { name: "description", content: "Everything nearby. Food, groceries, shopping, rides and parcel courier in one app." },
      { property: "og:title", content: "Welcome to LocoMart — Hyperlocal Super App" },
      { property: "og:description", content: "Everything nearby. Food, groceries, shopping, rides and parcel courier in one app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LaunchPage,
});

function LaunchPage() {
  const navigate = useNavigate();

  return (
    <WelcomeSplashPage
      onProceed={() => void navigate({ to: "/auth" })}
      onSignInDirect={() => void navigate({ to: "/auth" })}
    />
  );
}
