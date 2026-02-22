"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import useAlert from "@/hooks/useAlert";
import { useFirebaseAuthContext } from "./FirebaseAuthContext";
import websiteOriginalContent from "@/lib/data/websiteOriginalContent";

type FetchedEventsProps = {
  isLoading: boolean;
  list: { [key: string]: any }[];
};

type FetchEventsHistoryRecordsProps = {
  isLoading: boolean;
  list: { [key: string]: any }[];
};

type FetchedUsersProps = {
  isLoading: boolean;
  list: { [key: string]: any }[];
};

type FetchedCurrentUserProps = {
  isLoading: boolean;
  details: { [key: string]: any };
};

type FetchedUserProps = {
  isLoading: boolean;
  details: { [key: string]: any };
};

type FirebaseApiContextType = {
  fetchedUsers: FetchedUsersProps;
  fetchedCurrentUser: FetchedCurrentUserProps;
  setFetchedCurrentUser: (_: any) => void;
  fetchedUser: FetchedUserProps;
  fetchedEvents: FetchedEventsProps;
  fetchEventsHistoryRecords: FetchEventsHistoryRecordsProps;
  fetchedPages: { [key: string]: any };

  getUser: ({ setIsLoading }: { [key: string]: any }) => void;
  getUsers: ({ setIsLoading }: { [key: string]: any }) => void;
  updateUser: ({ id, setIsLoading, updatedFields }: { [key: string]: any }) => void;
  deleteUser: ({ id, setIsLoading }: { [key: string]: any }) => void;
  updateUserSubCollection: ({
    userId,
    collectionName,
    collectionId,
    setIsLoading,
    updatedFields,
  }: {
    [key: string]: any;
  }) => void;
  // getUserCollection: ({ userId, collectionName, collectionId, setIsLoading }: { [key: string]: any }) => void;

  // createContent: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  // updateContent: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  // getSingleSubPage: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  getAllSubPages: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  getSinglePage: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  updateContent: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  updateContentSubCollection: ({ userId, collectionName, collectionId, setIsLoading }: { [key: string]: any }) => void;
  deleteContentSubCollection: ({ userId, collectionName, collectionId, setIsLoading }: { [key: string]: any }) => void;
};

export const FirebaseApiContext = createContext<FirebaseApiContextType | null>(null);

