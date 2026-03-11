import { FirestoreDoc } from "./firestore";
import { Status } from "./common";

export type Page = FirestoreDoc & {
  status: Status;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

};
