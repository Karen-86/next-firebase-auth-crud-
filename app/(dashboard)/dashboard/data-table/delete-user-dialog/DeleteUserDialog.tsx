// old version delete after some time
// "use client";

// import React, { useState, useEffect } from "react";
// import { ButtonDemo, DialogDemo, DropdownMenuDemo } from "@/components/index";
// import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
// import { useDeleteAccount } from "@/hooks/useDeleteAccount";

// export const DeleteUserDialog = ({ id = "" }) => {
//   return (
//     <DialogDemo contentClassName="" trigger={<div>{`${"Remove User"}`}</div>}>
//       {(closeDialog) => <DeleteUserDialogContent id={id} closeDialog={closeDialog} />}
//     </DialogDemo>
//   );
// };

// const DeleteUserDialogContent = ({ id = "", closeDialog = () => {} }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   // const { updateUser, getUsers } = useFirebaseApiContext();
//   const { deleteAccount } = useDeleteAccount();

//   // const handleDeleteUser = (id = "") => {
//   //   const updatedFields: { [key: string]: any } = {};

//   //   updatedFields.isDeleted = true;

//   //   updateUser({
//   //     id: id,
//   //     updatedFields,
//   //     setIsLoading,
//   //     callback: () => {
//   //       getUsers({})
//   //       closeDialog();
//   //     },
//   //   });
//   // };

//   const handleFullUserDelete =  () => {
//     deleteAccount({ setIsLoading });
//   };

//   return (
//     <div className="crop-avatar-dialog">
//       <h2 className="text-2xl text-center mb-5 max-w-[300px] mx-auto">Are you sure you want to delete this user?</h2>
//       <br />
//       <br />

//       <div className="button-group flex gap-2 justify-end">
//         <ButtonDemo
//           className=""
//           text="Cancel"
//           variant="outline"
//           type="button"
//           onClick={() => {
//             closeDialog();
//           }}
//           disabled={isLoading}
//         />
//         <ButtonDemo
//           className=""
//           text={`${isLoading ? "Loading..." : "Submit"}`}
//           variant="destructive"
//           disabled={isLoading}
//           onClick={() => {
//             handleFullUserDelete()
//           }}
//         />
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useState, useEffect } from "react";
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index";
// import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";

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

  const { deleteUser } = useDeleteUser();

  return (
    <div className="delete-user-dialog">
      <h2 className="text-2xl !font-semibold mb-5">Delete account</h2>
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
              deleteUser({
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
