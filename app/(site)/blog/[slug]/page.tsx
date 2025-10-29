import React from "react";
import BlogDetails from "./BlogDetails";

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  

  return <BlogDetails slug={slug} />
}
