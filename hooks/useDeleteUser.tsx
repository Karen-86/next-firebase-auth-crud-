"use client";

import { useState } from "react";
import { deleteUserAction } from "@/app/actions/deleteUserAction";
import useAlert from "./useAlert";
import { auth } from "@/config/firebase";

export const useDeleteUser = () => {
  const { successAlert, errorAlert } = useAlert();

  const deleteUser = async ({ uid = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("User not authenticated.");

      const result = await deleteUserAction(idToken, uid);
      if (!result.success) throw new Error(result.error || "Failed to delete user.");

      successAlert("Account deleted successfully");
      callback();
      if (uid === auth.currentUser?.uid) await auth.signOut();
    } catch (err: any) {
      errorAlert(err.message || "Failed to delete account");
      console.error(err.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser };
};
