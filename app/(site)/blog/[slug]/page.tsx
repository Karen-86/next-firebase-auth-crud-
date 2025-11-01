import React from "react";
import BlogDetails from "./BlogDetails";
import { fetchBlog } from "@/lib/fetchers/blogs";
import { Blog } from "@/types/index";

export const revalidate = 600; // 10min
// export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const details: Blog = await fetchBlog({ subDocumentId: slug });

  return {
    title: details.seoTitle || details.title,
    description: details.seoDescription || details.shortDescription || "",
    openGraph: {
      title: details.seoTitle || details.title,
      description: details.seoDescription || details.shortDescription || "",
      type: "article",
      images: details.images?.map((img) => img.url) || [],
    },
  };
}

export default async function page({ params }: { params: { slug: string } }) {
  const slug = params.slug; 

  const details: Blog = await fetchBlog({subDocumentId: slug})

  return <BlogDetails details={details} />;
}
