"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, UploadImageDemo, FormSkeleton } from "@/components/index";
import { Card, CardHeader } from "@/components/ui/card";
import { usePagesContext } from "@/context/api/PagesContext";
import { Page } from "@/types";

const Template = () => {
  const [state, setState] = useState<Page>({
    status: "draft",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isPageEmpty, setIsSectionEmpty] = useState(false);
  const { fetchedPage, getPage, createPage, updatePage } = usePagesContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPageEmpty) {
      createPage({
        pageId: "home",
        setIsLoading: setIsEditing,
        fields: {
          status: state.status,
          slug: state.slug,
          metadata: {
            metaTitle: state.metaTitle,
            metaDescription: state.metaDescription,
          },
        },
      });
    } else {
      const data = fetchedPage.data;
      
      updatePage({
        pageId: "home",
        setIsLoading: setIsEditing,
        fields: {
          ...(state.status !== data.status ? { status: state.status } : {}),
          ...(state.slug !== data.slug ? { slug: state.slug } : {}),
          metadata: {
            ...(state.metaTitle !== data.metaTitle ? { metaTitle: state.metaTitle } : {}),
            ...(state.metaDescription !== data.metaDescription ? { metaDescription: state.metaDescription } : {}),
          },
        },
      });
    }
  };

  useEffect(() => {
    getPage({ pageId: "home" });
  }, []);

  useEffect(() => {
    setIsSectionEmpty(!Object.keys(fetchedPage.data).length);
    if (!Object.keys(fetchedPage.data).length) return;
    const { slug = "", metadata = {} } = fetchedPage.data;
    setState((prev) => ({
      ...prev,
      slug,
      metaTitle: metadata.metaTitle,
      metaDescription: metadata.metaDescription,
    }));
  }, [fetchedPage]);

  return (
    <>
      {fetchedPage.isLoading ? (
        <Card>
          <CardHeader>
            <FormSkeleton />
          </CardHeader>
        </Card>
      ) : (
        <div className="mb-[150px]">
          <Card>
            <CardHeader>
              <form action="" onSubmit={onSubmit}>
                <InputDemo
                  label="Slug"
                  name="slug"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.slug}
                  placeholder="Enter the page slug"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Meta Title"
                  name="metaTitle"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.metaTitle}
                  placeholder="Shown in search engines and browser tabs (50–60 chars)"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Meta Description"
                  name="metaDescription"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.metaDescription}
                  placeholder="Meta description for SEO and social previews (140–160 chars)"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />

                <ButtonDemo
                  text={`${
                    isEditing ? (isPageEmpty ? "Creating..." : "Updating...") : isPageEmpty ? "Create" : "Update"
                  } `}
                  className={`w-full`}
                  disabled={isEditing}
                />
              </form>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
};

export default Template;
