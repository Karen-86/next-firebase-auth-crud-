"use client";
import React, { useState, useEffect } from "react";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles, Sun, Moon, User, ChevronDown, Settings } from "lucide-react";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManageAccountDialog } from "@/components/index";
import localData from "@/localData";

const { avatarPlaceholderImage, ellipsisPreloaderImage } = localData.images;

const { userIcon } = localData.svgs;

export default function NavUserDemo({ trigger = "", triggerClassName = "", contentClassName = "", align = "end" }: any) {
  const { handleSignOut, currentUser } = useFirebaseAuthContext();
  const { fetchedCurrentUser } = useFirebaseApiContext();
  const { details } = fetchedCurrentUser;
  const [user, setUser] = useState<any>({
    name: "",
    email: "",
    photoURL: null,
    base64PhotoURL: null,
  });
  const { theme, systemTheme, setTheme } = useTheme();

  const handleCycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  useEffect(() => {
    setUser({
      name: details?.displayName || "",
      email: details?.email || "",
      photoURL: details?.photoURL || null,
      base64PhotoURL: details?.base64PhotoURL || null,
    });
  }, [details]);

  const [isManageAccoundDialogOpen, setIsManageAccountDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={` ${triggerClassName} flex gap-2 items-center  justify-center outline-none cursor-pointer dark:hover:bg-secondary hover:bg-gray-50 px-2 py-1 rounded-sm`}
        >
          <Avatar className="h-8 w-8 rounded-full border">
            <AvatarImage src={user.base64PhotoURL || user.photoURL} alt={user.name} />
            <AvatarFallback className="rounded-full">
              <img src={avatarPlaceholderImage} alt="" />
            </AvatarFallback>
          </Avatar>
          <div className="user-details flex items-center justify-between w-full gap-2">
            {user.name ? (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-gray-500">{user.email}</span>
              </div>
            ) : (
              <img className="max-w-[45px]" src={ellipsisPreloaderImage} alt="" />
            )}

            <ChevronDown className="ml-auto size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`${contentClassName} w-[95vw] max-w-[350px] rounded-lg p-0`}
          side={"bottom"}
          align={align}
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-4 px-5 py-4 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.base64PhotoURL || user.photoURL} alt={user.name} />
                <AvatarFallback className="rounded-full">
                  <img src={avatarPlaceholderImage} alt="" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-gray-500">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup> */}

          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem asChild className="cursor-pointer px-5 py-4 rounded-none">
            <Link className="" href="/dashboard/my-profile">
              <User className="w-8!" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem asChild className="cursor-pointer px-5 py-4 rounded-none">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsManageAccountDialogOpen(true);
              }}
            >
              <Settings className="w-8!" />
              Manage Account
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem className="cursor-pointer px-5 py-4 rounded-none" onClick={handleCycleTheme}>
            <Sun className="w-8! h-[1.2rem]  rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="w-8! absolute h-[1.2rem]  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {theme}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="m-0" />
          <DropdownMenuItem className="cursor-pointer px-5 py-4 rounded-none" onClick={handleSignOut}>
            <LogOut className="w-8!" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageAccountDialog isOpen={isManageAccoundDialogOpen} setIsOpen={setIsManageAccountDialogOpen} />
    </>
  );
}
