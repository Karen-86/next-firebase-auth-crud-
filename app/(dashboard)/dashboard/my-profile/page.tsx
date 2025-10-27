"use client";

import React from "react";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { BreadcrumbDemo, Separator } from "@/components/index";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import useUtil from "@/hooks/useUtil";

import ProfileHeader from "./profile-header/ProfileHeader";

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "My Profile",
  },
];

const Page = () => {
  return (
    <main className="pages-page p-5">
      <h2 className="text-2xl mb-3">My Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="mb-[150px] min-h-[500px] relative">
        <CardContent>
          <ProfileHeader />
          <UserInfoBlock />
        </CardContent>
      </Card>
    </main>
  );
};

// USER INFO BLOCK
const UserInfoBlock = () => {
  const { fetchedCurrentUser } = useFirebaseApiContext();
  const { details } = fetchedCurrentUser;
  const { formatWithCommas } = useUtil();

  return (
    <div className=" relative  py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="settings mb-[80px] ml-auto flex justify-end">{/* <UserInfoDialog /> */}</div>
      <div className="relative">
        <div className=""></div>
        <div className=" max-w-[500px] w-full ">
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Name:</div>
            <div>{details.displayName || "-"}</div>
          </div>
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Email:</div>
            <div>{details.email || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
