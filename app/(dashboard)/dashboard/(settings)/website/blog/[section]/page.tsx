import React from "react";
import { BreadcrumbDemo } from "@/components/index";
import Template from "./Template";

const page = async ({ params }: { params: Promise<{ section: string }> }) => {
  const section = (await params).section;
  // if (Number(slug) > 3) notFound();

  const breadcrumbItems = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/dashboard/website",
      label: "Website",
    },
    {
      label: `blog page - ${section} Section`,
    },
  ];

  return (
    <main className="about-section-page py-5 px-10">
      <h2 className="text-2xl mb-3 capitalize">{section}</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Template section={section} />
    </main>
  );
};

export default page;
