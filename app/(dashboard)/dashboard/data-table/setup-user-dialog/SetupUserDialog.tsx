"use client";

import React, { useState, useEffect } from "react";
import {
  ButtonDemo,
  DialogDemo,
  InputDemo,
  SelectDemo,
  // SelectScrollable
} from "@/components/index";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";

export const SetupUserDialog = ({ user = {} }) => {
  return (
    <DialogDemo contentClassName="" trigger={<div>{`${"Edit Settings"}`}</div>}>
      {(closeDialog) => <SetupUserDialogContent user={user} closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

type StateProps = {
  role: string;
};

const SetupUserDialogContent = ({ user = {}, closeDialog = () => {} }: { user: any; closeDialog: () => void }) => {
  const { updateUser, getUser } = useFirebaseApiContext();
  const { currentUser } = useFirebaseAuthContext();

  const [state, setState] = useState<StateProps>({
    role: user.role,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: { [key: string]: any } = {};

    if (state.role !== user.role) {
      updatedFields.role = state.role;
    }

    updateUser({
      id: user.id,
      updatedFields,
      setIsLoading,
      callback: () => {
        closeDialog();
        getUser({ id: currentUser?.uid });
      },
    });
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      role: user.role,
    }));
  }, [user]);

  return (
    <div className="crop-avatar-dialog">
      <h2 className="text-2xl !font-semibold mb-5">Change user settings</h2>
      <form onSubmit={onSubmit} className={`${""}`}>
        {currentUser?.uid !== user.id && (
          <SelectDemo
            label="Select"
            defaultItems={["user", "admin"].map((role) => {
              return {
                label: role,
                value: role,
                isSelected: state.role == role,
              };
            })}
          callback={({value}) => {
              setState((prev) => ({
                ...prev,
                role: value.toString(),
              }));
            }}
            className="mb-5"
            contentClassName={`custom-content`}
          />
        )}

        {/* {currentUser?.uid !== user.id && (
          <SelectScrollable
            label="Role"
            triggerClassName="w-full mb-5"
            contentClassName=""
            defaultItems={["user", "admin"].map((type) => {
              return {
                label: type,
                value: type,
                isSelected: user.role == type,
              };
            })}
            callback={(selectedItem) => {
              setState((prev) => ({
                ...prev,
                role: selectedItem.value.toString(),
              }));
            }}
          />
        )} */}

        <div className="button-group flex gap-2 justify-end">
          <ButtonDemo className="" text="Cancel" variant="outline" type="button" onClick={closeDialog} />
          <ButtonDemo className="" text={`${isLoading ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  );
};
