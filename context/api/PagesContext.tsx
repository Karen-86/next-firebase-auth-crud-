"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import { collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import useAlert from "@/hooks/useAlert";
import { useAuthContext } from "./AuthContext";
import * as pagesApi from "@/lib/api/pages.js";

type FetchedPageProps = {
  isLoading: boolean;
  data: { [key: string]: any };
};

type PagesContextType = {
  fetchedPage: FetchedPageProps;

  getPage: (params: any) => void;
  createPage: (params: any) => void;
  updatePage: (params: any) => void;
};

export const PagesContext = createContext<PagesContextType | null>(null);

export default function PagesProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { successAlert, errorAlert, warningAlert } = useAlert();

  const [fetchedPage, setFetchedPage] = useState<FetchedPageProps>({
    isLoading: false,
    data: [],
  });

  // CLIENT SDK
  // =======================================================================================

  // const pagesRef = collection(db, "pages");

  // const getPage = async ({ pageId = "", setIsLoading = (_: boolean) => {} } = {}) => {
  //   setIsLoading(true);
  //   setFetchedPage((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const pageRef = doc(pagesRef, pageId);
  //     const pageSnap = await getDoc(pageRef);

  //     if (!pageSnap.exists()) throw new Error("Document not found");

  //     const data: any = { ...pageSnap.data() };
  //     const { createdAt, updatedAt, ...rest } = data;

  //     setFetchedPage((prev) => ({ ...prev, isLoading: false, data: rest }));
  //   } catch (err: any) {
  //     if (err.message == "Document not found") return console.warn(err, "=getPage= request warning");
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getPage= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedPage((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  // const updatePage = async ({ pageId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);

  //   try {
  //     const pageRef = doc(pagesRef, pageId);
  //     const pageSnap = await getDoc(pageRef);

  //     const filteredData: any = {
  //       ...fields,
  //       userId: currentUser?.uid,
  //       updatedAt: serverTimestamp(),
  //     };

  //     if (!pageSnap.exists()) filteredData.createdAt = serverTimestamp();
  //     await setDoc(pageRef, filteredData, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

  //     // getPages();
  //     successAlert("Page has been updated successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updatePage= request error");
  //   } finally {
  //     setIsLoading(false);
  //     callback();
  //   }
  // };

  // ADMIN SDK
  // =======================================================================================

  const getPage = async ({ pageId = {}, setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedPage((prev) => ({ ...prev, isLoading: true }));

    const data = await pagesApi.getPage({ id: pageId });
    setIsLoading(false);
    setFetchedPage((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return;
    console.log(data, " data-page");

    setFetchedPage((prev) => ({ ...prev, isLoading: false, data: data.data }));
  };

  const createPage = async ({ pageId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    const data = await pagesApi.createPage({ id: pageId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-page");
    getPage({ pageId });
    successAlert(data.message || "Page has been created successfully.");
    callback();
  };

  const updatePage = async ({ pageId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    const data = await pagesApi.updatePage({ id: pageId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-page");
    getPage({ pageId });
    successAlert(data.message || "Page has been updated successfully.");
    callback();
  };

  return (
    <PagesContext.Provider
      value={{
        fetchedPage,

        getPage,
        createPage,
        updatePage,
      }}
    >
      {children}
    </PagesContext.Provider>
  );
}

export const usePagesContext = () => {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error("usePagesContext must be used within an PagesProvider");
  }
  return context;
};
