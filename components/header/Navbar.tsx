"use client";

import React from "react";
import localData from "@/localData";
import { ButtonDemo, ModeToggle } from "@/components/index.js";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { SidebarNavigationMenuDemo } from "./SidebarNavigationMenuDemo";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import Link from "next/link";

const { logo } = localData.images;

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
];

export const dropdownLinksModules: { title: string; href: string; description: string }[] = [
  {
    title: "item 1",
    href: "/modules/item-1",
    description: "",
  },
  {
    title: "item 2",
    href: "/modules/item-2",
    description: "",
  },
  {
    title: "item 3",
    href: "/modules/item-3",
    description: "",
  },
];

export default function Navbar() {
  const { currentUser } = useFirebaseAuthContext();

  return (
    <nav className="navbar absolute w-full">
      <div className="container py-3 flex items-center justify-between ">
        <Link href="/">
          <img src={logo} alt="" className="max-w-[50px] h-auto " />
        </Link>

        <NavigationMenuDemo />

        <SidebarNavigationMenuDemo />

        <div className="btn-group  gap-2 hidden lg:flex">
          <Link href={` ${currentUser ? "/dashboard" : "/sign-up"}`}>
            <ButtonDemo variant="ghost" text={` ${currentUser ? "Dashboard" : "Sign Up"}`} />
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
