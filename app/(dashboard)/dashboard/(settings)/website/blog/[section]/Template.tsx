"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, AccordionDemo, RichTextEditorDemo, UploadImageDemo, BlogFormSkeleton } from "@/components/index";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { PlusIcon } from "lucide-react";
import localData from "@/localData";
import { v4 as uuidv4 } from "uuid";

const { placeholderImage } = localData.images;

const Template = ({ section = "" }) => {
  const { fetchedPages } = useFirebaseApiContext();
  const { isLoading: isPageLoading } = fetchedPages;
  const { isLoading } = fetchedPages;

  console.log(fetchedPages)
  const [filteredBlogList, setFilteredBlogList] = useState([]);
  const blogList = fetchedPages['blog-page'].sections["blog-list"];

  useEffect(() =>{ setFilteredBlogList(blogList)}, [fetchedPages]);
  
  const populateList = () => {
    setFilteredBlogList((prev): any => {
      return [
        ...prev,
        {
          id: uuidv4(),
          slug: `${uuidv4()}`,
          title: "",
          description: "",
          images: [{ id: "1", title: "", url: placeholderImage }],
          isFeatured: true,
          isNewBlog: true,
        },
      ];
    });
  };

  if (section !== "blog-list") return "not a blog list";
  return (
    <>
      {isPageLoading ? (
        <BlogFormSkeleton />
      ) : (
        <div className="blog-list mb-[150px]">
          {filteredBlogList.length ? (
            <AccordionDemo
              type="multiple"
              className=""
              itemClassName={`!border rounded-md mb-[0.5rem] overflow-hidden`}
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
            <h2 className="text-3xl text-gray-300 mb-4">Empty</h2>
          )}

          {filteredBlogList.length === fetchedPages['blog-page'].sections["blog-list"].length && (
            <ButtonDemo
              disabled={isLoading}
              onClick={populateList}
              icon={<PlusIcon />}
              className="w-full min-h-14"
              variant="secondary"
              text="Create New Blog"
            />
          )}
        </div>
      )}
    </>
  );
};

type ImagesProps = {
  id: string;
  url: string;
  title: string;
};

type StateProps = {
  slug: string;
  title: string;
  description: string;
  content: string;
  editorState: any;
  images?: ImagesProps[];
};

import { initialValue } from "@/components/rich-text-editor/RichTextEditorDemo";

const BlogItem = ({ blogItem = {}, filteredBlogList = [] }: any) => {
  const [state, setState] = useState<StateProps>({
    slug: "",
    title: "",
    description: "",
    content: "",
    editorState: null,
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
      subDocumentId: state.slug,
      setIsLoading,
      fields: {
        slug: state.slug,
        title: state.title,
        description: state.description,
        content: state.content,
        editorState: JSON.stringify(state.editorState),
        images: state.images,
      },
    });
  };

  useEffect(() => {
    const tempState = { ...blogItem, editorState: (blogItem.editorState && JSON.parse(blogItem.editorState)) || initialValue };
    setState(tempState);
  }, [blogItem]);

  return (
    <div className="p-4">
      <form action="" onSubmit={onSubmit}>
        <InputDemo
          label="Slug"
          name="slug"
          type="text"
          callback={(e) => onChange(e)}
          className={`cursor-not-allowed ${!blogItem.isNewBlog ? 'cursor-not-allowed':''} mb-5`}
          value={state.slug}
          disabled={!blogItem.isNewBlog}
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
            return <UploadImageDemo key={item.id} {...item} state={state} setState={setState} />;
          })}

        {state.editorState && <RichTextEditorDemo state={state} setState={setState} className="mb-5" label="Content" />}

        {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
        <ButtonDemo
          text={`${isLoading ? (blogItem.isNewBlog ? "Creating..." : "Updating...") : blogItem.isNewBlog ? "Create" : "Update"} `}
          className={`w-full`}
          disabled={
            (filteredBlogList.find((item: any) => item.slug.trim() == state.slug.trim()) && state.slug !== blogItem.slug) ||
            !state.slug ||
            isLoading
          }
        />
      </form>
    </div>
  );
};

export default Template;
