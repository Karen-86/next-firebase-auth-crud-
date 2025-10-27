"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { ButtonDemo, BreadcrumbDemo, TooltipDemo, UpdateEmailDialog, UpdateProfileDialog } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import localData from "@/localData";

const { googleLogoIcon, avatarPlaceholderImage } = localData.images;
const { exclamationIcon, emailIcon, googleIcon } = localData.svgs;

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "Profile",
  },
];


const Page = () => {
  return (
    <main className="pages-page p-5 mb-[150px]">
      <h2 className="text-2xl mb-3">Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <SettingsProfile/>
    </main>
  );
};

export const SettingsProfile = () => {
  const [isEmailPasswordMethodEnabled, setIsEmailPasswordMethodEnabled] = useState(false);
  const [isGoogleSignInMethodEnabled, setIsGoogleSignInMethodEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const { currentUser, handleSignInWithGoogle } = useFirebaseAuthContext();
  const { fetchedCurrentUser, fetchedUsers } = useFirebaseApiContext();

  const { email, role, base64PhotoURL, photoURL, displayName } = fetchedCurrentUser.details;

  useEffect(() => {
    if (!currentUser) return;
    const _isEmailPasswordMethodEnabled = currentUser.providerData.find((item) => item.providerId === "password");
    if (_isEmailPasswordMethodEnabled) {
      setIsEmailPasswordMethodEnabled(true);
    }

    const _isGoogleSignInMethodEnabled = currentUser.providerData.find((item) => item.providerId === "google.com");
    if (_isGoogleSignInMethodEnabled) {
      setIsGoogleSignInMethodEnabled(true);
    }

    setIsEmailVerified(currentUser.emailVerified);
  }, [currentUser]);

  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    if (!fetchedUsers.list.length) return;
    setAdmins(fetchedUsers.list.filter((user) => user.role === "admin"));
  }, [fetchedUsers]);

  return (
    <div className="settings-profile">
      <Card className="mb-5">
        <CardContent className="text-xs font-medium">
          <div className="grid sm:grid-cols-[1fr_1fr_1fr] items-center gap-4">
            <div className="text-1xl  font-semibold">Profile</div>
            <div className="flex gap-4 items-center">
              <div className="avatar-options avatar w-[48px]">
                <div className="  w-[100%] h-0 pt-[100%] relative rounded-full  shadow-[0_0_6px_rgba(0,0,0,0.3)] overflow-hidden ">
                  <img
                    src={base64PhotoURL || photoURL || avatarPlaceholderImage}
                    className="block absolute bg-gray-50 top-0 left-0 w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>
              <div>{displayName}</div>
            </div>
            <div>
              <div className="ml-auto w-fit">
                <UpdateProfileDialog />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid sm:grid-cols-[1fr_1fr_1fr] items-center gap-4">
            <div className="text-1xl  font-semibold">Email address</div>
            <div className="">
              {(isEmailPasswordMethodEnabled || isGoogleSignInMethodEnabled) && (
                <div className="flex gap-2 items-start">
                  {currentUser?.email}
                  {!isEmailVerified && (
                    <TooltipDemo
                      trigger={
                        <ButtonDemo
                          size="icon"
                          variant="ghost"
                          icon={exclamationIcon}
                          className="w-[14px] h-[14px] [&>svg]:!w-[12px] [&>svg]:!h-[12px] text-yellow-600 border-yellow-400 border hover:text-yellow-600 rounded-full"
                        />
                      }
                      content={<div>This email isn’t verified. Please check your inbox to verify it.</div>}
                    />
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="ml-auto w-fit">
                {isEmailPasswordMethodEnabled && !isGoogleSignInMethodEnabled && <UpdateEmailDialog />}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid sm:grid-cols-[1fr_1fr_1fr] items-center justify-between gap-2">
            <div className="text-1xl  font-semibold">Connected account</div>
            <div>
              {isGoogleSignInMethodEnabled ? (
                <div className="flex items-center gap-1 ">
                  <img className="max-w-[18px]" src={googleLogoIcon} alt="" />
                  <div>Google</div>
                  <div className="text-gray-400 flex items-center gap-1">
                    <div>•</div> {currentUser?.email}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 "></span>
              )}
            </div>
            <div>
              <div className="ml-auto w-fit">
                {!isGoogleSignInMethodEnabled && (
                  <div className="flex items-start gap-3">
                    <ButtonDemo
                      size="sm"
                      startIcon={<img src={googleLogoIcon} className="h-[16px]" />}
                      text={`${isLoading ? "Signing In..." : "Connect Google"} `}
                      className={`  text-gray-700 text-xs`}
                      disabled={!isEmailVerified || isLoading}
                      variant="ghost"
                      onClick={() => handleSignInWithGoogle({})}
                    />
                    {!isEmailVerified && (
                      <TooltipDemo
                        trigger={
                          <ButtonDemo
                            size="icon"
                            variant="ghost"
                            icon={exclamationIcon}
                            className="w-[14px] h-[14px] [&>svg]:!w-[12px] [&>svg]:!h-[12px] text-yellow-600 border-yellow-400 border hover:text-yellow-600 rounded-full"
                          />
                        }
                        content={
                          <div>
                            Your email isn’t verified yet. Please verify it first, and only then try connecting Google to avoid
                            losing your password login access.
                          </div>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="px-7 py-4 text-xs bg-gray-50 dark:bg-secondary rounded-lg">
        <div className="flex items-center justify-between  gap-5 py-1">
          <div className="font-semibold">Providers:</div>
          <div className="capitalize font-medium">
            <div className="">
              {isGoogleSignInMethodEnabled && <div className="[&>svg]:w-[20px] [&>svg]:h-[20px]">{googleIcon}</div>}
              {isEmailPasswordMethodEnabled && <div className="[&>svg]:w-[20px] [&>svg]:h-[20px]">{emailIcon}</div>}
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between  gap-5 py-1">
          <div className="font-semibold">Role:</div>
          <div className="capitalize font-medium">{role || "—"}</div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between  gap-5 py-1">
          <div className="font-semibold">Is email verified:</div>
          <div className="capitalize font-medium">{currentUser?.emailVerified ? "Yes" : "No"}</div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between  gap-5 py-1">
          <div className="font-semibold">Admin(s):</div>
          <div className="capitalize font-medium">
            {" "}
            {admins.length ? (
              admins.map((admin, index) => (
                <span key={index} className="">
                  {admin.displayName}
                  {index < admins.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span className=" text-gray-400">—</span>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between  gap-5 py-1">
          <div className="font-semibold">Super Admin:</div>
          <div className="capitalize font-medium">
            {fetchedUsers.list.find((superAdmin) => superAdmin.role === "superAdmin")?.displayName || (
              <span className=" text-gray-400">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
