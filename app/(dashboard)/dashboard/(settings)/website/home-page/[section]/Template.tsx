"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, UploadImageDemo, FormSkeleton } from "@/components/index";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import { Card, CardHeader } from "@/components/ui/card";

type ImagesProps = {
  id: string;
  url: string;
  title: string;
};

type StateProps = {
  title: string;
  description: string;
  images?: ImagesProps[];
};

const Template = ({ section = "" }) => {
  const [state, setState] = useState<StateProps>({
    title: "",
    description: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { fetchedPages, updateContent } = useFirebaseApiContext();
  const { isLoading: isPageLoading } = fetchedPages;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      collectionName: "website-content",
      documentId: "home-page",
      section,
      title: state.title,
      description: state.description,
      images: state.images,
      setIsLoading,
    });
  };

  useEffect(() => {
    const { title, description, images } = fetchedPages["home-page"].sections[section];
    setState((prev) => ({
      ...prev,
      title,
      description,
      images,
    }));
  }, [fetchedPages]);

  return (
    <>
      {isPageLoading ? (
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

                {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
                <ButtonDemo text={`${isLoading ? "Updating..." : "Update"} `} className={`w-full`} disabled={isLoading} />
              </form>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
};

export default Template;
