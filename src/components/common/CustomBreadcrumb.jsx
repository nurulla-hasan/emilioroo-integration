"use client";

import * as React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const CustomBreadcrumb = ({ links }) => { 
  return (
    <Breadcrumb className="hidden md:block mb-4">
      <BreadcrumbList>
        {links.map((link, index) => (
          <React.Fragment key={link.name}>
            <BreadcrumbItem>
              {link.href && !link.isCurrent ? ( 
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.name}</Link>
                </BreadcrumbLink>
              ) : ( 
                <BreadcrumbPage>{link.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < links.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;