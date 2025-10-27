"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header, Footer, ButtonDemo } from "@/components/index";
import localData from "@/localData";
import { ChevronLeft } from "lucide-react";

const { notFoundImage } = localData.images;

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="">
      {/* <Header className="static" /> */}
      <main className="">
        <section className="min-h-[100vh] flex items-center">
          <div className="container text-center">
            <h1 className="text-6xl mb-[2rem] uppercase">404</h1>
            <br />
            <img src={notFoundImage} className="w-full max-w-[450px] mx-auto mb-[3rem]" />
            <ButtonDemo
              startIcon={<ChevronLeft className="-ml-3" />}
              text="Back"
              className="min-w-[100px]"
              onClick={() => router.back()}
            />
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
