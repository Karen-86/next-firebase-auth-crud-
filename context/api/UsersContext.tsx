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
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useAlert from "@/hooks/useAlert";
import { useAuthContext } from "./AuthContext";
// import * as userActions from "@/lib/actions/users";
import * as usersApi from "@/lib/api/users.js";
import * as bannersApi from "@/lib/api/banners.js";

type FetchedUsersProps = {
  isLoading: boolean;
  data: { [key: string]: any }[];
};

type FetchedUserProps = {
  isLoading: boolean;
  data: { [key: string]: any };
};

type UsersContextType = {
  fetchedUsers: FetchedUsersProps;
  fetchedUser: FetchedUserProps;

  getUsers: (params?: any) => Promise<void>;
  getUser: (params: any) => Promise<void>;
  updateUser: (params: any) => Promise<void>;
  updateUserRoles: (params: any) => Promise<void>;
  deleteUser: (params: any) => Promise<void>;
};

export const UsersContext = createContext<UsersContextType | null>(null);

export default function UsersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fetchedUsers, setFetchedUsers] = useState<FetchedUsersProps>({
    isLoading: false,
    data: [],
  });

  const [fetchedUser, setFetchedUser] = useState<FetchedUserProps>({
    isLoading: false,
    data: {},
  });

  const { currentUser, fetchedCurrentUser, state, handleSignOut } = useAuthContext();
  const { successAlert, errorAlert, warningAlert } = useAlert();

  // CLIENT SDK
  // =======================================================================================

  // const usersCollectionRef = collection(db, "users");

  // const getUsers = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
  //   setIsLoading(true);
  //   setFetchedUsers((prev) => ({ ...prev, isLoading: true }));

  //   try {
  //     const orderedEventsQuery = query(usersCollectionRef, orderBy("createdAt", "asc"));
  //     const res = await getDocs(orderedEventsQuery);
  //     const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     setFetchedUsers((prev) => ({ ...prev, isLoading: false, list: data }));
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getUsers= request error");
  //   }
  //   setIsLoading(false);
  //   setFetchedUsers((prev) => ({ ...prev, isLoading: false }));
  // };

  // const getUser = async ({ id = "", setIsLoading = (_: boolean) => {} }) => {
  //   setIsLoading(true);
  //   setFetchedUser((prev) => ({ ...prev, isLoading: true }));

  //   try {
  //     const [res, res2] = await Promise.all([
  //       getDoc(doc(usersCollectionRef, id)),
  //       getDoc(doc(db, "users", id, "media", "banner")),
  //     ]);
  //     const data = { id: res.id, ...res.data() };
  //     const mediaData = { id: res2.id, ...res2.data() };

  //     setFetchedUser((prev) => ({
  //       ...prev,
  //       details: { ...data, banner: { ...mediaData } },
  //       isLoading: false,
  //     }));
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getUser= request error");
  //   }
  //   setIsLoading(false);
  //   setFetchedUser((prev) => ({ ...prev, isLoading: false }));
  // };

  // const updateUser = async ({
  //   id = "",
  //   updatedFields = {},
  //   setIsLoading = (_: boolean) => {},
  //   callback = () => {},
  // }) => {
  //   setIsLoading(true);
  //   try {
  //     const docRef = doc(db, "users", id);
  //     await updateDoc(docRef, { ...updatedFields, updatedAt: serverTimestamp() });
  //     getUsers();
  //     // getProfile()
  //     successAlert("User information has been updated successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updateUser= request error");
  //   }
  //   setIsLoading(false);
  //   callback();
  // };

  // const handleDeleteUser = async ({ id = "", password = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);
  //   try {
  //     if (!currentUser || !currentUser.email) return errorAlert("Current User is undefined");

  //     const credential = EmailAuthProvider.credential(currentUser.email, password);
  //     await reauthenticateWithCredential(currentUser, credential);

  //     const userDoc = doc(db, "users", id);
  //     await deleteDoc(userDoc);

  //     await currentUser.delete();

  //     successAlert("User has been deleted successfully.");
  //     callback();
  //   } catch (err: any) {
  //     if (err.code === "auth/requires-recent-login") {
  //       errorAlert("For security reasons, please sign in again before deleting your account.");
  //     } else {
  //       errorAlert(err.message || "Internal server error. Please try again later.");
  //     }
  //     console.error(err, "=handleDeleteUser= request error");
  //   }
  //   setIsLoading(false);
  // };

  // ADMIN SDK
  // =======================================================================================

  const getUsers = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedUsers((prev) => ({ ...prev, isLoading: true }));

    const data = await usersApi.getUsers();

    setIsLoading(false);
    setFetchedUsers((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return errorAlert(data.message);
    console.log(data, " data-users");

    setFetchedUsers((prev) => ({ ...prev, isLoading: false, data: data.data }));
  };

  const getUser = async ({ userId = "", setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedUser((prev) => ({ ...prev, isLoading: true }));

    const [userData, mediaData] = await Promise.all([
      usersApi.getUser({ id: userId }),
      bannersApi.getBanners({ userId }),
    ]);

    setIsLoading(false);
    setFetchedUser((prev) => ({ ...prev, isLoading: false }));

    if (!userData.success) return;
    console.log(userData, " data-user");

    setFetchedUser((prev) => ({
      ...prev,
      isLoading: false,
      data: { ...userData.data, banner: mediaData.data[0] },
    }));
  };

  const updateUser = async ({
    userId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
    hideAlert = false,
  }) => {
    setIsLoading(true);

    const data = await usersApi.updateUser({ id: userId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-user");
    getUsers();
    if (!hideAlert) successAlert(data.message || "User has been updated successfully.");
    callback();
  };

  const updateUserRoles = async ({
    userId = "",
    fields = [],
    setIsLoading = (_: boolean) => {},
    callback = () => {},
    hideAlert = false,
  }) => {
    setIsLoading(true);

    const data = await usersApi.updateUserRoles({ id: userId, body: fields });

    setIsLoading(false);

    if (!data.success && data.message === "Field roles is required") return warningAlert("No changes was made.");
    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-user");
    getUsers();
    if (!hideAlert) successAlert(data.message || "User roles has been updated successfully.");
    callback();
  };

  const deleteUser = async ({ userId = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);
    const data = await usersApi.deleteUser({ id: userId });

    setIsLoading(false);
    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-user");

    if (userId === fetchedCurrentUser.data.id) {
      successAlert("Account deleted successfully");
      setTimeout(() => {
        handleSignOut({});
      }, 3000);
    } else {
      successAlert(data.message || "User has been deleted successfully.");
    }

    callback();
  };

  // ACTIONS
  // const handleDeleteUser = async ({ uid = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);

  //   try {
  //     const user = auth.currentUser;
  //     const idToken = await user?.getIdToken();
  //     if (!idToken) throw new Error("User not authenticated.");

  //     const result = await userActions.deleteUser(idToken, uid);
  //     if (!result.success) throw new Error(result.error || "Failed to delete user.");

  //     successAlert("Account deleted successfully");
  //     callback();
  //     if (uid === auth.currentUser?.uid) await auth.signOut();
  //   } catch (err: any) {
  //     errorAlert(err.message || "Failed to delete account");
  //     console.error(err.message || "Failed to delete account");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUsers();
  }, [currentUser, state.isDBUserCreated]);

  return (
    <UsersContext.Provider
      value={{
        fetchedUsers,
        fetchedUser,

        getUser,
        getUsers,
        updateUser,
        updateUserRoles,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within an UsersProvider");
  }
  return context;
};
