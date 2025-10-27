"use client";

import React, { useState, useEffect } from "react";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { BreadcrumbDemo, Separator } from "@/components/index";
import localData from "@/localData";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Expand } from "lucide-react";
import { useParams } from "next/navigation";

import ProfileHeader from "./profile-header/ProfileHeader";
import { useGlobalContext } from "@/context/context";

const {} = localData.images;

const {} = localData.images;

const Page = () => {
  const params = useParams();
  const userId = params.id;

  const { getUser, fetchedUser, fetchedCurrentUser } = useFirebaseApiContext();
  const { details } = fetchedUser;

  useEffect(() => {
    if (!userId) return;
    getUser({ id: userId });
  }, [userId]);

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `Profile (${details.displayName})`,
    },
  ];
  console.log(fetchedCurrentUser);
  if (userId === fetchedCurrentUser.details.id) {
    return (
      <main>
        <img className="max-w-[300px]" src="" alt="" />
      </main>
    );
  }

  return (
    <main className="pages-page p-5">
      {/* <h2 className="text-2xl mb-3 capitalize">{fetchedUser.details.role}</h2> */}
      <h2 className="text-2xl mb-3 capitalize">Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <Card className="mb-[150px] min-h-[500px] relative pb-[100px]">
        <CardContent>
          <ProfileHeader details={fetchedUser.details} />
          <UserInfoBlock details={fetchedUser.details} />
        </CardContent>
      </Card>
    </main>
  );
};

// USER INFO BLOCK
const UserInfoBlock = ({ details = {} }: { details: any }) => {
  const {
    fetchedCurrentUser: { details: fetchedCurrentUserDetails },
  } = useFirebaseApiContext();
  return (
    <div className="mb-[150px] relative  py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="settings mb-[80px] ml-auto flex justify-end"></div>
      <div className="relative">
        <div className="bg-image" style={{ backgroundImage: 'url("/assets/images/rest/Alistair.png")' }}></div>
        <div className=" max-w-[500px] w-full ">
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Name:</div>
            <div>{details.displayName || "-"}</div>
          </div>
          <div className="flex items-center justify-between text-sm gap-5 py-1 px-3 border-b-1 border-dashed border-input  mb-3">
            <div className="font-bold">Email:</div>
            <div>
              {(details.email && ["admin", "superAdmin"].includes(fetchedCurrentUserDetails.role) && details.email) || "***"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
