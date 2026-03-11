"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase/config/firebase";
import { collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useAlert from "@/hooks/useAlert";
import { useAuthContext } from "./AuthContext";
import * as blogsApi from "@/lib/api/blogs.js";

type FetchedBlogsProps = {
  isLoading: boolean;
  data: { [key: string]: any }[];
};

type FetchedBlogProps = {
  isLoading: boolean;
  data: {};
};

type BlogsContextType = {
  fetchedBlogs: FetchedBlogsProps;
  fetchedBlog: FetchedBlogProps;

  getBlogs: (params?: any) => void;
  getBlog: (params?: any) => void;
  createBlog: (params?: any) => void;
  updateBlog: (params?: any) => void;
  deleteBlog: (params?: any) => void;
};

export const BlogsContext = createContext<BlogsContextType | null>(null);

export default function BlogsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { successAlert, errorAlert, warningAlert } = useAlert();

  const [fetchedBlogs, setFetchedBlogs] = useState<FetchedBlogsProps>({
    isLoading: false,
    data: [],
  });

  const [fetchedBlog, setFetchedBlog] = useState<FetchedBlogProps>({
    isLoading: false,
    data: [],
  });

  
  // CLIENT SDK
  // =======================================================================================
  // const blogsRef = collection(db, "blogs");

  // const { currentUser } = useAuthContext();

  // const getBlogs = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
  //   setIsLoading(true);
  //   setFetchedBlogs((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const blogsSnap = await getDocs(blogsRef);
  //     const data = blogsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     console.log(data,'kkkkkkkkkkkkkkkk')
  //     setFetchedBlogs((prev) => ({ ...prev, isLoading: false, data }));
  //   } catch (err: any) {
  //     // if (err.message == "Missing or insufficient permissions.") {
  //     //   console.warn(err, "=getBlogs= request warning");
  //     //   return;
  //     // }
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getBlogs= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedBlogs((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  // const getBlog = async ({ blogId = "", setIsLoading = (_: boolean) => {} }) => {
  //   setIsLoading(true);
  //   setFetchedBlog((prev) => ({ ...prev, isLoading: true }));
  //   try {
  //     const blogRef = doc(blogsRef, blogId);
  //     const blogSnap = await getDoc(blogRef);

  //     if (!blogSnap.exists()) throw new Error("Document not found");

  //     const data: any = {  ...blogSnap.data() };
  //     const { createdAt, updatedAt, ...rest } = data

  //     setFetchedBlog(rest);
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=getBlog= request error");
  //   } finally {
  //     setIsLoading(false);
  //     setFetchedBlog((prev) => ({ ...prev, isLoading: false }));
  //   }
  // };

  // const createBlog = async ({ slug = "", setIsLoading = (_: boolean) => {}, ...fields }) => {
  //   setIsLoading(true);

  //   const filteredData = {
  //     [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
  //     createdAt: serverTimestamp(),
  //     updatedAt: serverTimestamp(),
  //     // createdAt: new Date(),
  //     // updatedAt: new Date(),
  //   };

  //   try {
  //     const docRef = await addDoc(blogsRef, filteredData);
  //     getBlogs();
  //     successAlert("Content has been created successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=createContent= request error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const updateBlog = async ({ blogId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);

  //   try {
  //     const blogRef = doc(blogsRef, blogId);
  //     const blogSnap = await getDoc(blogRef);

  //     const filteredData: any = {
  //       ...fields,
  //       updatedAt: serverTimestamp(),
  //     };

  //     if (!blogSnap.exists()) {
  //       filteredData.userId = currentUser?.uid;
  //       filteredData.createdAt = serverTimestamp();
  //     }
  //     await setDoc(blogRef, filteredData, { merge: true }); //recommended option, if collection dont exist it will create, if exist it will update, also you control id name

  //     getBlogs();
  //     successAlert("Content has been updated successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=updateBlog= request error");
  //   }
  //   setIsLoading(false);
  //   callback();
  // };

  // const deleteBlog = async ({ blogId = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
  //   setIsLoading(true);

  //   try {
  //     const blogRef = doc(blogsRef, blogId);
  //     const blogSnap = await getDoc(blogRef);
  //     if (!blogSnap.exists()) throw new Error("Document not found.");

  //     await deleteDoc(blogRef);
  //     getBlogs();
  //     successAlert("Content has been deleted successfully.");
  //   } catch (err: any) {
  //     errorAlert(err.message || "Internal server error. Please try again later.");
  //     console.error(err, "=deleteBlog= request error");
  //   }
  //   setIsLoading(false);
  //   callback();
  // };

  // ADMIN SDK
  // =======================================================================================

  const getBlogs = async ({ setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedBlogs((prev) => ({ ...prev, isLoading: true }));

    const data = await blogsApi.getBlogs();

    setIsLoading(false);
    setFetchedBlogs((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return errorAlert(data.message);
    console.log(data, " data-blogs");

    setFetchedBlogs((prev) => ({ ...prev, isLoading: false, data: data.data }));
  };

  const getBlog = async ({ blogId = "", setIsLoading = (_: boolean) => {} } = {}) => {
    setIsLoading(true);
    setFetchedBlog((prev) => ({ ...prev, isLoading: true }));

    const data = await blogsApi.getBlog({ id: blogId });

    setIsLoading(false);
    setFetchedBlog((prev) => ({ ...prev, isLoading: false }));

    if (!data.success) return ;
    console.log(data, " data-blog");

    setFetchedBlog((prev) => ({ ...prev, isLoading: false, data: data.data }));
  };

  const createBlog = async ({ blogId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    const data = await blogsApi.createBlog({ id: blogId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-blog");
    getBlogs();
    successAlert(data.message || "Blog has been created successfully.");
    callback();
  };

  const updateBlog = async ({ blogId = "", fields = [], setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    const data = await blogsApi.updateBlog({ id: blogId, body: fields });

    setIsLoading(false);

    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-blog");
    getBlogs();
    successAlert(data.message || "Blog has been updated successfully.");
    callback();
  };

  const deleteBlog = async ({ blogId = "", setIsLoading = (_: boolean) => {}, callback = () => {} }) => {
    setIsLoading(true);

    const data = await blogsApi.deleteBlog({ id: blogId });

    setIsLoading(false);
    if (!data.success) return errorAlert(data.message);

    console.log(data, " data-blog");
    getBlogs();
    successAlert(data.message || "Content has been deleted successfully.");

    callback();
  };

  // useEffect(() => {
  //   if (!currentUser) return;
  //   getBlogs();
  // }, [currentUser]);

  return (
    <BlogsContext.Provider
      value={{
        fetchedBlogs,
        fetchedBlog,

        getBlogs,
        getBlog,
        createBlog,
        updateBlog,
        deleteBlog,
      }}
    >
      {children}
    </BlogsContext.Provider>
  );
}

export const useBlogsContext = () => {
  const context = useContext(BlogsContext);
  if (!context) {
    throw new Error("useBlogsContext must be used within an BlogsProvider");
  }
  return context;
};
