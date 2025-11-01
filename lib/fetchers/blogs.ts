import { doc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config/firebase";

export async function fetchBlog({ subDocumentId = "" }) {
  try {
    const subDocRef = doc(db, "website-content", "blog-page", "blog", subDocumentId);
    const res = await getDoc(subDocRef);

    if (!res.exists()) throw new Error("Content not found");

    const data: any = { id: res.id, ...res.data() };
    return data.blog;
  } catch (err) {
    console.error("=fetchBlog= error:", err);
    return {};
  }
}

export async function fetchBlogs() {
  try {
    const subCollectionRef = collection(db, "website-content", "blog-page", "blog");
    const res = await getDocs(subCollectionRef);
    const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      //  await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));
    return [...data.map((item: any) => ({ ...item.blog }))];
  } catch (err: any) {
    console.error("=fetchBlogs= error:", err);
    return [];
  }
}

// universal sample (not important)
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "@/lib/firebase/config/firebase";

// export async function getSingleSubPage({
//   collectionName = "",
//   documentId = "",
//   subCollectionName = "",
//   subDocumentId = "",
// }: {
//   collectionName: string;
//   documentId: string;
//   subCollectionName: string;
//   subDocumentId: string;
// }) {
//   try {
//     const subDocRef = doc(db, collectionName, documentId, subCollectionName, subDocumentId);
//     const res = await getDoc(subDocRef);

//     if (!res.exists()) {
//       throw new Error("Content not found");
//     }
//     //   await new Promise((resolve) => setTimeout(resolve, 10000));

//     const data: any = { id: res.id, ...res.data() };
//     return data.blog;
//   } catch (err: any) {
//     console.error("getSingleSubPage error:", err);
//     throw new Error(err.message || "Failed to fetch blog item");
//   }
// }
