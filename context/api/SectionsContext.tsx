"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import { collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import useAlert from "@/hooks/useAlert";
import { useAuthContext } from "./AuthContext";

import * as sectionsApi from "@/lib/api/sections.js";

type FetchedSectionProps = {
  isLoading: boolean;
  data: { [key: string]: any };
};

type SectionsContextType = {
  fetchedSection: FetchedSectionProps;

  getSection: (params?: any) => void;
  createSection: (params?: any) => void;
  updateSection: (params?: any) => void;
};

export const SectionsContext = createContext<SectionsContextType | null>(null);

export default function SectionsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser, state } = useAuthContext();
  const { successAlert, errorAlert, warningAlert } = useAlert();

  const [fetchedSection, setFetchedSection] = useState<FetchedSectionProps>({
    isLoading: false,
    data: {},
  });

  // CLIENT SDK
  // =======================================================================================
  
  // const sectionsRef = collection(db, "sections");

  // const getSection = async ({ sectionId = "", setIsLoading = (_: boolean) => {} } = {}) => {
  //   setIsLoading(true);
  //   setFetchedSection((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const sectionRef = doc(sectionsRef, sectionId);
  //     const sectionSnap = await getDoc(sectionRef);

  //     if (!sectionSnap.exists()) throw new Error("Document not found");

  //     const data: any = { ...sectionSnap.data() };
  //     const { createdAt, updatedAt, ...rest } = data;

  //     setFetchedSection((prev) => ({ ...prev, isLoading: false, data: rest }));
  //   } catch (err: any) {
  //     if (err.message == "Document not found") return console.warn(err, "=getSection= request warning");
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getSection= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedSection((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  // const updateSection = async ({
  //   sectionId = "",
  //   fields = [],
  //   setIsLoading = (_: boolean) => {},
  //   callback = () => {},
  // }) => {
  //   setIsLoading(true);

  //   try {
  //     const sectionRef = doc(sectionsRef, sectionId);
  //     const sectionSnap = await getDoc(sectionRef);

  //     const filteredData: any = {
  //       ...fields,
  //       updatedAt: serverTimestamp(),
  //     };

  //     if (!sectionSnap.exists()) {
  //       filteredData.userId = currentUser?.uid;
  //       filteredData.createdAt = serverTimestamp();
  //     }
  //     await setDoc(sectionRef, filteredData, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

  //     getSection({sectionId});
  //     successAlert("Section has been updated successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updateSection= request error");
  //   } finally {
  //     setIsLoading(false);
  //     callback();
  //   }
  // };

  // ADMIN SDK
  // =======================================================================================

  const getSection = async ({ sectionId = {}, setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedSection((prev) => ({ ...prev, isLoading: true }));

    const data = await sectionsApi.getSection({ id: sectionId });
    setIsLoading(false);
    setFetchedSection((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return;
    console.log(data, " data-section");

    setFetchedSection((prev) => ({ ...prev, isLoading: false, data: data.data }));
  };

  const createSection = async ({
    sectionId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    const data = await sectionsApi.createSection({ id: sectionId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-section");
    getSection({ sectionId });
    successAlert(data.message || "Section has been created successfully.");
    callback();
  };

  const updateSection = async ({
    sectionId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    const data = await sectionsApi.updateSection({ id: sectionId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-section");
    getSection({ sectionId });
    successAlert(data.message || "Section has been updated successfully.");
    callback();
  };

  return (
    <SectionsContext.Provider
      value={{
        fetchedSection,

        getSection,
        createSection,
        updateSection,
      }}
    >
      {children}
    </SectionsContext.Provider>
  );
}

export const useSectionsContext = () => {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error("useSectionsContext must be used within an SectionsProvider");
  }
  return context;
};
