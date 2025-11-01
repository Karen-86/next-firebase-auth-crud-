import React from "react";
import BlogDetails from "./BlogDetails";
import { fetchBlog } from "@/lib/fetchers/blogs";
import { Blog } from "@/types/index";

export const revalidate = 600; // 10min
// export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-modules.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const details: Blog = await fetchBlog({ subDocumentId: slug });
  console.log(details.images?.map((img) => img.url));

  return {
    title: details.seoTitle || details.title,
    description: details.seoDescription || details.shortDescription || "",
    openGraph: {
      title: details.seoTitle || details.title,
      description: details.seoDescription || details.shortDescription || "",
      type: "article",
      images: details.images?.map((img) => `${siteUrl}/${img.url}`) || [],
    },
  };
}

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const details: Blog = await fetchBlog({ subDocumentId: slug });

  return <BlogDetails details={details} />;
}
