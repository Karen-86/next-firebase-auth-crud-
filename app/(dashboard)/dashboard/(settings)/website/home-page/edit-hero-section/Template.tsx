"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, UploadImageDemo, FormSkeleton } from "@/components/index";
import { Card, CardHeader } from "@/components/ui/card";
import { useSectionsContext } from "@/context/api/SectionsContext";
import localData from "@/localData";
import { Section } from "@/types";

const { placeholderImage } = localData.images;

const Template = () => {
  const [state, setState] = useState<Section>({
    status: "draft",
    title: "",
    description: "",
    sectionName: "",
    images: [{ id: "1", title: "", url: placeholderImage }],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSectionEmpty, setIsSectionEmpty] = useState(false);
  const { fetchedSection, getSection, createSection, updateSection } = useSectionsContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSectionEmpty) {
      createSection({
        sectionId: "hero",
        setIsLoading: setIsEditing,
        fields: {
          status: state.status,
          sectionName: state.sectionName,
          title: state.title,
          description: state.description,
          images: state.images,
        },
      });
    } else {
      const data = fetchedSection.data;
      
      updateSection({
        sectionId: "hero",
        setIsLoading: setIsEditing,
        fields: {
          ...(state.status !== data.status ? { status: state.status } : {}),
          ...(state.sectionName !== data.sectionName ? { sectionName: state.sectionName } : {}),
          ...(state.title !== data.title ? { title: state.title } : {}),
          ...(state.description !== data.description ? { description: state.description } : {}),
          images: state.images,
        },
      });
    }
  };

  useEffect(() => {
    getSection({ sectionId: "hero" });
  }, []);

  useEffect(() => {
    setIsSectionEmpty(!Object.keys(fetchedSection.data).length);
    if (!Object.keys(fetchedSection.data).length) return;
    const { title = "", description = "", images } = fetchedSection.data;
    setState((prev) => ({
      ...prev,
      title,
      description,
      images,
    }));
  }, [fetchedSection]);

  return (
    <>
      {fetchedSection.isLoading ? (
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
                  placeholder="Enter Title"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                <InputDemo
                  label="Description"
                  name="description"
                  type="text"
                  callback={(e) => onChange(e)}
                  className="mb-5"
                  value={state.description}
                  placeholder="Enter Description"
                  //   inputClassName={true ? "is-invalid" : "is-valid"}
                />
                {state.images &&
                  state?.images?.map((item: { [key: string]: string }) => {
                    return <UploadImageDemo key={item.id} {...item} state={state} setState={setState} />;
                  })}

                {/* {state.items &&
              state.items.map((item: { [key: string]: any }) => {
                return <div>fdsf</div>;
              })} */}
                <ButtonDemo
                  text={`${
                    isEditing ? (isSectionEmpty ? "Creating..." : "Updating...") : isSectionEmpty ? "Create" : "Update"
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
