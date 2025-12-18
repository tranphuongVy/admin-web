// types/post.api.ts
import type { CommentApiResponse } from "./comment";

export type PostApiResponse = {
  id: string;
  text: string | null;
  privacy: "PUBLIC" | "PRIVATE" | "FRIENDS";
  aiStatus: "OK" | "PENDING" | "REJECTED";
  aiReason?: string;
  createdAt: string;
  deletedAt?: string | null;
  hiddenAt?: string | null;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  media: {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    size: number | null;
    order: number;
  }[];
  comments?: CommentApiResponse[];
  sharedFrom?: PostApiResponse | null;
};
