"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import { collection, doc, setDoc, addDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  verifyBeforeUpdateEmail,
  signOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import * as authApi from "@/lib/api/auth.js";
import * as bannersApi from "@/lib/api/banners.js";

import useAutoLogout from "@/hooks/useAutoLogout";
import useAlert from "@/hooks/useAlert";

type StateType = {
  [key: string]: any;
};

type FetchedCurrentUserProps = {
  isLoading: boolean;
  data: { [key: string]: any };
};

type AuthContextType = {
  state: StateType;
  setState: (newState: StateType) => void;

  currentUser: User | null;
  fetchedCurrentUser: FetchedCurrentUserProps;

  getProfile: (params?: { [key: string]: any }) => void;
  handleSignIn: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignInWithGoogle: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignUp: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignOut: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleResetPassword: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdatePassword: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdateEmail: ({ email, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleLinkEmailPasswordAccount: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleReauthenticate: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const adminRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export default function FirebaseAuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<StateType>({
    isDBUserCreated: false,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [fetchedCurrentUser, setFetchedCurrentUser] = useState<FetchedCurrentUserProps>({
    isLoading: false,
    data: {},
  });

  const router = useRouter();
  const pathname = usePathname();

  const { successAlert, errorAlert, warningAlert } = useAlert();

  const getProfile = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedCurrentUser((prev) => ({ ...prev, isLoading: true }));

    const [userData, mediaData] = await Promise.all([
      authApi.getProfile(),
      bannersApi.getBanners({ userId: currentUser?.uid }),
    ]);

    setIsLoading(false);
    setFetchedCurrentUser((prev) => ({ ...prev, isLoading: false }));

    if (!userData.success) return;
    console.log(userData, " data-current-user");

    setFetchedCurrentUser((prev) => ({
      ...prev,
      isLoading: false,
      data: { ...userData.data, banner: mediaData.data[0] },
    }));
  };

  const handleSignIn = async ({ email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      // If user doesn't exist in DB, create user in DB
      if (!userSnap.exists()) {
        const fields = { displayName: res.user.displayName };
        const data = await authApi.createUser({ body: fields });
        if (!data.success) return errorAlert(data.message);
        setState((prev) => ({ ...prev, isDBUserCreated: true }));
        successAlert("User created.");
      }

      // if email updated in auth, update email in DB
      if (userSnap.exists() && userSnap.data().email !== res.user.email) {
        await authApi.updateUserEmail();
        setState((prev) => ({ ...prev, isDBUserCreated: true }));
      }

      successAlert("You’ve signed in successfully!");
      if (!res.user.emailVerified) warningAlert("This email isn’t verified. Please check your inbox to verify it.");
    } catch (err: any) {
      if (err.message === "Firebase: Error (auth/invalid-credential).") {
        errorAlert("Invalid email or password.");
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.");
      }
      console.error(err, "=handleSignIn= request error");
    }
    setIsLoading(false);
  };

  // const createDBUser = async (user: any) => {
  //   try {
  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDocSnap = await getDoc(userDocRef);

  //     // If user doesn't exist in Firestore, add them
  //     if (!userDocSnap.exists()) {
  //       await setDoc(userDocRef, {
  //         uid: user.uid,
  //         email: user.email,
  //         displayName: user.displayName,
  //         photoURL: user.photoURL,
  //         roles: ["user"],
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       });

  //       setState((prev) => ({ ...prev, isDBUserCreated: true }));
  //       console.log("New user added to Firestore.");
  //     } else {
  //       console.log("User already exists in Firestore.");
  //     }
  //   } catch (err: any) {
  //     console.error("Error adding user to Firestore:", err);
  //   }
  // };

  const handleSignInWithGoogle = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      // If user doesn't exist in DB, create user in DB
      if (!userSnap.exists()) {
        const fields = { displayName: res.user.displayName, photoURL: res.user.photoURL };
        const data = await authApi.createUser({ body: fields });
        if (!data.success) return errorAlert(data.message);
        setState((prev) => ({ ...prev, isDBUserCreated: true }));
        // successAlert("User created.");
      }

      // if email updated in auth, update email in DB
      if (userSnap.exists() && userSnap.data().email !== res.user.email) {
        await authApi.updateUserEmail();
        setState((prev) => ({ ...prev, isDBUserCreated: true }));
      }

      successAlert("You’ve signed in successfully!");
      if (!res.user.emailVerified) warningAlert("This email isn’t verified. Please check your inbox to verify it.");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup before completing sign-in.");
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.");
      }
      console.error(err, "=handleSignInWithGoogle= request error");
    }
    setIsLoading(false);
  };

  const handleSignUp = async ({ name = "", email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: name,
      });

      handleEmailVerification({ user: res.user });

      // create user in DB
      const fields = { displayName: res.user.displayName };
      const data = await authApi.createUser({ body: fields });
      if (!data.success) return errorAlert(data.message);
      setState((prev) => ({ ...prev, isDBUserCreated: true }));

      successAlert("You’ve signed up successfully!");
    } catch (err: any) {
      if (err.message == "Firebase: Error (auth/email-already-in-use).") {
        errorAlert("Email already in use. Please use a different email or log in.");
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.");
      }
      console.error(err, "=handleSignUp= request error");
    }
    setIsLoading(false);
  };

  const handleSignOut = async ({ setIsLoading = (_: boolean) => {}, callback = () => {} } = {}) => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // successAlert("You’ve signed out successfully!");
      sessionStorage.setItem("isSignedOut", "true");
      // router.push("/sign-in");
      window.location.href = "/sign-in";
      callback();
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleSignOut= request error");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async ({ email = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      successAlert("Password reset link sent! Check your email.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleResetPassword= request error");
    }
    setIsLoading(false);
  };

  const handleUpdateEmail = async ({ email = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await verifyBeforeUpdateEmail(currentUser, email);
      // await updateEmail(currentUser, email);
      // handleEmailVerification({ user: res.user });
      // successAlert("Your email has been updated successfully!");
      callback();
      successAlert("Confirmation sent. Click the link in your new email to update.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleUpdateEmail= request error");
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async ({
    oldPassword = "",
    password = "",
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    if (!currentUser || !currentUser.email) return;
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, password);
      successAlert("Your password has been updated successfully!");
      callback();
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleUpdatePassword= request error");
    }
    setIsLoading(false);
  };

  const handleLinkEmailPasswordAccount = async ({
    email = "",
    password = "",
    setIsLoading = (_: boolean) => {},
    callback = () => {},
  }) => {
    if (!currentUser) return;
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(email, password);
    try {
      await linkWithCredential(currentUser, credential);
      await handleEmailVerification({ user: currentUser });
      successAlert("Successfully linked email/password account!");
      callback();
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleLinkEmailPasswordAccount= request error");
    }
    setIsLoading(false);
  };

  const handleEmailVerification = async ({
    user,
    setIsLoading = () => {},
  }: {
    user: User;
    setIsLoading?: (_: boolean) => void;
  }) => {
    setIsLoading(true);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
      });
      successAlert("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleEmailVerification= request error");
    }
    setIsLoading(false);
  };

  const handleReauthenticate = async ({ password = "", setIsLoading = (_: boolean) => {} }) => {
    if (!currentUser || !currentUser.email) return;
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      successAlert("reauthenticated successfully");
      console.log("reauthenticated successfully");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleReauthenticate= request error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && adminRoutes.includes(pathname)) {
        router.push("/dashboard");
      } else if (!user && pathname.startsWith("/dashboard")) {
        // router.push("/sign-in");
        window.location.href = "/sign-in";
      }
    });
    return () => unsubscribe();
  }, [handleSignOut]);

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser?.uid) return;
    getProfile();
  }, [currentUser, state.isDBUserCreated]);

  useAutoLogout(24 * 60 * 60 * 1000);

  if (!currentUser && pathname.startsWith("/dashboard") && !adminRoutes.includes(pathname)) return <LoadingScreen />;
  return (
    <AuthContext.Provider
      value={{
        state,
        ...state,
        setState,
        currentUser,
        fetchedCurrentUser,

        getProfile,
        handleSignIn,
        handleSignInWithGoogle,
        handleSignUp,
        handleSignOut,
        handleResetPassword,
        handleUpdatePassword,
        handleUpdateEmail,
        handleLinkEmailPasswordAccount,
        handleReauthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <span className="absolute top-[50%] left-[50%] translate-[-50%,-50%] text-xs text-blue-500">
        client loading(user)...
      </span>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an FirebaseAuthProvider");
  }
  return context;
};
