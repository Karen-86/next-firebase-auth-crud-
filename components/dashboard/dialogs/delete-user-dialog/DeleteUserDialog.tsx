"use client";

import React, { useState, useEffect } from "react";
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index";
// import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";

 const DeleteUserDialog = ({ id = "" }) => {
  return (
    <DialogDemo
      contentClassName="pt-4 pb-6"
      trigger={
        <ButtonDemo text={`${"Delete Account"}`}  className={``} size='xs' variant="ghostDanger" />
      }
    >
      {(closeDialog) => <DeleteUserDialogContent id={id} closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const DeleteUserDialogContent = ({ id = "", closeDialog = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  // const { deleteAccount } = useDeleteAccount();

  const { currentUser } = useFirebaseAuthContext();

  // const handleFullUserDelete = () => {
  //   // handleDeleteUser({ id: id, password, setIsLoading });
  //   deleteAccount({ setIsLoading });
  // };

  const { deleteUser} = useDeleteUser();

  return (
    <div className="delete-user-dialog text-xs">
      <h2 className="text-xs !font-semibold mb-5">Delete account</h2>
      <p className=" text-gray-500 mb-6 leading-[1.6]">
        Are you sure you want to delete your account? This will permanently remove your account and all related data.{" "}
        <span className="text-red-400">This action cannot be undone.</span>
      </p>
      <div className="font-semibold mb-2">Type "Delete account" below to continue.</div>
      <InputDemo
        // label={<span className="select-text">Type "Delete account" below to continue.</span>}
        placeholder="Delete account"
        name="password"
        type="text"
        callback={(e) => setConfirmationText(e.target.value)}
        className="mb-5"
        inputClassName="!text-xs"
        value={confirmationText}
      />

      <div className="button-group flex gap-2 justify-end">
        <ButtonDemo
          className=""
          text="Cancel"
          size='xs'
          variant="ghost"
          type="button"
          onClick={() => {
            closeDialog();
          }}
          disabled={isLoading}
        />

        <ButtonDemo
          className=""
          text={`${isLoading ? "Loading..." : "Delete Account"}`}
          size='xs'
          variant="destructive"
          // disabled={!password || isLoading}
          disabled={confirmationText !== "Delete account" || isLoading}
          onClick={() => {
            if (currentUser) deleteUser({uid:currentUser.uid,setIsLoading});
          }}
        />
      </div>
    </div>
  );
};


export default DeleteUserDialog;