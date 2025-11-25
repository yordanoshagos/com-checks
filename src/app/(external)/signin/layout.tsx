import { GradientContainer } from "@/components/complere/gradient";
import { Logo } from "@/components/complere/logo";
import { ArrowRightIcon } from "lucide-react";
import { headers as getHeaders } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await getHeaders(),
  });

  if (session?.user.name) {
    return redirect("/app");
  }
  if (session) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full max-w-md flex-col items-center justify-center px-4 lg:max-w-2xl">
        <Link href="/" className="mb-6 cursor-pointer hover:opacity-80">
          <Logo />
        </Link>
        <div className="mb-6 w-full">{children}</div>
        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/legal/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="hidden flex-1 lg:block">
        <GradientContainer className="flex h-full w-full flex-col justify-center overflow-hidden p-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Expand your foundation's impact with AI.
            </h1>
            <div className="mt-6 text-xl">
              Complēre helps program staff use AI workflows
              <br />
              for better grantmaking, evaluation, and strategic planning.
            </div>
            <div className="mt-8 flex flex-col gap-4 rounded-xl bg-white/20 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="h-5 w-5" />
                <div className="font-medium">Get Started</div>
              </div>
              <div>
                We're currently in private beta. Enter your email to secure your
                spot and be notified when access becomes available.
              </div>
            </div>
          </div>
        </GradientContainer>
      </div>
    </div>
  );
}