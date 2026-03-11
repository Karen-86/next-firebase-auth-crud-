"use client";

import React, { useState, useEffect } from "react";
import {
  InputDemo,
  ButtonDemo,
  AccordionDemo,
  RichTextEditorDemo,
  UploadImageDemo,
  BlogFormSkeleton,
} from "@/components/index";
import { PlusIcon } from "lucide-react";
import localData from "@/localData";
import { v4 as uuidv4 } from "uuid";
import DeleteBlogDialog from "./delete-blog-dialog/DeleteBlogDialog";
import { useBlogsContext } from "@/context/api/BlogsContext";
import { initialValue } from "@/components/rich-text-editor/RichTextEditorDemo";
import { Blog } from "@/types";

const { placeholderImage } = localData.images;

const Template = () => {
  const { fetchedBlogs, getBlogs } = useBlogsContext();
  const { isLoading } = fetchedBlogs;

  const [filteredBlogs, setFilteredBlogs] = useState<{ [key: string]: any }[]>([]);

  useEffect(() => {
    getBlogs()
  },[])

  useEffect(() => {
    setFilteredBlogs(fetchedBlogs.data);
  }, [fetchedBlogs]);

  const populateList = () => {
    setFilteredBlogs((prev): any => {
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

  return (
    <>
      {isLoading ? (
        <BlogFormSkeleton />
      ) : (
        <div className="blog-list mb-[150px]">
          {filteredBlogs.length ? (
            <AccordionDemo
              type="multiple"
              className=""
              itemClassName={`!border rounded-md mb-[0.5rem] overflow-hidden`}
              triggerClassName="!rounded-none text-[14px] font-normal !no-underline p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-md"
              items={filteredBlogs.map((blogItem: any, index: any) => {
                return {
                  itemClassName: blogItem.slug,
                  trigger: (
                    <div className="flex items-center w-full">
                      <div className="flex-1">
                        <span className="text-dark min-w-[150px] truncate"> {blogItem.title}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{blogItem.slug}</div>{" "}
                    </div>
                  ),
                  content: <BlogItem key={index} {...{ blogItem, filteredBlogs }} />,
                };
              })}
            />
          ) : (
            <h2 className="text-3xl text-gray-300 mb-4">Empty</h2>
          )}

          {filteredBlogs.length === fetchedBlogs.data.length && (
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

const BlogItem = ({ blogItem = {}, filteredBlogs = [] }: any) => {
  const [state, setState] = useState<Blog>({
    status: "draft",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    title: "",
    shortDescription: "",
    description: "",
    content: "",
    editorState: null,
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createBlog, updateBlog } = useBlogsContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (blogItem.isNewBlog) {
      createBlog({
        blogId: state.slug,
        setIsLoading,
        fields: {
          status: state.status,
          slug: state.slug,
          metaTitle: state.metaTitle,
          metaDescription: state.metaDescription,
          title: state.title,
          shortDescription: state.shortDescription,
          description: state.description,
          content: state.content,
          editorState: JSON.stringify(state.editorState),
          images: state.images,
        },
      });
      return;
    } else {
      updateBlog({
        blogId: state.slug,
        setIsLoading,
        fields: {
          ...(state.status !== blogItem.status ? { status: state.status } : {}),
          ...(state.slug !== blogItem.slug ? { slug: state.slug } : {}),
          ...(state.metaTitle !== blogItem.metaTitle ? { metaTitle: state.metaTitle } : {}),
          ...(state.metaDescription !== blogItem.metaDescription ? { metaDescription: state.metaDescription } : {}),
          ...(state.title !== blogItem.title ? { title: state.title } : {}),
          ...(state.shortDescription !== blogItem.shortDescription ? { shortDescription: state.shortDescription } : {}),
          ...(state.description !== blogItem.description ? { description: state.description } : {}),
          ...(state.content !== blogItem.content ? { content: state.content } : {}),
          ...(state.editorState !== blogItem.editorState ? { editorState: JSON.stringify(state.editorState) } : {}),
          images: state.images,
        },
      });
    }
  };

  useEffect(() => {
    // if blog-page document dont exist in firebase the input values may go from defined to undefined throwing error, so just add here "if(!Object.values(blogItem).length) return"
    const tempState = {
      ...blogItem,
      editorState: (blogItem.editorState && JSON.parse(blogItem.editorState)) || initialValue,
    };
    setState((prev) => ({ ...prev, ...tempState }));
  }, [blogItem]);

  return (
    <div className="p-4">
      <form action="" onSubmit={onSubmit} className="">
        <InputDemo
          label="Slug"
          name="slug"
          type="text"
          callback={(e) => onChange(e)}
          className={`cursor-not-allowed ${!blogItem.isNewBlog ? "cursor-not-allowed" : ""} mb-5`}
          value={state.slug}
          disabled={!blogItem.isNewBlog}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Meta Title"
          name="metaTitle"
          placeholder="Shown in search engines and browser tabs (50–60 chars)"
          type="text"
          callback={(e) => onChange(e)}
          className={` mb-5`}
          value={state.metaTitle}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Meta Description"
          name="metaDescription"
          placeholder="Meta description for SEO and social previews (140–160 chars)"
          type="text"
          callback={(e) => onChange(e)}
          className={` mb-5`}
          value={state.metaDescription}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Title"
          name="title"
          placeholder="Enter the blog title"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.title}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Short Description"
          name="shortDescription"
          placeholder="A brief summary (1–2 sentences)"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.shortDescription}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        <InputDemo
          label="Description"
          name="description"
          placeholder="Detailed description or excerpt"
          type="text"
          callback={(e) => onChange(e)}
          className="mb-5"
          value={state.description}
          //   inputClassName={true ? "is-invalid" : "is-valid"}
        />
        {state.images &&
          state.images.map((item: { [key: string]: string }) => {
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
            (filteredBlogs.find((item: any) => item.slug.trim() == state.slug.trim()) &&
              state.slug !== blogItem.slug) ||
            !state.slug ||
            isLoading
          }
        />
      </form>
      {!blogItem.isNewBlog && <DeleteBlogDialog id={state.slug} />}
    </div>
  );
};

export default Template;
