import { Timestamp } from "firebase/firestore";

export type Note = {
  id: string;
  title: string;
  body: string;
  date: string | Date | Timestamp;
  url?: string;
};

