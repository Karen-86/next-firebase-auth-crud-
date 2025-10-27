"use client";

import React, { useState } from "react";
import { Header, Footer, LoadingScreen } from "@/components/index.js";
import { motion } from "framer-motion";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";

export default function Template() {
  const { fetchedPages } = useFirebaseApiContext();

  const {
    homePage: { isLoading },
  } = fetchedPages;
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <main className="home-page">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
        </main>
      )}
    </>
  );
}

const HeroSection = () => {
  const [inView, setIsInView] = useState(false);
  const { fetchedPages } = useFirebaseApiContext();

  const { title, description, images } = fetchedPages.homePage.sections.header;

  return (
    <section className="!pt-[80px] showcase text-center sm:text-left  lg:min-h-[calc(100vh-80px)] flex items-center" id="home">
      <motion.div
        onViewportEnter={() => setIsInView(true)}
        viewport={{ amount: 0.7 }}
        className="container flex justify-between items-center flex-col sm:flex-row gap-x-[50px] gap-y-[30px] flex-center"
      >
        <div className={`max-w-[490px] ${inView ? "lazy-animate" : ""}`} data-lazy="fade">
          <h4 className="sub-title mb-1 text-[18px] font-medium text-[#3e3e3e]">{title}</h4>
          <h1 className="title text-3xl leading-[1.4]  md:text-5xl font-medium md:leading-[1.4] mb-10">{description}</h1>
        </div>
        <div className={`avatar ${inView ? "lazy-animate" : ""} delay-300 max-w-[400px] w-full`} data-lazy="fade">
          <img src={images[0].url} alt="avatar" className="w-full max-h-[300px] object-contain rounded-lg" />
        </div>
      </motion.div>
    </section>
  );
};
const AboutSection = () => {
  return (
    <section className="about">
      <div className="container">
        <h2 className="about-title text-3xl font-bold mb-3">About Section</h2>
        <p className="about-description ">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, explicabo!</p>
      </div>
    </section>
  );
};
const ServicesSection = () => {
  return (
    <section className="services">
      <div className="container">
        <h2 className="services-title text-3xl font-bold mb-3">Services Section</h2>
        <p className="services-description ">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, explicabo!</p>
      </div>
    </section>
  );
};