export default function FirebaseApiProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fetchedEvents, setFetchedEvents] = useState<FetchedEventsProps>({
    isLoading: false,
    list: [],
  });

  const [fetchEventsHistoryRecords, setFetchEventsHistoryRecords] = useState<FetchEventsHistoryRecordsProps>({
    isLoading: false,
    list: [],
  });

  const [fetchedUsers, setFetchedUsers] = useState<FetchedUsersProps>({
    isLoading: false,
    list: [],
  });

  const [fetchedCurrentUser, setFetchedCurrentUser] = useState<FetchedCurrentUserProps>({
    isLoading: false,
    details: {},
  });

  const [fetchedUser, setFetchedUser] = useState<FetchedCurrentUserProps>({
    isLoading: false,
    details: {},
  });

  const [fetchedPages, setFetchedPages] = useState(websiteOriginalContent);

  const { currentUser, state } = useFirebaseAuthContext();
  const { successAlert, errorAlert } = useAlert();

  const usersCollectionRef = collection(db, "users");
  const websiteContentRef = collection(db, "website-content");

  // USERS

  const getUser = async ({ id = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    setFetchedUser((prev) => ({ ...prev, isLoading: true }));

    try {
      const [res, res2] = await Promise.all([
        getDoc(doc(usersCollectionRef, id)),
        getDoc(doc(db, "users", id, "media", "banner")),
      ]);
      const data = { id: res.id, ...res.data() };
      const mediaData = { id: res2.id, ...res2.data() };

      if (currentUser?.uid === id) {
        setFetchedCurrentUser((prev) => ({
          ...prev,
          details: { ...data, collectionMedia: { ...mediaData } },
          isLoading: false,
        }));
      } else {
        setFetchedUser((prev) => ({
          ...prev,
          details: { ...data, collectionMedia: { ...mediaData } },
          isLoading: false,
        }));
      }
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getUser= request error");
    }
    setIsLoading(false);
    setFetchedUser((prev) => ({ ...prev, isLoading: false }));
  };

  const getUsers = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    setFetchedUsers((prev) => ({ ...prev, isLoading: true }));

    try {
      const orderedEventsQuery = query(usersCollectionRef, orderBy("createdAt", "asc"));
      const res = await getDocs(orderedEventsQuery);
      const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFetchedUsers((prev) => ({ ...prev, isLoading: false, list: data }));
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getUsers= request error");
    }
    setIsLoading(false);
    setFetchedUsers((prev) => ({ ...prev, isLoading: false }));
  };

  const updateUser = async ({ id = "", updatedFields = {}, setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, { ...updatedFields, updatedAt: serverTimestamp() });
      getUsers({});
      successAlert("User information has been updated successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateUser= request error");
    }
    setIsLoading(false);
    callback();
  };

  const updateUserSubCollection = async ({
    userId = "",
    collectionName = "",
    collectionId = "",
    updatedFields = {},
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    try {
      const subDocRef = doc(db, "users", userId, collectionName, collectionId);
      const docSnap = await getDoc(subDocRef);

      const dataToSave: any = {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      };

      if (!docSnap.exists()) dataToSave.createdAt = serverTimestamp();
      await setDoc(subDocRef, dataToSave, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

      // await addDoc(collection(db, "users", userId, "gallery"), {
      //   updatedFields,
      // });
      // await updateDoc(doc(db, "users", userId, collectionName, collectionId), {
      //   updatedFields,
      // });
      // getUser({id: userId});
      // getUsers({});
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateUserSubCollection= request error");
    }
    setIsLoading(false);
    callback();
  };

  // const getUserCollection = async ({
  //   userId = "",
  //   collectionName = "",
  //   collectionId = "",
  //   setIsLoading = (_: boolean) => {},
  //   callback = () => {},
  // }) => {
  //   setIsLoading(true);
  //   console.log(userId, collectionName, collectionId);
  //   try {
  //     await getDoc(doc(db, "users", userId, collectionName, collectionId));
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updateUserSubCollection= request error");
  //   }
  //   setIsLoading(false);
  //   callback();
  // };

  const deleteUser = async ({ id = "", callback = () => {}, setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);

    try {
      const userDoc = doc(db, "users", id);
      await deleteDoc(userDoc);

      getUsers({});
      successAlert("User record has been deleted successfully.");
      callback();
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=userEvent= request error");
    }
    setIsLoading(false);
  };

  // WEBSITECONTENT
  // const getContents = async ({ setIsLoading = (_: boolean) => {} }) => {
  //   setIsLoading(true);
  //   setFetchedPages((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const websiteContentRef = collection(db, "website-content");
  //     const blogSubColRef = collection(db, "website-content", "blog-page", "blog");

  //     const [res, res2] = await Promise.all([getDocs(websiteContentRef), getDocs(blogSubColRef)]);

  //     const pages = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     const blog = res2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     const blogList = blog.map((item: any) => ({ ...item.blog }));

  //     // if (pages && pages.length) {
  //     setFetchedPages((prev: any) => ({
  //       ...prev,
  //       homePage: {
  //         sections: { ...prev.homePage.sections, ...pages.find((item) => item.id === "home-page") },
  //       },
  //       blogPage: {
  //         sections: { ...prev.blogPage.sections, ...pages.find((item) => item.id === "blog-page"), "blog-list": blogList },
  //       },
  //     }));
  //     // }
  //   } catch (err: any) {
  //     if (err.message == "Missing or insufficient permissions.") {
  //       console.warn(err, "=getContents= request warning");
  //       return;
  //     }
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getContents= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedPages((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  const getSinglePage = async ({ collectionName = "", documentId = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    setFetchedPages((prev) => ({ ...prev, isLoading: true }));
    try {
      const docRef = doc(db, collectionName, documentId);
      const res = await getDoc(docRef);
      const data = { id: res.id, ...res.data() };

      if (!res.exists()) throw new Error("Content not found");

      console.log(data);
      setFetchedPages((prev: any) => ({
        ...prev,
        [documentId]: { sections: { ...prev[documentId].sections, ...data } },
      }));
    } catch (err: any) {
      if (err.message == "Content not found") {
        console.warn(err, "=getContent= request warning");
        return;
      }
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getContent= request error");
    } finally {
      setIsLoading(false);
      setFetchedPages((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getAllSubPages = async ({
    collectionName = "",
    documentId = "",
    subCollectionName = "",
    setIsLoading = (_: boolean) => {},
  }) => {
    setIsLoading(true);
    setFetchedPages((prev) => ({ ...prev, isLoading: true }));
    try {
      const subCollectionRef = collection(db, collectionName, documentId, subCollectionName);
      const res = await getDocs(subCollectionRef);
      const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setFetchedPages((prev: any) => ({
        ...prev,
        [documentId]: {
          sections: { ...prev[documentId].sections, "blog-list": [...data.map((item: any) => ({ ...item.blog }))] },
        },
      }));
    } catch (err: any) {
      if (err.message == "Missing or insufficient permissions.") {
        console.warn(err, "=getContent= request warning");
        return;
      }
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getContent= request error");
    } finally {
      setIsLoading(false);
      setFetchedPages((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // const getSingleSubPage = async ({
  //   collectionName = "",
  //   documentId = "",
  //   subCollectionName = "",
  //   subDocumentId = "",
  //   setIsLoading = (_: boolean) => {},
  // }) => {
  //   setIsLoading(true);
  //   setFetchedPages((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const subDocRef = doc(db, collectionName, documentId, subCollectionName, subDocumentId);
  //     const res = await getDoc(subDocRef);
  //     const data: any = { id: res.id, ...res.data() };
  //     console.log(data);

  //     if (!res.exists()) throw new Error("Content not found");

  //     setFetchedPages((prev: any) => ({
  //       ...prev,
  //       [documentId]: {
  //         sections: { ...prev[documentId].sections, "blog-item": data.blog },
  //       },
  //     }));
  //   } catch (err: any) {
  //     if (err.message == "Content not found") {
  //       console.warn(err, "=getSingleSubPage= request warning");
  //       return;
  //     }
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getSingleSubPage= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedPages((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  // const createContent = async ({ slug = "", setIsLoading = (_: boolean) => {}, ...fields }) => {
  //   setIsLoading(true);

  //   const filteredData = {
  //     [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
  //     createdAt: serverTimestamp(),
  //     updatedAt: serverTimestamp(),
  //     // createdAt: new Date(),
  //     // updatedAt: new Date(),
  //   };

  //   try {
  //     const docRef = await addDoc(collection(db, "website-content"), filteredData);
  //     getContents({});
  //     successAlert("Content has been created successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=createContent= request error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const updateContent = async ({ id = "", slug = "", setIsLoading = (_: boolean) => {}, ...fields }) => {
  //   setIsLoading(true);

  //   const filteredData = {
  //     [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
  //     updatedAt: serverTimestamp(),
  //     // updatedAt: new Date(),
  //   };

  //   console.log(filteredData, " filteredData");

  //   try {
  //     const contentDoc = doc(db, "website-content", id);
  //     await updateDoc(contentDoc, filteredData);
  //     getContents({});
  //     successAlert("Content has been updated successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updateContent= request error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const updateContent = async ({
    collectionName = "",
    documentId = "",
    section = "",
    updatedFields = {},
    setIsLoading = (_: boolean) => {},
    callback = () => {},
    ...fields
  }) => {
    setIsLoading(true);

    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      const filteredData = {
        [section]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
        updatedAt: serverTimestamp(),
      };

      if (!docSnap.exists()) filteredData.createdAt = serverTimestamp();
      await setDoc(docRef, filteredData, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

      getSinglePage({ collectionName: "website-content", documentId: "home-page" });
      successAlert("Content has been updated successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateContent= request error");
    } finally {
      setIsLoading(false);
      callback();
    }
  };

  const updateContentSubCollection = async ({
    collectionName = "",
    documentId = "",
    subCollectionName = "",
    subDocumentId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    try {
      const subDocRef = doc(db, collectionName, documentId, subCollectionName, subDocumentId);
      const docSnap = await getDoc(subDocRef);

      const filteredData: any = {
        blog: fields,
        updatedAt: serverTimestamp(),
      };

      if (!docSnap.exists()) filteredData.createdAt = serverTimestamp();
      await setDoc(subDocRef, filteredData, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

      getAllSubPages({ collectionName: "website-content", documentId: "blog-page", subCollectionName: "blog" });
      successAlert("Content has been updated successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateContentSubCollection= request error");
    }
    setIsLoading(false);
    callback();
  };
  
  const deleteContentSubCollection = async ({
    collectionName = "",
    documentId = "",
    subCollectionName = "",
    subDocumentId = "",
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);

    try {
      const subDocRef = doc(db, collectionName, documentId, subCollectionName, subDocumentId);
      const docSnap = await getDoc(subDocRef);
      if (!docSnap.exists()) throw new Error("Blog not found.");
      
      await deleteDoc(subDocRef);
      getAllSubPages({ collectionName: "website-content", documentId: "blog-page", subCollectionName: "blog" });
      successAlert("Content has been deleted successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=deleteContentSubCollection= request error");
    }
    setIsLoading(false);
    callback();
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUser({ id: currentUser?.uid });
    getUsers({});
  }, [currentUser, state.isDBUserCreated]);

  useEffect(() => {
    getSinglePage({ collectionName: "website-content", documentId: "home-page" });
    getAllSubPages({ collectionName: "website-content", documentId: "blog-page", subCollectionName: "blog" });
  }, []);

  return (
    <FirebaseApiContext.Provider
      value={{
        fetchedEvents,
        fetchedUsers,
        fetchEventsHistoryRecords,
        fetchedCurrentUser,
        setFetchedCurrentUser,
        fetchedUser,
        fetchedPages,

        getUser,
        getUsers,
        updateUser,
        deleteUser,
        updateUserSubCollection,
        // getUserCollection,

        // createContent,
        // updateContent,
        // getSingleSubPage,
        getSinglePage,
        getAllSubPages,
        updateContent,
        updateContentSubCollection,
        deleteContentSubCollection,
      }}
    >
      {children}
    </FirebaseApiContext.Provider>
  );
}

export const useFirebaseApiContext = () => {
  const context = useContext(FirebaseApiContext);
  if (!context) {
    throw new Error("useFirebaseApiContext must be used within an FirebaseApiProvider");
  }
  return context;
};
