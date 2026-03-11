import { FirestoreDoc } from "./firestore";
import { Status } from "./common";

export type Blog = FirestoreDoc & {
  status: Status;
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  shortDescription: string;
  slug: string;
  content: string;
  editorState: any;
  // tags: string[];
  images: {[key:string]:string}[];
};