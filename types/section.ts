import { FirestoreDoc } from "./firestore";
import { Status } from "./common";

export type Section = FirestoreDoc & {
  status: Status;
  title: string;
  description: string;
  sectionName: string;
  images: { [key: string]: string }[];
};
