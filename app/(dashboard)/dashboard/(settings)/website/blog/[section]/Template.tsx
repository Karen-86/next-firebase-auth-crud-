"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, AccordionDemo } from "@/components/index";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { Card, CardHeader } from "@/components/ui/card";
import useUtil from "@/hooks/useUtil";
import { PlusIcon } from "lucide-react";
import localData from "@/localData";
import { v4 as uuidv4 } from "uuid";

const { placeholderImage } = localData.images;

const Template = ({ section = "" }) => {
  const { fetchedPages } = useFirebaseApiContext();

  const [filteredBlogList, setFilteredBlogList] = useState([]);
  const blogList = fetchedPages.blogPage.sections["blog-list"];

  useEffect(() => setFilteredBlogList(blogList), [fetchedPages]);

  const populateList = () => {
    setFilteredBlogList((prev): any => {
      return [
        ...prev,
        {
          id: uuidv4(),
          slug: `slug-${uuidv4()}`,
          title: "",
          description: "",
          images: [{ id: "1", title: "", url: placeholderImage }],
          isFeatured: true,
        },
      ];
    });
  };

  if (section !== "blog-list") return "not a blog list";
  return (
    <div className="blog-list mb-[150px]">
      {filteredBlogList.length ? (
        <AccordionDemo
          type="multiple"
          className=""
          itemClassName={`!border rounded-lg mb-[0.5rem] overflow-hidden`}
          triggerClassName="!rounded-none text-[16px] font-normal !no-underline p-4 hover:bg-slate-100 rounded-md"
          items={filteredBlogList.map((blogItem: any, index: any) => {
            return {
              itemClassName: blogItem.slug,
              trigger: blogItem.slug,
              content: <BlogItem key={index} {...{ blogItem, filteredBlogList }} />,
            };
          })}
        />
      ) : (
        <h2 className="text-3xl text-gray-300 mb-[1rem]">Empty</h2>
      )}

      {filteredBlogList.length === fetchedPages.blogPage.sections["blog-list"].length && (
        <ButtonDemo
          onClick={populateList}
          icon={<PlusIcon />}
          className="w-full min-h-[56px]"
          variant="outline"
          text="Create New Blog"
        />
      )}
    </div>
  );
};

type ImagesProps = {
  id: string;
  url: string;
  title: string;
};

type StateProps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images?: ImagesProps[];
};

const BlogItem = ({ blogItem = {}, filteredBlogList = [] }: any) => {
  const [state, setState] = useState<StateProps>({
    id: "",
    slug: "",
    title: "",
    description: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { fetchedPages, updateContentSubCollection } = useFirebaseApiContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContentSubCollection({
      collectionName: "website-content",
      documentId: "blog-page",
      subCollectionName: "blog",
      subDocumentId: state.id,
      setIsLoading,
      fields: {
        id: state.id,
        slug: state.slug,
        title: state.title,
        description: state.description,
        images: state.images,
      },
    });
  };

  useEffect(() => setState(blogItem), [blogItem]);

  // useEffect(() => {
  //   console.log(state, " state");
  // }, [state]);

  return (
    <div className="p-6">
      {/* <Card> */}
      {/* <CardHeader> */}
      <form action="" onSubmit={onSubmit}>
        <InputDemo
          label="Slug"
          name="slug"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.slug}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
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
          disabled={
            (filteredBlogList.find((item: any) => item.slug.trim() == state.slug.trim()) && state.slug !== blogItem.slug) ||
            !state.slug ||
            isLoading
          }
          // variant="outline"
          // onClick={() => handleSignInWithGoogle({})}
        />
      </form>
      {/* </CardHeader> */}
      {/* </Card> */}
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
