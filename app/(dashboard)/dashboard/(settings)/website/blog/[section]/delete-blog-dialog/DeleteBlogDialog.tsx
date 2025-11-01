"use client";

import React, { useState, useEffect } from "react";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { DialogDemo, ButtonDemo, InputDemo } from "@/components/index";

export default function DeleteBlogDialog({ id = "" }) {
  return (
    <DialogDemo contentClassName="" trigger={<ButtonDemo text={`${"Delete Blog"}`} className={`w-full mt-2`} variant="outlineDanger" />}>
      {(closeDialog) => <DeleteBlogDialogContent id={id} closeDialog={closeDialog} />}
    </DialogDemo>
  );
}

const DeleteBlogDialogContent = ({ id = "", closeDialog = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { deleteContentSubCollection } = useFirebaseApiContext();

  const onDelete = (e: any) => {
    e.preventDefault();

    deleteContentSubCollection({
      collectionName: "website-content",
      documentId: "blog-page",
      subCollectionName: "blog",
      subDocumentId: id,
      setIsLoading,
    });
  };

  return (
    <div className="delete-blog-dialog">
      <h2 className="text-2xl font-semibold! mb-5">Delete blog</h2>
      <p className="text-sm text-gray-500 mb-6 leading-[1.6]">Are you sure you want to delete this blog?</p>

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
          variant="outlineDanger"
          text={`${isLoading ? "Deleting..." : "Delete"} `}
          onClick={onDelete}
          className={``}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
