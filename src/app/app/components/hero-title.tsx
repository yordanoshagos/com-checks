import { LogoSecondary } from "@/components/logo-secondary";
import { api } from "@/trpc/react";

export function HeroTitle() {
  const { data } = api.me.get.useQuery();
  return (
    <div className="flex flex-col justify-center gap-4 px-8">
      <LogoSecondary />
      <div className="flex flex-col">
        <div className="text-2xl font-medium text-black">
          Welcome, {data?.firstName}. Let's get started.
        </div>

      </div>
    </div>
  );
}
