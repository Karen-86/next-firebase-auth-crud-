"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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
import useAutoLogout from "@/hooks/useAutoLogout";
import useAlert from "@/hooks/useAlert";

type StateType = {
  [key: string]: any;
};

type FirebaseAuthContextType = {
  state: StateType;
  setState: (newState: StateType) => void;
  currentUser: User | null;
  handleSignIn: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignInWithGoogle: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignUp: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignOut: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleResetPassword: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdatePassword: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdateEmail: ({ email, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleLinkEmailPasswordAccount: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleReauthenticate: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleDeleteUser: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
};

export const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

const adminRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export default function FirebaseAuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<StateType>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { successAlert, errorAlert, warningAlert } = useAlert();

  const handleSignIn = async ({ email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
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

  const createDBUser = async (user: any) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, add them
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "user",
          rank: "R1",
          createdAt: new Date(),
        });
        setState((prev) => ({ ...prev, isDBUserCreated: true }));
        console.log("New user added to Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }
    } catch (err: any) {
      console.error("Error adding user to Firestore:", err);
    }
  };

  const handleSignInWithGoogle = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      await createDBUser(res.user);

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

      await createDBUser(res.user);

      handleEmailVerification({ user: res.user });

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

  const handleDeleteUser = async ({ id = "", password = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);
    try {
      if (!currentUser || !currentUser.email) return errorAlert("Current User is undefined");

      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      const userDoc = doc(db, "users", id);
      await deleteDoc(userDoc);

      await currentUser.delete();

      successAlert("User has been deleted successfully.");
      callback();
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        errorAlert("For security reasons, please sign in again before deleting your account.");
      } else {
        errorAlert(err.message || "Internal server error. Please try again later.");
      }
      console.error(err, "=handleDeleteUser= request error");
    }
    setIsLoading(false);
  };

  const handleSignOut = async ({ setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // successAlert("You’ve signed out successfully!");
      sessionStorage.setItem("isSignedOut", "true");
      router.push("/sign-in");
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

  const handleUpdatePassword = async ({ oldPassword = "",password = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    if (!currentUser  || !currentUser.email) return;
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
      handleEmailVerification({ user: currentUser });
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
        router.push("/sign-in");
      }
    });
    return () => unsubscribe();
  }, [handleSignOut]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  useAutoLogout(24 * 60 * 60 * 1000);

  if (!currentUser && pathname.startsWith("/dashboard") && !adminRoutes.includes(pathname)) return <LoadingScreen />;
  return (
    <FirebaseAuthContext.Provider
      value={{
        state,
        ...state,
        setState,
        currentUser,
        handleSignIn,
        handleSignInWithGoogle,
        handleSignUp,
        handleSignOut,
        handleResetPassword,
        handleUpdatePassword,
        handleUpdateEmail,
        handleLinkEmailPasswordAccount,
        handleReauthenticate,
        handleDeleteUser,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export const useFirebaseAuthContext = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error("useFirebaseAuthContext must be used within an FirebaseAuthProvider");
  }
  return context;
};
