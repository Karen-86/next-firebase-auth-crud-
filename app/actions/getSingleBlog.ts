import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";

export async function getSingleSubPageServer({
  collectionName = "",
  documentId = "",
  subCollectionName = "",
  subDocumentId = "",
}: {
  collectionName: string;
  documentId: string;
  subCollectionName: string;
  subDocumentId: string;
}) {
  try {
    const subDocRef = doc(db, collectionName, documentId, subCollectionName, subDocumentId);
    const res = await getDoc(subDocRef);

    if (!res.exists()) {
      throw new Error("Content not found");
    }
    //   await new Promise((resolve) => setTimeout(resolve, 10000));

    const data: any = { id: res.id, ...res.data() };
    return data.blog;
  } catch (err: any) {
    console.error("getSingleSubPageServer error:", err);
    throw new Error(err.message || "Failed to fetch blog item");
  }
}
