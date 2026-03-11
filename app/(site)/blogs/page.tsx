import React from "react";
import Template from "./Template";
import * as blogFetchers from "@/lib/fetchers/blogs"

export const revalidate = 60; // 1min
// export const dynamic = "force-dynamic";

export default async function Blogs() {
  const { data } = await blogFetchers.fetchBlogs();

  return <Template blogData={data} />;
}

