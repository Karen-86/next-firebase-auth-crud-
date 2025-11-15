import { fetchBlogs } from "@/lib/fetchers/blogs";
import { Blog } from "@/types/index";
import { MetadataRoute } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await fetchBlogs();
  const blogList: Blog[] = data;
  const blogEntries: MetadataRoute.Sitemap = blogList.map((blog: any) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
  }));

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
    ...blogEntries,
  ];
}
