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
    href: "/dashboard/website/home-page/header",
  },

  {
    invoice: "3",
    name: "Features",
    href: "/dashboard/website/home-page/features",
    isDisabled: true,
  },
  {
    invoice: "4",
    name: "Contact",
    href: "/dashboard/website/home-page/contact",
    isDisabled: true,
  },
  {
    invoice: "5",
    name: "Footer",
    href: "/dashboard/website/home-page/footer",
    isDisabled: true,
  },
];

const blog = [
  {
    invoice: "1",
    name: "Header",
    href: "/dashboard/website/blog/header",
    isDisabled: true,
  },
  {
    invoice: "2",
    name: "Blog",
    href: "/dashboard/website/blog/blog",
    isDisabled: false,
  },
  {
    invoice: "3",
    name: "Footer",
    href: "/dashboard/website/blog/footer",
    isDisabled: true,
  },
];

const Pages = () => {
  return (
    <main className="pages-page  p-5 mb-[150px] ">
      <h2 className="text-2xl mb-3">Website</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="relative">
        <CardHeader>
          <h2 className="text-1xl font-bold mb-3">Home Page</h2>
          <TableDemo invoices={sections} />
        </CardHeader>
      </Card>
      <br />
      <br />

      <Card className=" relative">
        <CardHeader>
          <h2 className="text-1xl font-bold mb-3">Blog Page</h2>
          <TableDemo invoices={blog} />
        </CardHeader>
      </Card>
    </main>
  );
};

export default Pages;
