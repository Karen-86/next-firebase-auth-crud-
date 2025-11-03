import React from "react";
import Template from "./Template";
import { fetchBlogs } from "@/lib/fetchers/blogs";
import { Blog } from "@/types/index";

// export const revalidate = 600; // 10min
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await fetchBlogs();
  
  const blogList:Blog[] = data

  return <Template blogList={blogList} />;
}
