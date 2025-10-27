"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo } from "@/components/index";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { Card, CardHeader } from "@/components/ui/card";
import useUtil from "@/hooks/useUtil";

type ImagesProps = {
  id: string;
  url: string;
  title: string;
};

type StateProps = {
  id: string;
  title: string;
  description: string;
  images?: ImagesProps[];
  items?: { [key: string]: any }[];
};

const Template = ({ slug = "" }) => {
  const [state, setState] = useState<StateProps>({
    id: "",
    title: "",
    description: "",
    images: [],
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { fetchedPages, createContent, updateContent } = useFirebaseApiContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.id) {
      createContent({
        title: state.title,
        description: state.description,
        images: state.images,
        setIsLoading,
        slug,
      });
    } else {
      updateContent({
        id: state.id,
        title: state.title,
        description: state.description,
        images: state.images,
        setIsLoading,
        slug,
      });
    }
  };

  useEffect(() => {
    const id = fetchedPages.homePage.id;
    const { title, description, images } = fetchedPages.homePage.sections[slug];
    setState((prev) => ({
      ...prev,
      id,
      title,
      description,
      images,
    }));
  }, [fetchedPages]);

  // useEffect(() => {
  //   console.log(state, " state");
  // }, [state]);

  return (
    <div className="mb-[150px]">
      <Card>
        <CardHeader>
          <form action="" onSubmit={onSubmit}>
            <InputDemo
              label="Title"
              name="title"
              type="text"
              callback={(e) => onChange(e)}
              className="mb-5"
              value={state.title}
              //   inputClassName={true ? "is-invalid" : "is-valid"}
            />
            <InputDemo
              label="Description"
              name="description"
              type="text"
              callback={(e) => onChange(e)}
              className="mb-5"
              value={state.description}
              //   inputClassName={true ? "is-invalid" : "is-valid"}
            />
            {state.images &&
              state.images.map((item: ImagesProps) => {
                return <UploadImage key={item.id} {...item} state={state} setState={setState} />;
              })}

            {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
            <ButtonDemo
              text={`${isLoading ? "Updating..." : "Update"} `}
              className={`w-full`}
              disabled={isLoading}
              // variant="outline"
              // onClick={() => handleSignInWithGoogle({})}
            />
          </form>
        </CardHeader>
      </Card>
    </div>
  );
};

const UploadImage = ({
  id = "",
  url = "",
  state,
  setState,
}: {
  id: string;
  url: string;
  state: StateProps;
  setState: React.Dispatch<React.SetStateAction<StateProps>>;
}) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const { compressImage, convertToBase64 } = useUtil();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (!state.images) return;
      setUploadedImage(e.target.files[0]);

      const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(compressedBlob);

      let tempImages = [...state.images];
      tempImages = tempImages.map((item) => {
        if (item.id !== id) return { ...item };
        return {
          ...item,
          url: imageBase64,
        };
      });
      setState((prev) => ({ ...prev, images: tempImages }));
    }
  };

  return (
    <div className="flex justify-center items-center border-2 border-dashed border-input p-6 rounded-md mb-3">
      <label className="cursor-pointer text-gray-600 font-semibold text-sm">
        {uploadedImage ? (
          <div className="text-center">
            <img
              src={URL.createObjectURL(uploadedImage)}
              alt="uploaded"
              className="w-[300px] h-[200px] object-contain mb-3 mx-auto block "
            />
            {/* <p>Image Uploaded</p> */}
          </div>
        ) : (
          <div className="text-center">
            <img src={url} alt="" className="w-[300px] h-[200px] object-contain mb-3 mx-auto block" />
            {/* {plusImage} */}
            {/* <p>Click to upload image</p> */}
          </div>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
      </label>
    </div>
  );
};

export default Template;
