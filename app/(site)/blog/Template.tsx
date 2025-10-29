"use client";

import React, { useEffect, useState } from "react";
import { BlogCard, LoadingScreen } from "@/components/index.js";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";

export default function Template() {
  const { fetchedPages } = useFirebaseApiContext();

  const { isLoading } = fetchedPages;

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <main className="blog-page">
          <HeroSection />
        </main>
      )}
    </>
  );
}

const HeroSection = () => {
  const { fetchedPages } = useFirebaseApiContext();

  const blogList = fetchedPages.blogPage.sections["blog-list"];
  console.log(blogList);
  return (
    <section className="hero !p-0" id="blog-page">
        <h2 className="text-1xl mb-[2rem] !font-medium uppercase w-fit mx-auto">
          <div className="pb-2">From the blog</div>
          <div className="line w-[70%] h-[3px] bg-black mx-auto"></div>
        </h2>
        <div className="blog-list grid md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
          {blogList.length ? (
            blogList.map((blogItem: any, index: any) => {
              return <BlogCard key={index} {...{ ...blogItem, image: blogItem.images[0].url }} />;
            })
          ) : (
            <h2 className="text-3xl text-gray-300">Empty</h2>
          )}
        </div>
    </section>
  );
};
