import React from "react";
import BlogDetails from "./BlogDetails";
import { fetchBlog, fetchBlogs } from "@/lib/fetchers/blogs";
import { Blog } from "@/types/index";
import { notFound } from "next/navigation";

// export const revalidate = 600; // 10min
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-modules.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const { data } = await fetchBlog({ subDocumentId: slug });
  const details: Blog = data;

  return {
    title: details.seoTitle || details.title,
    description: details.seoDescription || details.shortDescription || "",
    openGraph: {
      title: details.seoTitle || details.title,
      description: details.seoDescription || details.shortDescription || "",
      type: "article",
      // images: details.images?.map((img) => `${siteUrl}/${img.url}`) || [], // commented because Open Graph doesn’t support base64 data URIs.
    },
  };
}

export async function generateStaticParams() {
  const { data } = await fetchBlogs();

  const blogList: Blog[] = data;
  return blogList.map((blog: any) => blog);
}

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const { data, status } = await fetchBlog({ subDocumentId: slug });

  const details: Blog = data;
  if (status == 404) notFound();
  return <BlogDetails details={details} />;
}
