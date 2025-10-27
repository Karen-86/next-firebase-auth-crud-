"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { db, auth } from "@/config/firebase";
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
import localData from "@/localData";

const { placeholderImage } = localData.images;

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

type FetchedPagesProps = {
  homePage: {
    id: string;
    isLoading: boolean;
    sections: { [key: string]: any };
  };
  blogPage: {
    id: string;
    isLoading: boolean;
    sections: { [key: string]: any };
  };
};

type FirebaseApiContextType = {
  fetchedUsers: FetchedUsersProps;
  fetchedCurrentUser: FetchedCurrentUserProps;
  setFetchedCurrentUser: (_: any) => void;
  fetchedUser: FetchedUserProps;
  fetchedEvents: FetchedEventsProps;
  fetchEventsHistoryRecords: FetchEventsHistoryRecordsProps;
  fetchedPages: FetchedPagesProps;

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
  getUserCollection: ({ userId, collectionName, collectionId, setIsLoading }: { [key: string]: any }) => void;

  createContent: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
  updateContent: ({ id, slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
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

  const [fetchedPages, setFetchedPages] = useState<FetchedPagesProps>({
    homePage: {
      id: "",
      isLoading: true,
      sections: {
        header: {
          title: "Header",
          description: "Lorem Ipsum is simply dummy text of the  typesetting.",
          images: [{ id: "1", title: "", url: placeholderImage }],
        },

        contact: {
          title: "Contact section",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          images: [{ id: "1", title: "", url: placeholderImage }],
        },
      },
    },
    blogPage: {
      id: "",
      isLoading: true,
      sections: {
        header: {
          title: "Header",
          description: "Lorem Ipsum is simply dummy text of the  typesetting.",
          images: [{ id: "1", title: "", url: placeholderImage }],
        },
        blogList: [
          {
            slug: "blog-1",
            title: "blog 1",
            description: "Lorem Ipsum is simply dummy text of the  typesetting.",
            images: [{ id: "1", title: "", url: placeholderImage }],
            isFeatured: true,
          },
          {
            slug: "blog-2",
            title: "blog 2",
            description: "Lorem Ipsum is simply dummy text of the  typesetting.",
            images: [{ id: "1", title: "", url: placeholderImage }],
            isFeatured: true,
          },
        ],
      },
    },
  });

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
      const userDoc = doc(db, "users", id);
      await updateDoc(userDoc, { ...updatedFields, updatedAt: serverTimestamp() });
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
      const docRef = doc(db, "users", userId, collectionName, collectionId);
      const docSnap = await getDoc(docRef);

      const dataToSave: any = {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      };

      if (!docSnap.exists()) dataToSave.createdAt = serverTimestamp();
      await setDoc(docRef, dataToSave, { merge: true }); //recommended option, if subCollection dont exist it will create, if exist it will update, also you control id name

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

  const getUserCollection = async ({
    userId = "",
    collectionName = "",
    collectionId = "",
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    setIsLoading(true);
    console.log(userId, collectionName, collectionId);
    try {
      await getDoc(doc(db, "users", userId, collectionName, collectionId));
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateUserSubCollection= request error");
    }
    setIsLoading(false);
    callback();
  };

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
  const getContents = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    setFetchedPages((prev) => ({ ...prev, homePage: { ...prev.homePage, isLoading: true } }));
    try {
      const res = await getDocs(websiteContentRef);
      const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (data && data.length) {
        // #12345678
        setFetchedPages((prev) => ({
          ...prev,
          homePage: {
            id: data[0].id,
            isLoading: false,
            sections: { ...prev.homePage.sections, ...data[0] },
          },
        }));
      }
    } catch (err: any) {
      setFetchedPages((prev) => ({
        ...prev,
        homePage: {
          ...prev.homePage,
          isLoading: false,
        },
      }));
      setIsLoading(false);
      if (err.message == "Missing or insufficient permissions.") {
        console.warn(err, "=getContents= request warning");
        return;
      }
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getContents= request error");
    }

    setFetchedPages((prev) => ({ ...prev, homePage: { ...prev.homePage, isLoading: false } }));
  };

  const createContent = async ({ slug = "", setIsLoading = (_: boolean) => {}, ...fields }) => {
    setIsLoading(true);

    const filteredData = {
      [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // createdAt: new Date(),
      // updatedAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "website-content"), filteredData);
      getContents({});
      successAlert("Content has been created successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=createContent= request error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async ({ id = "", slug = "", setIsLoading = (_: boolean) => {}, ...fields }) => {
    setIsLoading(true);

    const filteredData = {
      [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
      updatedAt: serverTimestamp(),
      // updatedAt: new Date(),
    };

    console.log(filteredData, " filteredData");

    try {
      const contentDoc = doc(db, "website-content", id);
      await updateDoc(contentDoc, filteredData);
      getContents({});
      successAlert("Content has been updated successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateContent= request error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUser({ id: currentUser?.uid });
    getUsers({});
  }, [currentUser, state.isDBUserCreated]);

  useEffect(() => {
    getContents({});
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
        getUserCollection,

        createContent,
        updateContent,
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
