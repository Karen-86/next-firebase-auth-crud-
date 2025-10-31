import React from "react";
import BlogDetails from "./BlogDetails";
import { getSingleSubPageServer } from "@/app/actions/getSingleBlog";
export const revalidate = 600; // 10min
// export const dynamic = "force-dynamic";

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const details = await getSingleSubPageServer({
    collectionName: "website-content",
    documentId: "blog-page",
    subCollectionName: "blog",
    subDocumentId: slug,
  });

  return <BlogDetails details={details} />;
}
