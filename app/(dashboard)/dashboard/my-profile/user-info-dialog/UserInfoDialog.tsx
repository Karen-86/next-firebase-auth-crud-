"use client";

import React, { useState, useEffect } from "react";
import {

  ButtonDemo,
  DialogDemo,
  InputDemo,
} from "@/components/index";
import localData from "@/localData";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Settings, Pencil, Expand } from "lucide-react";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import useUtil from "@/hooks/useUtil";

type StateProps = {
  inGameID: string;
};

const UserInfoDialog = () => {
  return (
    <DialogDemo
      contentClassName="sm:max-w-[600px]"
      title="User information"
      description="Manage your personal data."
      trigger={
        <ButtonDemo startIcon={<Pencil />} className="rounded-full w-[35px] h-[35px]" variant="ghost" />
      }
    >
      {(closeDialog) => <UserInfoDialogContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const UserInfoDialogContent = ({ closeDialog = () => {} }) => {
  const [state, setState] = useState<StateProps>({
    inGameID: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { fetchedPages, fetchedCurrentUser, updateUser, getUser } = useFirebaseApiContext();
  const { currentUser } = useFirebaseAuthContext();
  const { details } = fetchedCurrentUser;

  const { formatWithCommas, unformatFromCommas } = useUtil();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const raw = unformatFromCommas(value);
    if (!/^\d*$/.test(raw)) return; // prevent non-numeric
    setState((prev) => ({
      ...prev,
      [name]: formatWithCommas(raw),
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: { [key: string]: any } = {};

    if (state.inGameID !== details.inGameID) {
      updatedFields.inGameID = state.inGameID;
    }

    updateUser({
      id: currentUser?.uid,
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
      name: details.displayName || "",
      inGameID: details.inGameID || "",
    }));
  }, [fetchedCurrentUser]);

  return (
    <div>
      <br />
      <form action="" onSubmit={onSubmit} className="">
        <div className="wrapper grid grid-cols-1 sm:grid-cols-2 gap-x-7  mb-3">
          <InputDemo
            label="In-Game ID"
            placeholder="e.g., John Doe"
            name="inGameID"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.inGameID}
          />

        </div>

        <div className="button-group flex gap-2 justify-end">
          <ButtonDemo className="" text="Cancel" variant="outline" type="button" onClick={closeDialog} />
          <ButtonDemo className="" text={`${isLoading ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  );
};

export default UserInfoDialog;
