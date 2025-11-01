"use client";

import React, { useState, useEffect } from "react";
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";

export const DeleteUserDialog = ({ uid = "" }) => {
  return (
    <DialogDemo contentClassName="" trigger={<div>{`${"Remove User"}`}</div>}>
      {(closeDialog) => <DeleteUserDialogContent uid={uid} closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const DeleteUserDialogContent = ({ uid = "", closeDialog = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { getUsers } = useFirebaseApiContext();
  const { handleDeleteUser } = useFirebaseAuthContext();

  return (
    <div className="delete-user-dialog">
      <h2 className="text-2xl font-semibold! mb-5">Delete account</h2>
      <p className="text-sm text-gray-500 mb-6 leading-[1.6]">
        Are you sure you want to delete this user? This will permanently remove the user's account.{" "}
        <span className="text-red-400">This action cannot be undone.</span>
      </p>
      <span className="text-sm mb-1 block">Type "Delete account" below to continue.</span>
      <InputDemo
        // label={<span className="select-text">Type "Delete account" below to continue.</span>}
        placeholder="Delete account"
        name="password"
        type="text"
        callback={(e) => setConfirmationText(e.target.value)}
        className="mb-8"
        value={confirmationText}
      />

      <div className="button-group flex gap-2 justify-end">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
          }}
          disabled={isLoading}
        />

        <ButtonDemo
          className=""
          text={`${isLoading ? "Loading..." : "Delete Account"}`}
          variant="destructive"
          // disabled={!password || isLoading}
          disabled={confirmationText !== "Delete account" || isLoading}
          onClick={() => {
            if (uid) {
              handleDeleteUser({
                uid: uid,
                setIsLoading,
                callback: () => {
                  closeDialog();
                  setTimeout(() => getUsers({}), 1000);
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
};
