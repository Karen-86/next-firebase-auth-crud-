"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import { collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useAlert from "@/hooks/useAlert";
import { useAuthContext } from "./AuthContext";
import * as bannersApi from "@/lib/api/banners.js";

type FetchedBannersProps = {
  isLoading: boolean;
  data: [];
};

type BannersContextType = {
  fetchedBanners: FetchedBannersProps;

  getBanners: (params?: any) => Promise<[]>;
  // createBanner: (params?: any) => Promise<void>;
  // updateBanner: (params?: any) => Promise<void>;
  upsertBanner: (params?: any) => Promise<void>;
};

export const BannersContext = createContext<BannersContextType | null>(null);

export default function BannersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const { successAlert, errorAlert, warningAlert } = useAlert();

  const [fetchedBanners, setFetchedBanners] = useState<FetchedBannersProps>({
    isLoading: false,
    data: [],
  });

  // ADMIN SDK
  // =======================================================================================

  const getBanners = async ({ userId = "", setIsLoading = (_: boolean) => {}, callback = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedBanners((prev) => ({ ...prev, isLoading: true }));

    const data = await bannersApi.getBanners({ userId });

    setIsLoading(false);
    setFetchedBanners((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return errorAlert(data.message);
    console.log(data, " data-banners");

    callback(data.data);

    setFetchedBanners((prev) => ({ ...prev, isLoading: false, data: data.data }));
    return data.data;
  };

  // const createBanner = async ({ fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);

  //   const data = await bannersApi.createBanner({ body: fields });

  //   setIsLoading(false);

  //   if (!data.success) return errorAlert(data.message);

  //   console.log(data, " data-banner");
  //   successAlert(data.message || "Banner has been created successfully.");
  //   callback();
  // };

  // const updateBanner = async ({
  //   bannerId = "",
  //   fields = [],
  //   setIsLoading = (_: boolean) => {},
  //   callback = () => {},
  // }) => {
  //   setIsLoading(true);

  //   const data = await bannersApi.updateBanner({ id: bannerId, body: fields });

  //   setIsLoading(false);

  //   if (!data.success) return errorAlert(data.message);

  //   console.log(data, " data-banner");
  //   // getProfile()
  //   successAlert(data.message || "Banner has been updated successfully.");
  //   callback();
  // };

  const upsertBanner = async ({
    bannerId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    const data = await bannersApi.updateBanner({ id: bannerId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-banner");
    // successAlert(data.message || "Banner has been updated successfully.");
    callback();
  };

  return (
    <BannersContext.Provider
      value={{
        fetchedBanners,

        getBanners,
        // createBanner,
        // updateBanner,
        upsertBanner,
      }}
    >
      {children}
    </BannersContext.Provider>
  );
}

export const useBannersContext = () => {
  const context = useContext(BannersContext);
  if (!context) {
    throw new Error("useBannersContext must be used within an BannersProvider");
  }
  return context;
};
