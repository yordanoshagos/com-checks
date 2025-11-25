import Link from "next/link";
import { Fragment } from "react";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function PageContainer({
  children,
  breadcrumbs,
  className,
}: {
  children: React.ReactNode;
  breadcrumbs?: { name: string; href?: string }[];
  className?: string;
}) {
  return (
    <div className="h-full max-w-7xl flex-col px-4 pt-4">
      {breadcrumbs && breadcrumbs?.length > 1 && (
        <Breadcrumb.Breadcrumb
          className="text-xl"
          separator={<Breadcrumb.BreadcrumbSeparator />}
        >
          <Breadcrumb.BreadcrumbList>
            {breadcrumbs?.map((link, index) => (
              <Fragment key={index}>
                <Breadcrumb.BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <Breadcrumb.BreadcrumbPage>
                      {link.name}
                    </Breadcrumb.BreadcrumbPage>
                  ) : (
                    <Breadcrumb.BreadcrumbLink asChild>
                      <Link href={link.href!}>
                        <Button
                          className="p-1"
                          variant={"link"}
                          effect="hoverUnderline"
                        >
                          {link.name}
                        </Button>
                      </Link>
                    </Breadcrumb.BreadcrumbLink>
                  )}
                </Breadcrumb.BreadcrumbItem>
                {index !== breadcrumbs.length - 1 && (
                  <Breadcrumb.BreadcrumbSeparator />
                )}
              </Fragment>
            ))}
          </Breadcrumb.BreadcrumbList>
        </Breadcrumb.Breadcrumb>
      )}

      <div className={className}>{children}</div>
    </div>
  );
}
