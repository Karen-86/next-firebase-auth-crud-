import { FirestoreDoc } from "./firestore";
import { Status } from "./common";

export type Blog = FirestoreDoc & {
  seoTitle?: string;
  seoDescription?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  slug?: string;
  content?: string;
  editorState?: string;
  authorId?: string;
  tags?: string[];
  images?: {[key:string]:string}[];
  status?: Status;
};