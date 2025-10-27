"use client";

import React from "react";
import { BreadcrumbDemo, TableDemo } from "@/components/index";
import { Card, CardHeader } from "@/components/ui/card";

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "Website",
  },
];

const sections = [
  {
    invoice: "1",
    name: "Header",
    href: "/dashboard/website/header",
  },

  {
    invoice: "3",
    name: "Features",
    href: "/dashboard/website/features",
    isDisabled: true,
  },
  {
    invoice: "4",
    name: "Contact",
    href: "/dashboard/website/contact",
    isDisabled: true,
  },
  {
    invoice: "5",
    name: "Footer",
    href: "/dashboard/website/footer",
    isDisabled: true,
  },
];

const Pages = () => {
  return (
    <main className="pages-page  p-5">
      <h2 className="text-2xl mb-3">Website</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="mb-[150px] relative">
        <CardHeader>
          <h2 className="text-1xl font-bold mb-3">Home Page</h2>
          <TableDemo invoices={sections} />
        </CardHeader>
      </Card>
    </main>
  );
};

export default Pages;
