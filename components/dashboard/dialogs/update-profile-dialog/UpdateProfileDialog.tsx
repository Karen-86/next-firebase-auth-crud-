"use client";

import React, {  useState } from "react";
import { useFirebaseAuthContext } from "@/context/FirebaseAuthContext";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { ButtonDemo,  DialogDemo,  CropAvatarDialog } from "@/components/index";
import useUtil from "@/hooks/useUtil";
import localData from "@/localData";

const {  avatarPlaceholderImage } = localData.images;

// UPDATE PROFILE
type StateProps = {
  isAvatarRemoved: boolean;
  newAvatar: string;
};

const UpdateProfileDialog = () => {
  return (
    <DialogDemo
      contentClassName="gap-0 py-4"
      trigger={<ButtonDemo text={`${"Update Profile"}`} className={``} size="xs" variant="ghost" />}
    >
      {(closeDialog) => <UpdateProfileContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const UpdateProfileContent = ({ closeDialog = () => {} }) => {
  const { fetchedCurrentUser, updateUser, updateUserCollection, getUser, getUserCollection } = useFirebaseApiContext();
  const { convertToBase64, resizeBase64Image } = useUtil();
  const { details } = fetchedCurrentUser;

  const [state, setState] = useState<StateProps>({
    isAvatarRemoved: false,
    newAvatar: details.base64PhotoURL || details.photoURL || avatarPlaceholderImage,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useFirebaseAuthContext();

  const [src, setSrc] = useState("");
  const [croppedImageSrc, setCroppedImageSrc] = useState("");

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0]);
      setSrc(imageBase64);

      e.target.value = "";
    }
  };

  const onSubmit = () => {
    const updatedFields: { [key: string]: any } = {};

    if (state.newAvatar !== avatarPlaceholderImage) {
      updatedFields.base64PhotoURL = state.newAvatar;
    }
    if (state.isAvatarRemoved) {
      updatedFields.base64PhotoURL = "";
      // updatedFields.photoURL = "";
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

  return (
    <div>
      <CropAvatarDialog
        src={src}
        setSrc={setSrc}
        croppedImageSrc={croppedImageSrc}
        setCroppedImageSrc={setCroppedImageSrc}
        setState={setState}
      />

      <h2 className="text-xs !font-semibold mb-[1.5rem]">Update Profile</h2>
      <div className="grid grid-cols-[auto_1fr] gap-5 mb-[1.5rem]">
        <div className="avatar-options avatar w-[48px]">
          <div className="  w-[100%] h-0 pt-[100%] relative rounded-full  shadow-[0_0_6px_rgba(0,0,0,0.3)] overflow-hidden ">
            <img src={state.newAvatar} className="block absolute bg-gray-50 top-0 left-0 w-full h-full object-cover" alt="" />
            {/* <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] pointer-events-none"></div> */}
          </div>
        </div>
        <div>
          <div className="flex  gap-1 mb-[0.3rem]">
            <ButtonDemo
              text="Upload"
              variant="outline"
              size="xs"
              onClick={() => {
                const input = document.querySelector("#upload-avatar") as HTMLInputElement | null;
                input?.click();
              }}
            />
            <input id="upload-avatar" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
            {/* {state.newAvatar !== avatarPlaceholderImage && !state.isAvatarRemoved && ( */}
            <ButtonDemo
              text="Remove"
              variant="ghostDanger"
              size="xs"
              className=""
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  isAvatarRemoved: true,
                  newAvatar: avatarPlaceholderImage,
                }));
              }}
            />
            {/* )} */}
          </div>
          <p className="text-gray-500 text-xs">Recommended size 1:1, up to 10MB</p>
        </div>
      </div>
      <div className="button-group flex gap-2 justify-end">
        <ButtonDemo
          className=""
          size="xs"
          text="Cancel"
          variant="ghost"
          type="button"
          onClick={() => {
            closeDialog();
          }}
        />
        <ButtonDemo
          className=""
          size="xs"
          text={`${isLoading ? "Loading..." : "Save"}`}
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
    </div>
  );
};

export default UpdateProfileDialog;